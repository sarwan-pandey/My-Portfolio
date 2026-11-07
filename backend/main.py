import os
import re
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load local environment variables from .env if present
load_dotenv()

from projects_kb import PROJECTS_KNOWLEDGE_BASE

app = FastAPI(
    title="Sarwan Kumar Pandey - AI Assistant API",
    description="Code-level technical representative for GitHub projects with strict secret redaction.",
    version="1.0.0"
)

# Enable CORS for GitHub Pages and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows GitHub Pages (https://sarwan-pandey.github.io) and local testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Regular expression pattern to catch and redact any sensitive secrets or tokens
SENSITIVE_PATTERNS = [
    r'ghp_[A-Za-z0-9_]{36}',                     # GitHub Personal Access Token
    r'gho_[A-Za-z0-9_]{36}',                     # GitHub OAuth Token
    r'AIza[0-9A-Za-z-_]{35}',                    # Google API Key
    r'sk-[A-Za-z0-9]{32,}',                      # OpenAI Secret Key
    r'hf_[A-Za-z0-9]{34,}',                      # Hugging Face Access Token
    r'(?i)(password|passwd|secret)\s*[:=]\s*["\'][^"\']+["\']', # Passwords
    r'(?i)(bearer|token)\s+[A-Za-z0-9_\-\.]{20,}', # Bearer tokens
    r'-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----', # Private keys
    r'postgres(?:ql)?://[^:]+:[^@]+@[^/]+/[^\s]+', # Database connection strings
    r'mongodb(?:\+srv)?://[^:]+:[^@]+@[^/]+/[^\s]+'
]

def sanitize_response(text: str) -> str:
    """
    Ensures that no sensitive API tokens, passwords, or connection strings
    are leaked in the assistant's answer.
    """
    sanitized = text
    for pattern in SENSITIVE_PATTERNS:
        sanitized = re.sub(pattern, '[REDACTED_SECURITY_DATA]', sanitized)
    return sanitized

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    status: str = "success"

# Initialize Gemini model if API key is provided
api_key = os.getenv("GEMINI_API_KEY", "")
gemini_model = None

if api_key:
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        gemini_model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=PROJECTS_KNOWLEDGE_BASE
        )
        print("Gemini 1.5 Flash initialized successfully.")
    except Exception as e:
        print(f"Warning: Could not initialize Gemini API: {e}")

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "Sarwan Kumar Pandey Portfolio AI Assistant",
        "llm_ready": gemini_model is not None,
        "security_guardrails": "Active (Ingestion & Regex Output Redaction)"
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    user_msg = request.message.strip()
    if not user_msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # Security check: Immediate block on direct key-probing attempts
    lower_query = user_msg.lower()
    if any(k in lower_query for k in [".env", "api key", "apikey", "secret key", "private token", "credentials"]):
        return ChatResponse(
            reply="I can explain the architecture, algorithms, and code logic of Sarwan's GitHub projects in full detail, but all environment credentials, tokens, and private keys are strictly confidential.",
            status="filtered"
        )

    # 1. Use real Gemini LLM if configured
    if gemini_model:
        try:
            response = gemini_model.generate_content(user_msg)
            safe_reply = sanitize_response(response.text)
            return ChatResponse(reply=safe_reply, status="success")
        except Exception as e:
            print(f"Gemini API generation error: {e}")
            # Fall back gracefully to structured knowledge base query

    # 2. Intelligent Structured Fallback when running without external API key
    fallback_reply = generate_structured_response(user_msg)
    return ChatResponse(reply=sanitize_response(fallback_reply), status="fallback")


