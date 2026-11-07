import os
import re
import time
import urllib.request
import xml.etree.ElementTree as ET
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load local environment variables from .env if present
load_dotenv()

from projects_kb import PROJECTS_KNOWLEDGE_BASE

app = FastAPI(
    title="Sarwan Kumar Pandey - AI Assistant & Blog API",
    description="Code-level technical representative for GitHub projects with strict secret redaction and live SciHive blog integration.",
    version="1.1.0"
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

# Pre-seeded verified recent articles from SciHive (https://scihive.vercel.app)
SCIHIVE_FALLBACK_ARTICLES = [
    {
        "title": "Decoding T20 Powerplay Tactics: How Analytics Reshapes Overs 1-6",
        "url": "https://scihive.vercel.app/article/decoding-t20-powerplay-tactics-how-analytics-reshapes-overs-1-6",
        "image": "https://scihive.vercel.app/media/articles/decoding-t20-powerplay-tactics-how-analytics-reshapes-overs-1-6.jpg",
        "description": "Learn how modern T20 powerplay analytics and field placements optimize boundary scoring while helping bowlers secure vital early wickets in overs 1 to 6.",
        "category": "Sports and Cricket",
        "date": "2026-11-02"
    },
    {
        "title": "English vs Kashmir Willow: Impact on T20 Powerplay Scoring",
        "url": "https://scihive.vercel.app/article/english-vs-kashmir-willow-impact-on-t20-powerplay-scoring",
        "image": "https://scihive.vercel.app/media/articles/english-vs-kashmir-willow-impact-on-t20-powerplay-scoring.jpg",
        "description": "Explore how T20 powerplay tactics, bat willow performance, and matchup analytics drive early run rates and bowling strategies across professional leagues.",
        "category": "Sports and Cricket",
        "date": "2026-10-30"
    },
    {
        "title": "Tune Steam Deck TDP and Refresh Rates for Peak Battery",
        "url": "https://scihive.vercel.app/article/tune-steam-deck-tdp-and-refresh-rates-for-peak-battery",
        "image": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop",
        "description": "Learn how to tune Steam Deck TDP limits and screen refresh rates. Boost battery life by up to 75 percent without sacrificing visual fluidity or stable frames.",
        "category": "Handheld & Gaming",
        "date": "2026-10-25"
    },
    {
        "title": "Stream PC Games to Any Device via Sunshine and Moonlight",
        "url": "https://scihive.vercel.app/article/stream-pc-games-to-any-device-via-sunshine-and-moonlight",
        "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
        "description": "Stream PC games to any device with Sunshine and Moonlight. Master low-latency local streaming, avoid subscription costs, and preserve your game collection.",
        "category": "Handheld & Gaming",
        "date": "2026-10-22"
    },
    {
        "title": "How to Choose Cricket Bat Profiles: Low vs Mid Sweet Spot",
        "url": "https://scihive.vercel.app/article/how-to-choose-cricket-bat-profiles-low-vs-mid-sweet-spot",
        "image": "https://scihive.vercel.app/media/articles/how-to-choose-cricket-bat-profiles-low-vs-mid-sweet-spot.jpg",
        "description": "Learn how to choose cricket bat profiles between low and mid sweet spots to counter powerplay fielding setups, pitch bounce, and modern bowling analytics.",
        "category": "Sports and Cricket",
        "date": "2026-10-19"
    },
    {
        "title": "Cricket Bat Sensors vs Video: Fixing T20 Bat Path Flaws",
        "url": "https://scihive.vercel.app/article/cricket-bat-sensors-vs-video-fixing-t20-bat-path-flaws",
        "image": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop",
        "description": "Discover how cricket bat sensors and video analytics fix bat path flaws to maximize T20 powerplay boundaries while countering modern bowler rotation tactics.",
        "category": "Sports and Cricket",
        "date": "2026-10-17"
    },
    {
        "title": "Steam Deck TDP Tuning: Maximize Handheld Battery Life",
        "url": "https://scihive.vercel.app/article/steam-deck-tdp-tuning-maximize-handheld-battery-life",
        "image": "https://scihive.vercel.app/media/articles/steam-deck-tdp-tuning-maximize-handheld-battery-life.jpg",
        "description": "Optimize Steam Deck TDP to extend battery life. Learn manual power caps, frame pacing, and GPU clock tuning for balanced handheld gaming performance.",
        "category": "Handheld & Gaming",
        "date": "2026-10-11"
    },
    {
        "title": "Claude 3.5 Sonnet vs GPT-4o for Python Backend Development",
        "url": "https://scihive.vercel.app/article/claude-35-sonnet-vs-gpt-4o-for-python",
        "image": "https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=1260",
        "description": "Deep-dive benchmark comparing Claude 3.5 Sonnet and GPT-4o on real-world Python asynchronous microservices, FastAPI event loops, and refactoring performance.",
        "category": "Artificial Intelligence",
        "date": "2026-10-10"
    },
    {
        "title": "Typesafe AI Raises $870M at $7.5B Valuation",
        "url": "https://scihive.vercel.app/article/typesafe-ai-raises-870m-at-75b-valuation",
        "image": "https://scihive.vercel.app/media/articles/typesafe-ai-raises-870m-at-75b-valuation.jpg",
        "description": "Silicon Valley venture capital update: In-depth analysis of Typesafe AI's mega-funding round and its implications for enterprise AI inference infrastructure.",
        "category": "Artificial Intelligence",
        "date": "2026-10-10"
    },
    {
        "title": "Neuralink Blindsight Device FDA Trial Results October 2026",
        "url": "https://scihive.vercel.app/article/neuralink-blindsight-device-fda-trial",
        "image": "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260",
        "description": "Breakdown of the clinical trials and FDA regulatory status for Neuralink's Blindsight visual prosthesis technology and neural interfaces.",
        "category": "Health & Neuroscience",
        "date": "2026-10-09"
    }
]

# Blog cache structure (cache TTL: 30 minutes)
BLOG_CACHE = {
    "timestamp": 0,
    "articles": SCIHIVE_FALLBACK_ARTICLES
}

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
        "service": "Sarwan Kumar Pandey Portfolio AI Assistant & Blog API",
        "llm_ready": gemini_model is not None,
        "blog_source": "https://scihive.vercel.app",
        "security_guardrails": "Active (Ingestion & Regex Output Redaction)"
    }

