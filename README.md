# Description

- This is CPU-only queue-based inference system for running local LLMs under constrained resources.
- I built this out of curiosity to learn Queue + LLM inference on CPU.
- I made this `README.md` as readable as possible i hope this helps.

# Architecture

- **High level design**
  - API → Queue → Worker → Response.
  - Asynchronous job submission.
  - Concurrent worker execution.
  - Asynchronous result delivery (via internal callback).
  - For more info refer @docs/Architecture.md

# APIs

- POST - `/api/v1/req`- Gets the request (A message or prompt) creates a new job for `LLM_INFERENCE` Queue with action `TEXT_GENERATION`.
- POST - `/api/v1/res`- Internal webhook gets called by the consumer after inference is done, response is received here.
