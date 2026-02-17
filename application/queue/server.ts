import { Worker } from 'bullmq';

/**
 * BullMQ server (Consumer)
 * Consumes from Producer
 * Handles Inference
 */

const worker = new Worker("LLM_INFERENCE", async job => {
    try {
        const start = Date.now();

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

        const tokensUsed = data.prompt_eval_count;
        const tokensGenerated = data.eval_count;
        const duration = data.total_duration / 1_000_000;
        const tokensPerSecond =
            data.eval_count / (data.eval_duration / 1_000_000_000);

        const latency = Date.now() - start;

        await fetch(`http://${process.env.ELASTIC_HOST}:${process.env.ELASTIC_PORT}/api/v1/metrics/elastic`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                index: "cpu-inference",
                id: job.id,
                document: {
                    jobId: job.id,
                    event: "REQUEST_RESOLVED",
                    data: {
                        prompt: job.data.prompt.length
                    },
                    "@timestamp": new Date().toISOString(),
                    inference_api_Latency: latency,
                    inference_duration: duration,
                    inference_tokens_used: tokensUsed,
                    inference_tokens_generated: tokensGenerated,
                    inferece_tokens_generated_per_second: tokensPerSecond
                },
                update: true
            })
        });
    } catch (error) {
        console.log(`[CONSUMER] - Errored during inference:${error}`);
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