@app.get("/api/blogs")
def get_recent_blogs():
    """
    Returns the recent blogs published on SciHive (https://scihive.vercel.app).
    Caches results in memory for 30 minutes to ensure sub-millisecond responses.
    """
    now = time.time()
    # If cache is still fresh (< 30 minutes), return cached articles immediately
    if now - BLOG_CACHE["timestamp"] < 1800 and BLOG_CACHE["articles"]:
        return {
            "success": True,
            "source": "https://scihive.vercel.app",
            "cached": True,
            "count": len(BLOG_CACHE["articles"]),
            "articles": BLOG_CACHE["articles"]
        }

    # Attempt to fetch live sitemap from SciHive
    try:
        req = urllib.request.Request(
            "https://scihive.vercel.app/news-sitemap",
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        )
        with urllib.request.urlopen(req, timeout=7) as res:
            xml_text = res.read().decode("utf-8")

        root = ET.fromstring(xml_text)
        fresh_articles = []
        for url_elem in root.findall(".//{*}url"):
            loc = url_elem.find("{*}loc")
            if loc is None or not loc.text:
                continue
            url = loc.text
            news_elem = url_elem.find(".//{*}news")
            title = ""
            pub_date = ""
            if news_elem is not None:
                t = news_elem.find("{*}title")
                if t is not None and t.text:
                    title = t.text
                d = news_elem.find("{*}publication_date")
                if d is not None and d.text:
                    pub_date = d.text

            # Check if we already have richer metadata in fallback
            slug = url.rstrip("/").split("/")[-1]
            existing = next((a for a in SCIHIVE_FALLBACK_ARTICLES if slug in a["url"]), None)

            if existing:
                fresh_articles.append({
                    "title": title or existing["title"],
                    "url": url,
                    "image": existing["image"],
                    "description": existing["description"],
                    "category": existing["category"],
                    "date": pub_date[:10] if pub_date else existing["date"]
                })
            else:
                # Assign default category based on slug
                cat = "Technology & Science"
                if any(w in slug for w in ["cricket", "t20", "willow"]):
                    cat = "Sports and Cricket"
                elif any(w in slug for w in ["deck", "game", "streaming"]):
                    cat = "Handheld & Gaming"
                elif any(w in slug for w in ["ai", "gpt", "sonnet", "neuralink"]):
                    cat = "Artificial Intelligence"

                fresh_articles.append({
                    "title": title or slug.replace("-", " ").title(),
                    "url": url,
                    "image": f"https://scihive.vercel.app/media/articles/{slug}.jpg",
                    "description": f"Read the full article and technical research on SciHive.",
                    "category": cat,
                    "date": pub_date[:10] if pub_date else ""
                })

            if len(fresh_articles) >= 12:
                break

        if fresh_articles:
            BLOG_CACHE["articles"] = fresh_articles
            BLOG_CACHE["timestamp"] = now
            return {
                "success": True,
                "source": "https://scihive.vercel.app",
                "cached": False,
                "count": len(fresh_articles),
                "articles": fresh_articles
            }
    except Exception as e:
        print(f"Notice: Failed to fetch live SciHive news-sitemap: {e}")

    # Fallback gracefully to pre-cached articles
    return {
        "success": True,
        "source": "https://scihive.vercel.app",
        "cached": True,
        "count": len(BLOG_CACHE["articles"]),
        "articles": BLOG_CACHE["articles"]
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
    elif any(k in q for k in ["blog", "article", "scihive", "write", "post"]):
        return (
            "<strong>Technical Publication – SciHive:</strong><br>"
            "Sarwan publishes in-depth engineering breakdowns and tech research on <strong>SciHive</strong> (<a href='https://scihive.vercel.app' target='_blank' style='color:#e63946;'>scihive.vercel.app</a>). Recent articles include:<br>"
            "• <strong>Claude 3.5 Sonnet vs GPT-4o for Python</strong>: Benchmarking async latency and coding accuracy.<br>"
            "• <strong>Decoding T20 Powerplay Tactics</strong>: Predictive analytics and field restriction modeling.<br>"
            "• <strong>Tune Steam Deck TDP & Refresh Rates</strong>: Extending handheld battery life up to 75%.<br>"
            "• <strong>Typesafe AI Raises $870M</strong>: Enterprise inference infrastructure trends.<br>"
            "Check out the Blog modal in the navigation menu or visit <a href='https://scihive.vercel.app' target='_blank' style='color:#e63946;'>scihive.vercel.app</a> to read them!"
        )
    else:
        return (
            "I can explain any of Sarwan's GitHub projects and articles at the code level! Ask me about:<br>"
            "• <strong>FaceID Studio</strong>: Multithreaded ONNX facial recognition.<br>"
            "• <strong>RAG Pipeline</strong>: LangChain, FAISS & Hugging Face vector search.<br>"
            "• <strong>RNN Sequence Prediction</strong>: Benchmarking RNN vs LSTM vs GRU.<br>"
            "• <strong>CIFAR-10 Classifier</strong>: CNN deployed with asynchronous FastAPI.<br>"
            "• <strong>Robotics at IIIT Allahabad</strong>: ROS 2, SLAM, and drone integration.<br>"
            "• <strong>SciHive Technical Blog</strong>: Research essays on AI, Handheld Tuning, and Analytics."
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
