# Metrics and Observations

- # Metrics & Observability

This document describes the metrics used to evaluate performance,
capacity, and stability of the inference system.
Sections to include

1. Latency Metrics
Queue wait time

Inference latency

Time-to-first-token

End-to-end latency

Why:

Identifies bottlenecks under load.

1. Throughput Metrics
Requests per second

Tokens per second

Concurrent jobs

Why

Determines system capacity.

1. Resource Metrics
CPU utilization

Memory usage

Threads per inference

Why:

Prevents CPU saturation and OOM failures.

1. Queue Health
Queue depth

Retry count

Failed jobs

Why:

Early signal of backpressure.

1. (Future) Streaming Metrics
Token generation rate

Partial response latency

1. Infernce metrics
model_load_time

first_token_latency

tokens_generated

tokens_per_second

cpu_time_per_job
