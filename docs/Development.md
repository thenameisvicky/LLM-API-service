# Development milestone

## Phase 1 – Baseline Inference

- Queue-based job processing
- CPU-only LLM inference
- Log metrics in elastic

## Phase 2 – Observability

- Prometheus metrics
- p95 latency tracking
- CPU and memory dashboards
- Every thing in kiabana no grafana

## Phase 3 – Backpressure & Stability

- Concurrency limits
- Queue rejection thresholds
- Retry policies

## Phase 4 – Streaming & UX

- Token streaming via SSE
- Time-to-first-token optimization
- Only after implementing dashboard

## Phase 5 – Scaling Experiments

- Multiple inference workers
- Model warm pool exploration

# Low level design

## Main server

- Has end point which receives request and streams the response to client.
- `api/v1/req` is REST API which gets upgradede to stream when response is here until then this pings with client.
- Basically this end point is similar the the CDN end point that serves the HTML via streaming.
- Will implement this streaming logic after dashboard is done.

## Queue system

- For now only one Queue`LLM_INFERENCE` and consumer.
- Consumer receives the Job and executes it.

## Metrics system

# Learnings

## Docker

- docker network create llm-network
- docker ps
- docker logs
- docker run -d --name container_name -p port:port --network docker_network_name image_name
- docker stop container_name
- docker rm container_name
- docker network ls
- docker network inspect network_name
- docker network ls
- docker exec -it image_name bash
- docker exec -it image_name sh
- docker images
- docker images ls
- docker pull image_name
- docker pull docker.image_name
- docker rmi image_name
- docker rmi -f image_name
- docker build -t image_name
- docker run -it --name container_name ubuntu:22.04
- docker commit conatiner_name image_name
- docker rm -f $(docker ps -aq)
- docker rmi -f $(docke images -q)
- docker start $(docker ps -aq)
- docker stop $(docker ps -q)
- docker system prune -a
- docker history container_name
- docker tag existing_image_tag new_image_gona_tagged
- docker image prune
