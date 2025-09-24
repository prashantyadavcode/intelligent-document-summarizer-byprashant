from fastapi import FastAPI
from datetime import datetime
import json

app = FastAPI()

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint to verify the API is running
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Intelligent Document Summarizer API",
        "version": "1.0.0"
    }

@app.get("/api/status")
async def status_check():
    """
    Detailed status check including model availability
    """
    try:
        # Check if models are available
        from nlp_engine import NLPEngine
        nlp_engine = NLPEngine()
        
        return {
            "status": "healthy",
            "models_loaded": True,
            "timestamp": datetime.now().isoformat(),
            "service": "Intelligent Document Summarizer API",
            "version": "1.0.0"
        }
    except Exception as e:
        return {
            "status": "degraded",
            "models_loaded": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat(),
            "service": "Intelligent Document Summarizer API",
            "version": "1.0.0"
        }

# For Vercel deployment
def handler(request):
    return app(request)
