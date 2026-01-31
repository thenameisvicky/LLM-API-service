import express from 'express';
import { Queue } from 'bullmq';

/**
 * Express server (MAIN)
 * Receives API request - Enqueues it
 * Producer for Queue
 */

const app = express();
app.use(express.json());

const queue = new Queue('LLM_INFERENCE', {
    connection: {
        host: '127.0.0.1',
        port: 6379,
    }
})


/**
 * POST /api/v1/chat
 * Enqueues the user query
 * Queue - LLM_INFERENCE
 * Action - TEXT_GENERATION
 */

app.post('/api/v1/req', async (req, res) => {
    const { message } = req.body;

    const job = await queue.add("TEXT_GENERATION", {
        message: message
    });

    return res.json({
        message: `Request enqueued successfully - id: ${job.id}, data: ${JSON.stringify(job.data)}`
    });
});

app.listen(3000, () => {
    console.log("Application Listening on port 3000");
})