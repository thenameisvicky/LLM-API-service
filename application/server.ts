import express from 'express';
import { Queue } from 'bullmq';

/**
 * Express server (MAIN)
 * Receives API request - Enqueues it
 * Producer for Queue
 */

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const queue = new Queue('LLM_INFERENCE', {
    connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
})

/**
 * POST /api/v1/chat
 * Enqueues the user query
 * Queue - LLM_INFERENCE
 * Action - TEXT_GENERATION
 */

app.post('/api/v1/req', async (req, res) => {
    const { prompt } = req.body;

    try {
        const job = await queue.add("TEXT_GENERATION", {
            prompt: prompt
        });

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
                    event: "REQUEST_ENQUEUED",
                    data: {
                        prompt: prompt.length
                    },
                    "@timestamp": new Date().toISOString(),
                },
                update: false
            })
        });

        return res.json({
            message: `Request enqueued successfully - id: ${job.id}, data: ${JSON.stringify(job.data)}`
        });
    } catch (error) {
        console.log(`[MAIN] - Error enqueuing request:${error}`);
        return res.status(500).json({
            error: `Error enqueuing Request - ${error}`
        });
    }
});

app.listen(PORT, () => {
    console.log(`Application Listening on port ${PORT}`);
})