# Architecture Explanation

- I have implemented microservice architecture.
- Microservice architecture because i need to run python server for LLM inference, and as the Queue system is built in javascript, architecturally this is best cause the services will be not be coupled and this will make your life easier.

# Tech stack and Reasoning

- **Queue**-
  - I needed background tasks to be ran.
  - BullMQ fits this use case because it is for background tasks and compatability with nodeJS.
  - BullMQ uses redis internally to schedule retries, concurrent jobs and delayed execution.
- **NodeJS**-
  - Node js for speed development.
  - Good for Queue based workload cause can implement nodeJs event driven and dynamic.
  - NodeJS has strong and big ecosystem.
  - I know NodeJs so i used it.
- **LLM-Model**-
  - Mistral7B Q4 because i plan to use this inference pipeline in future for my own use case.
  - Also i needed to experience CPU stress and learn memory / latency trafeoffs, observe degradation under load.
- **Elastic + Kibana**-
  - Elastic + kibana to build dashboards because i know these.

# Data flow

flowchart LR
    Client -->|Prompt| API[Express API]
    API -->|Enqueue Job| Queue[BullMQ]
    Queue --> Redis[(Redis)]
    Redis --> Worker[Queue Consumer]
    Worker -->|HTTP Call| Inference[FastAPI Inference Service]
    Inference -->|Generated Text| Worker
    Worker -->|Store Metrics| Redis
    Elastic & Prometheus API -->|Fetch Result| Redis
