from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import time
from datetime import datetime
from typing import Dict, Any

from document_processor import DocumentProcessor
from nlp_engine import NLPEngine

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize processors
doc_processor = DocumentProcessor()
nlp_engine = NLPEngine()

@app.post("/api/process")
async def process_document(file: UploadFile = File(...)):
    """
    Main endpoint to process uploaded documents and generate summary, Q&A, and flashcards
    """
    try:
        start_time = time.time()
        
        # Validate file type
        if not file.content_type in ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain']:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        # Extract text from document
        text = await doc_processor.extract_text(file)
        
        if not text or len(text.strip()) < 100:
            raise HTTPException(status_code=400, detail="Document too short or empty")
        
        # Process with NLP engine
        summary = await nlp_engine.generate_summary(text)
        qa_pairs = await nlp_engine.generate_qa_pairs(text)
        flashcards = await nlp_engine.generate_flashcards(text)
        
        processing_time = time.time() - start_time
        
        # Prepare response
        result = {
            "summary": summary,
            "qaPairs": qa_pairs,
            "flashcards": flashcards,
            "metadata": {
                "filename": file.filename,
                "wordCount": len(text.split()),
                "processingTime": round(processing_time, 2),
                "timestamp": datetime.now().isoformat()
            }
        }
        
        return JSONResponse(content=result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# For Vercel deployment
def handler(request):
    return app(request)
