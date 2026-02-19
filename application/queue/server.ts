import { Worker } from 'bullmq';
import client from 'prom-client';
import express from 'express';
import pidusage from 'pidusage';

const metricsApp = express();

metricsApp.use(express.json())

const register = new client.Registry();
client.collectDefaultMetrics({ register });

metricsApp.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

const jobsProcessed = new client.Counter({
    name: 'jobs_processed_total',
    help: 'Total jobs processed',
    registers: [register]
});

const jobsFailed = new client.Counter({
    name: 'jobs_failed_total',
    help: 'Total failed jobs',
    registers: [register]
});

const inferenceLatency = new client.Histogram({
    name: 'inference_latency_ms',
    help: 'Inference latency',
    buckets: [500, 1000, 2000, 5000, 10000],
    registers: [register]
});

const tokensGeneratedMetric = new client.Histogram({
    name: 'tokens_generated',
    help: 'Tokens generated per inference',
    buckets: [10, 50, 100, 200, 500],
    registers: [register]
});

const tokensUsedMetric = new client.Histogram({
    name: 'tokens_used',
    help: 'Tokens used in prompt',
    buckets: [10, 50, 100, 200, 500, 1000],
    registers: [register]
});

const inferenceDurationMetric = new client.Histogram({
    name: 'inference_duration_ms',
    help: 'Model reported inference duration',
    buckets: [500, 1000, 2000, 5000, 10000],
    registers: [register]
});

const tokensPerSecondMetric = new client.Gauge({
    name: 'tokens_per_second',
    help: 'Tokens generated per second',
    registers: [register]
});

const queueWaitTimeMetric = new client.Histogram({
    name: 'queue_wait_time_ms',
    help: 'Time job waited in queue before processing',
    buckets: [10, 50, 100, 500, 1000, 5000],
    registers: [register]
});

const cpuGauge = new client.Gauge({
    name: 'worker_cpu_percent',
    help: 'Worker CPU usage percent',
    registers: [register]
});

const memoryGauge = new client.Gauge({
    name: 'worker_memory_bytes',
    help: 'Worker memory usage in bytes',
    registers: [register]
});

setInterval(async () => {
    const stats = await pidusage(process.pid);
    cpuGauge.set(stats.cpu);
    memoryGauge.set(stats.memory);
}, 5000);

const worker = new Worker("LLM_INFERENCE", async job => {
    try {
        const end = inferenceLatency.startTimer();

        const response = await fetch(`http://${process.env.INFERENCE_HOST}:${process.env.INFERENCE_PORT}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "qwen2.5:3b",
                prompt: job.data.prompt,
                stream: false
            })
        });

        const data = await response.json();
        
        jobsProcessed.inc();
        end();

        const tokensUsed = data.prompt_eval_count;
        const tokensGenerated = data.eval_count;
        const duration = data.total_duration / 1_000_000;
        const tokensPerSecond =
            data.eval_count / (data.eval_duration / 1_000_000_000);

        inferenceDurationMetric.observe(duration);
        tokensUsedMetric.observe(tokensUsed);
        tokensGeneratedMetric.observe(tokensGenerated);
        tokensPerSecondMetric.set(tokensPerSecond);

        const now = Date.now();
        const queueWaitTime = now - job.timestamp;
        queueWaitTimeMetric.observe(queueWaitTime);

    } catch (error) {
        console.log(`[CONSUMER] - Errored during inference:${error}`);
        jobsFailed.inc();
    }

}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
});

worker.on("ready", () => {
    console.log("Consumer ready!");
});

worker.on("failed", () => {
    console.log("Consumer crashed!")
})

metricsApp.listen(3001);