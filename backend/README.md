# Sarwan Kumar Pandey - AI Portfolio Assistant Backend

This is the FastAPI backend service that powers the interactive AI Assistant on Sarwan's portfolio website. It integrates with Google Gemini 1.5 Flash and a sanitized, code-level knowledge base of all GitHub projects (FaceID Studio, RAG Pipeline, Sequence Prediction RNNs, CIFAR-10 FastAPI Classifier, and ROS 2 Robotics).

---

## 🔒 Security & Sensitive Data Protection
This service includes a **multi-layer security guardrail**:
1. **Curated Ingestion**: Only public architecture, algorithms, and logic are indexed. No `.env`, credentials, or private config files are ever exposed.
2. **System Prompt Defense**: The LLM is strictly instructed never to reveal API keys, tokens, or credentials, and to resist prompt injection attempts.
3. **Automated Output Sanitization**: All responses pass through regex redaction patterns targeting GitHub tokens, Google API keys, OpenAI keys, passwords, and connection strings.

---

## 🚀 Running Locally

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Your Free Gemini API Key:**
   Get a free key from [Google AI Studio](https://aistudio.google.com/), then copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your key in `.env`:
   ```env
   GEMINI_API_KEY=your_actual_gemini_key_here
   ```

3. **Start the Server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The service will run at `http://localhost:8000`. You can test the interactive documentation at `http://localhost:8000/docs`.

---

## 🌐 Free 1-Click Deployment (Render.com)

1. Push this repository to your GitHub account.
2. Sign up at [Render.com](https://render.com) (100% Free).
3. Click **New +** → **Web Service** → Connect your GitHub repository `My-Portfolio`.
4. Configure:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = *(Your Gemini key from Google AI Studio)*
6. Click **Deploy Web Service**.
7. Once deployed, copy your Render URL (e.g. `https://sarwan-portfolio-api.onrender.com`) and paste it as `API_BACKEND_URL` in `script.js`!
