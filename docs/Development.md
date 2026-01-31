# Roadmap

## Phase 1 – Baseline Inference (Current)

- Queue-based job processing
- CPU-only LLM inference
- Internal webhook for results

## Phase 2 – Observability

- Prometheus metrics
- p95 latency tracking
- CPU and memory dashboards

## Phase 3 – Backpressure & Stability

- Concurrency limits
- Queue rejection thresholds
- Retry policies

## Phase 4 – Streaming & UX

- Token streaming via SSE
- Time-to-first-token optimization

## Phase 5 – Scaling Experiments

- Multiple inference workers
- Model warm pool exploration

# Low level design

## Main server

- Has end point which receives request and streams the response to client.
- `api/v1/req` is REST API which gets upgradede to stream when response is here until then this pings with client.
- Basically this end point is similar the the CDN end point that serves the HTML via streaming.

## Queue system

- For now only one Queue`LLM_INFERENCE` and consumer.
- Consumer receives the Job and executes it.
- 
