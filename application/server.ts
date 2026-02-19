import express from 'express';
import { Queue } from 'bullmq';
import client from 'prom-client'

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Queue registry
const queue = new Queue('LLM_INFERENCE', {
    connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
})

// Prometheus registry
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const apiRequests = new client.Counter({
    name: 'api_requests_total',
    help: 'Total API requests',
    registers: [register]
});

const apiFailures = new client.Counter({
    name: 'api_failures_total',
    help: 'Total failed API requests',
    registers: [register]
});

const apiLatency = new client.Histogram({
    name: 'api_latency_ms',
    help: 'API latency in ms',
    buckets: [10, 50, 100, 200, 500, 1000],
    registers: [register]
});


app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.post('/api/v1/generate', async (req, res) => {
    const { prompt } = req.body;

    const end = apiLatency.startTimer();
    apiRequests.inc();

    try {
        const job = await queue.add("TEXT_GENERATION", {
            prompt: prompt
        });

        end();

        return res.json({
            message: `Request enqueued successfully - id: ${job.id}, data: ${JSON.stringify(job.data)}`
        });
    } catch (error) {
        console.log(`[LLM]- Error adding a job ${error}`)
        apiFailures.inc();
        end();
        return res.status(500).json({
            error: `Error enqueuing Request - ${error}`
        });
    }
});

app.listen(PORT, () => {
    console.log(`Application Listening on port ${PORT}`);
})