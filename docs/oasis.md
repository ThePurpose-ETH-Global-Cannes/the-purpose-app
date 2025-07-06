Absolutely! Here's a summary PRD for integrating Oasis Protocol's ROFL+Sapphire AI summarizer into your Next.js app. This is developer-focused and links out to all relevant docs/examples. The steps and architecture are streamlined, covering both on-chain (Sapphire) and off-chain (ROFL) flows, using a pre-trained LLM for transcript summarization.

⸻

PRD: Video Transcript Summarization on Oasis Protocol (ROFL + Sapphire)

Project Goal
	•	Input: Video transcript (plain text, already extracted in your Next.js app)
	•	Output: Key concept summary (Markdown bullet list, e.g. - **Concept:** Explanation)
	•	Method: On-chain coordination and storage (Oasis Sapphire), off-chain LLM inference (Oasis ROFL), enabling reuse and cost savings by caching summaries on-chain.
	•	Model: Use a pre-trained open LLM (e.g. Mistral 7B or Llama-2 7B/13B) running inside a Trusted Execution Environment (TEE).
	•	Tech stack: Next.js frontend, Solidity (Sapphire), Python/Node for ROFL Oracle, Ollama or HuggingFace for the LLM.

⸻

System Architecture Overview

flowchart TD
    A[User uploads transcript (Next.js)] --> B[requestAnalysis (Sapphire contract)]
    B -->|if cached| F[Return summary]
    B -->|if new| C[AnalysisRequested event]
    C --> D[ROFL Oracle (TEE)]
    D --> E[LLM Model (Ollama/HF)]
    E --> D
    D --> G[submitAnalysis (Sapphire contract)]
    G --> F
    F --> H[User sees Markdown summary]


⸻

Component Responsibilities
	1.	Next.js Frontend
	•	Accept transcript input, generate unique videoId (e.g., sha256(transcript)).
	•	Call contract's getAnalysis(videoId). If summary exists, show it; else, call requestAnalysis(videoId, pointer).
	•	Show status/loading. When AnalysisCompleted(videoId) event fires or polling returns data, display summary (rendered Markdown).
	•	Use wagmi/ethers for EVM interactions.
	2.	Sapphire Smart Contract
	•	Solidity contract stores analysisResults[videoId] (summary).
	•	requestAnalysis(videoId, pointer): Starts analysis request, emits AnalysisRequested.
	•	submitAnalysis(videoId, summary): ROFL Oracle writes result (enforces ROFL TEE origin via roflEnsureAuthorizedOrigin()).
	•	getAnalysis(videoId): Returns summary if available.
	•	See demo-chat contract and ROFL docs for patterns.
	3.	ROFL Oracle (TEE app)
	•	Listens for AnalysisRequested.
	•	Fetches transcript from pointer (IPFS/URL).
	•	Prompts LLM: "Summarize this transcript as 5-7 key concepts in Markdown bullet format."
	•	Sends summary via submitAnalysis.
	•	See Oasis demo-rofl-chatbot for code, ROFL quickstart.
	4.	LLM Model Service
	•	Ollama container or HuggingFace pipeline, loaded with mistral-7b-instruct, llama-2-7b-chat, or similar.
	•	Accessible to Oracle for local inference (no 3rd party API).

⸻

Prompt Example for LLM

Summarize the following transcript into 5-7 key concepts.
Each bullet point must start with the concept in bold, a colon, and a one-sentence explanation. Use Markdown format.

Transcript:
[transcript]

Key Concepts:


⸻

Integration Plan & Progress

The integration is broken down into phases. Use the checkboxes to track progress.

**Phase 1: Environment & On-Chain Setup**
*   [ ] **1. Set Up Oasis Environment**
    *   [ ] Install Oasis CLI
    *   [ ] Get Sapphire Testnet tokens
    *   [ ] Configure Sapphire RPC
*   [ ] **2. Develop & Deploy Sapphire Smart Contract (V1)**
    *   [ ] Scaffold Solidity contract (`PurposeSummary.sol`).
    *   [ ] Implement `requestAnalysis(videoId, pointer)` and `getAnalysis(videoId)`.
    *   [ ] Initially, `submitAnalysis` can be public for testing.
    *   [ ] Deploy to Sapphire Testnet.

**Phase 2: Off-Chain Oracle and LLM**
*   [ ] **3. Build ROFL Oracle App**
    *   [ ] Set up a listener for `AnalysisRequested` events.
    *   [ ] Implement logic to fetch transcript from `pointer`.
    *   [ ] Call the LLM service to get a summary.
    *   [ ] Call `submitAnalysis` on the contract with the summary.
*   [ ] **4. Add LLM Model Service**
    *   [ ] Deploy a pre-trained model (e.g., Mistral 7B) using Ollama.
    *   [ ] Expose it via a simple API for the Oracle.

**Phase 3: Frontend Integration & Finalization**
*   [ ] **5. Connect Next.js Frontend**
    *   [ ] Integrate `wagmi`/`ethers` to interact with the deployed contract.
    *   [ ] Build UI to submit a transcript and display the summary.
    *   [ ] Handle loading/pending states.
*   [ ] **6. Testing & Security**
    *   [ ] Conduct end-to-end tests.
    *   [ ] Secure `submitAnalysis` with `roflEnsureAuthorizedOrigin()`.
    *   [ ] Test caching by resubmitting video IDs.
    *   [ ] Render summary with `react-markdown`.

⸻

Links & References
	•	Oasis ROFL Docs
	•	Oasis Sapphire Docs
	•	Demo ROFL Chatbot (Full Stack Example)
	•	ROFL 101 Video
	•	ROFL 201 Video
	•	ROFL Cheatsheet PDF
	•	Ollama (Local LLM Server)
	•	Mistral 7B on HuggingFace
	•	Oasis Testnet Faucet
	•	Oasis Sapphire Explorer

⸻

Best Practices
	•	Make sure LLM prompt is explicit and tested on sample transcripts.
	•	Store only short summaries on-chain; use off-chain for large transcript blobs.
	•	Gate submitAnalysis to TEE-originated calls using Oasis' provided primitives.
	•	Use Markdown rendering for user output.
	•	Consider privacy: summaries are public for reuse, transcripts can be encrypted if needed.

⸻

FAQ
	•	What model do we use?
Default: mistral-7b-instruct or llama-2-7b-chat, via Ollama/HF in ROFL TEE.
	•	Is the summary public?
Yes—stored on-chain for reuse/cost saving.
	•	What if video is already processed?
App fetches cached summary from contract.

⸻

For full examples and troubleshooting, refer to the Oasis demo-chat repo, which closely mirrors our desired architecture.

⸻

Questions?
Check the Oasis Discord or reach out on Telegram.