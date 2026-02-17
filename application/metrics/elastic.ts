import express from "express"
import { Client } from "@elastic/elasticsearch"


/**
 * Elastic server
 * Every microservice hits this endpoint to store or update logs
 */
const PORT = process.env.PORT;
const ELASTIC_HOST = process.env.ELASTIC_HOST;
const ELASTIC_PORT = process.env.ELASTIC_PORT;

const app = express();
app.use(express.json());


/**
 * Shared elastic instance
 */
const elastic = new Client({
    node: `http://localhost:9200`
})

app.post('/api/v1/metrics/elastic', async (req, res) => {
    const { index, id, document, update } = req.body;

    try {
        if (update) {
            const response = await elastic.update({
                index,
                id,
                doc: document,
                doc_as_upsert: true
            });
            return res.json({
                response: response,
                message: `Elastic document updated`
            });
        } else {
            const response = await elastic.index({
                index: index,
                id: id,
                document: document
            });
            return res.json({
                response: response,
                message: `Elastic document inserted`
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: `Elastic error: ${error}`
        });
    }
});

app.listen(PORT, () => {
    console.log(`Elastic listening on port ${PORT}`)
})