def generate_structured_response(query: str) -> str:
    """
    Provides robust, comprehensive code-level responses even before an external API key is added.
    """
    q = query.lower()

    if any(k in q for k in ["faceid", "face", "insightface", "onnx"]):
        return (
            "<strong>FaceID Studio (Real-Time Face Recognition):</strong><br>"
            "• <strong>Architecture:</strong> Multithreaded architecture decoupling camera capture, ONNX inference, and UI rendering.<br>"
            "• <strong>Model:</strong> InsightFace ArcFace models executed via ONNX Runtime `InferenceSession` for sub-50ms inference.<br>"
            "• <strong>Embeddings & Caching:</strong> Extracts 512-D normalized L2 feature vectors with SHA-256 gallery image signature validation, avoiding redundant embedding rebuilds.<br>"
            "• <strong>Thresholds:</strong> Configurable cosine similarity matching (0.55–0.65 threshold) with full gallery management."
        )
    elif any(k in q for k in ["rag", "langchain", "faiss", "retrieval"]):
        return (
            "<strong>Retrieval-Augmented Generation (RAG) Pipeline:</strong><br>"
            "• <strong>Chunking:</strong> Ingests technical documentation using `RecursiveCharacterTextSplitter` (chunk size ~600 tokens, 100-token overlap).<br>"
            "• <strong>Vector Embeddings:</strong> Generates 384-dimensional dense semantic vectors using Hugging Face `all-MiniLM-L6-v2`.<br>"
            "• <strong>Vector Index:</strong> Indexed in FAISS (`IndexFlatL2` / `IndexIVFFlat`) for sub-second similarity search.<br>"
            "• <strong>Synthesis:</strong> Retrieves Top-K (k=3-5) closest context passages to ground the LLM generation and eliminate hallucinations."
        )
    elif any(k in q for k in ["rnn", "lstm", "gru", "time series", "sequence"]):
        return (
            "<strong>Sequence Prediction using RNNs:</strong><br>"
            "• <strong>Task:</strong> Time-series telemetry forecasting and NLP next-word prediction in TensorFlow/Keras.<br>"
            "• <strong>Architecture Benchmarking:</strong> Evaluated 3 architectures: SimpleRNN (vanilla recurrent cells), LSTM (cell state with input, forget, and output gates), and GRU (reset and update gates).<br>"
            "• <strong>Results:</strong> GRU converged significantly faster with ~25% fewer parameters while matching LSTM's low Mean Squared Error (MSE)."
        )
    elif any(k in q for k in ["cifar", "image classifier", "cnn", "fastapi"]):
        return (
            "<strong>Image Classifier Web Application:</strong><br>"
            "• <strong>Dataset & Model:</strong> CNN trained on the 10-class CIFAR-10 dataset (60,000 images) using Conv2D, BatchNormalization, MaxPooling, and Dropout regularization.<br>"
            "• <strong>Serving:</strong> Served through an asynchronous FastAPI service (`POST /predict`) processing `UploadFile` streams in <25ms.<br>"
            "• <strong>Output:</strong> Returns predicted class, confidence scores, and probability distribution."
        )
    elif any(k in q for k in ["robotics", "ros", "iiit", "slam", "drone"]):
        return (
            "<strong>Robotics at Center of Intelligent Robotics, IIIT Allahabad:</strong><br>"
            "• <strong>ROS 2 Workflows:</strong> Developed node publishers, subscribers, and action servers on ROS 2.<br>"
            "• <strong>Simulation:</strong> Physical robot and drone simulations in Gazebo and Webots.<br>"
            "• <strong>Navigation & SLAM:</strong> Implemented 2D/3D LiDAR SLAM (Cartographer/SLAM Toolbox) and Navigation2 (Nav2) costmaps with local planners."
        )
    elif any(k in q for k in ["cert", "isro", "aws"]):
        return (
            "<strong>Sarwan's Certifications:</strong><br>"
            "1. <strong>AWS Academy</strong> – Machine Learning Foundations<br>"
            "2. <strong>AWS Academy</strong> – Generative AI Foundations<br>"
            "3. <strong>ISRO (IIRS Dehradun)</strong> – AI/ML for Geodata Analytics"
        )
    else:
        return (
            "I can explain any of Sarwan's GitHub projects at the code level! Ask me about:<br>"
            "• <strong>FaceID Studio</strong>: Multithreaded ONNX facial recognition.<br>"
            "• <strong>RAG Pipeline</strong>: LangChain, FAISS & Hugging Face vector search.<br>"
            "• <strong>RNN Sequence Prediction</strong>: Benchmarking RNN vs LSTM vs GRU.<br>"
            "• <strong>CIFAR-10 Classifier</strong>: CNN deployed with asynchronous FastAPI.<br>"
            "• <strong>Robotics at IIIT Allahabad</strong>: ROS 2, SLAM, and drone integration."
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
