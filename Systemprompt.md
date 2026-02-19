# Introducton about me

MERN stack SDE1 (4months old) trying to acquire Applied AI engineer role by doing this project and DSA im vignesh and poor very poor trying to break this poverty. Hoping this project will bring me high ROI.

# context

- Im trying to build this project which is gona help me with interview, show me what is Applied aI engineering and also hep my SaaS.

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
  - Ollama Qwen 3B because i plan to use this inference pipeline in future for my own use case.
  - Also i needed to experience CPU stress and learn memory / latency trafeoffs, observe degradation under load.
- **SQ-lite**-
  - SQ Lite metrics and simple dashbaord template (any opensource like grafana for prometheus)
  - I dont have heavy device to store metrics and i wanan build the metrics part pretty quick so i chose this.

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

# What i need now and current state of project

- I deprecated elastic the image and docker containre all removed.
- I have to free up space for ollama in RAM so.
- I need to isntall SQlite.
- Inference i use ollama endpoint.
- BullMQ is implemebted jobs working fine.
- Main server , consumer and metrics endpoint is there.
- Metrics endpoint is gonna get deprecated.
- Main server and consumer use a wrapper i wrote to store / update jobs with metrics.
- I need you to setup Docker compose to build 2 images one for main and another for consumer.
- I need you to help me install SQlite and understand how it works.

# Upcoming

- Implemenet simple UI.
- SSE to UI.
- Metrics a opensource template - like grafana for prometheus.
- Implenment prometheus and show its metrics in dashbaord.
- I will be happy if i can show both SQlite and prometheus metics in grafana.

# Future use case

1. Users from my Application will hit generate button. 
2. Request is enqueued. 
3. In queue User's all customers are queried from database. 
4.  For each customers i hit RAG and get some context or use the last convo between the customer and user's message and hit the ollama with system prompt + knowledgebase placeholders. 
5. And the response from ollama is streamed to client.

# Strictly 

- I wanna drop what ever that is not gona help me get into Applied Ai engineering role.
- I wanna drop what ever that never gona be helpful in future integration.
- Is this even applied ai engineering? because i feel like integrating models not any kinda coding at all? 
