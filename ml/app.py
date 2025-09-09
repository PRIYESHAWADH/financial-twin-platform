from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
import logging
import os
from datetime import datetime

from train_classifier import TransactionCategorizer
from rag_service import RAGService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="FinTwin ML Service",
    description="AI Financial Twin ML Pipeline Service",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML services
classifier = TransactionCategorizer()
rag_service = RAGService()

# Pydantic models
class TransactionData(BaseModel):
    date: str
    description: str
    amount: float
    type: str

class TransactionPrediction(BaseModel):
    transaction: TransactionData
    predicted_category: str
    confidence: float

class DocumentData(BaseModel):
    id: str
    content: str
    metadata: Dict[str, Any]

class QueryRequest(BaseModel):
    query: str
    k: int = 5

class QueryResponse(BaseModel):
    query: str
    response: str
    sources: List[Dict[str, Any]]

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        rag_health = rag_service.health_check()
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "services": {
                "rag_service": rag_health
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Service unhealthy")

# Transaction classification endpoints
@app.post("/classify/transactions", response_model=List[TransactionPrediction])
async def classify_transactions(transactions: List[TransactionData]):
    """Classify transaction categories"""
    try:
        if not transactions:
            raise HTTPException(status_code=400, detail="No transactions provided")
        
        # Convert to DataFrame
        df = pd.DataFrame([t.dict() for t in transactions])
        
        # Make predictions
        predictions = classifier.predict(df)
        probabilities = classifier.predict_proba(df)
        
        # Get confidence scores
        max_probs = np.max(probabilities, axis=1)
        
        # Format response
        results = []
        for i, (transaction, pred, conf) in enumerate(zip(transactions, predictions, max_probs)):
            results.append(TransactionPrediction(
                transaction=transaction,
                predicted_category=pred,
                confidence=float(conf)
            ))
        
        return results
        
    except Exception as e:
        logger.error(f"Error classifying transactions: {e}")
        raise HTTPException(status_code=500, detail="Classification failed")

@app.post("/classify/single", response_model=TransactionPrediction)
async def classify_single_transaction(transaction: TransactionData):
    """Classify a single transaction"""
    try:
        # Convert to DataFrame
        df = pd.DataFrame([transaction.dict()])
        
        # Make prediction
        prediction = classifier.predict(df)[0]
        probability = classifier.predict_proba(df)[0]
        
        # Get confidence score
        confidence = float(np.max(probability))
        
        return TransactionPrediction(
            transaction=transaction,
            predicted_category=prediction,
            confidence=confidence
        )
        
    except Exception as e:
        logger.error(f"Error classifying transaction: {e}")
        raise HTTPException(status_code=500, detail="Classification failed")

# RAG endpoints
@app.post("/rag/query", response_model=QueryResponse)
async def query_rag(request: QueryRequest):
    """Query the RAG system"""
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        # Get response from RAG pipeline
        response = rag_service.rag_pipeline(request.query)
        
        # Get relevant documents
        relevant_docs = rag_service.retrieve_relevant_documents(request.query, request.k)
        
        return QueryResponse(
            query=request.query,
            response=response,
            sources=relevant_docs
        )
        
    except Exception as e:
        logger.error(f"Error querying RAG: {e}")
        raise HTTPException(status_code=500, detail="RAG query failed")

@app.post("/rag/documents")
async def store_documents(documents: List[DocumentData]):
    """Store documents in the RAG system"""
    try:
        if not documents:
            raise HTTPException(status_code=400, detail="No documents provided")
        
        # Convert to format expected by RAG service
        doc_list = [doc.dict() for doc in documents]
        
        # Store documents
        document_ids = rag_service.store_documents(doc_list)
        
        return {
            "message": "Documents stored successfully",
            "document_ids": document_ids,
            "count": len(document_ids)
        }
        
    except Exception as e:
        logger.error(f"Error storing documents: {e}")
        raise HTTPException(status_code=500, detail="Document storage failed")

@app.post("/rag/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a document"""
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Read file content
        content = await file.read()
        
        # For text files, decode content
        if file.content_type and file.content_type.startswith('text/'):
            content = content.decode('utf-8')
        else:
            # For binary files, you might want to extract text first
            content = f"Binary file: {file.filename}"
        
        # Create document
        document = DocumentData(
            id=f"upload_{datetime.now().timestamp()}",
            content=content,
            metadata={
                "filename": file.filename,
                "content_type": file.content_type,
                "uploaded_at": datetime.now().isoformat()
            }
        )
        
        # Store document
        document_ids = rag_service.store_documents([document.dict()])
        
        return {
            "message": "Document uploaded and processed successfully",
            "document_id": document_ids[0],
            "filename": file.filename
        }
        
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail="Document upload failed")

# Model management endpoints
@app.post("/models/train")
async def train_classifier():
    """Train the transaction classifier"""
    try:
        # Load training data
        data_path = "data/seed_transactions.csv"
        if not os.path.exists(data_path):
            raise HTTPException(status_code=404, detail="Training data not found")
        
        df = pd.read_csv(data_path)
        
        # Train model
        accuracy = classifier.train(df)
        
        # Save model
        os.makedirs("models", exist_ok=True)
        classifier.save_model("models/transaction_classifier.pkl")
        
        return {
            "message": "Model trained successfully",
            "accuracy": accuracy,
            "model_path": "models/transaction_classifier.pkl"
        }
        
    except Exception as e:
        logger.error(f"Error training model: {e}")
        raise HTTPException(status_code=500, detail="Model training failed")

@app.post("/models/load")
async def load_classifier(model_path: str = "models/transaction_classifier.pkl"):
    """Load a trained classifier"""
    try:
        if not os.path.exists(model_path):
            raise HTTPException(status_code=404, detail="Model file not found")
        
        classifier.load_model(model_path)
        
        return {
            "message": "Model loaded successfully",
            "model_path": model_path
        }
        
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise HTTPException(status_code=500, detail="Model loading failed")

@app.get("/models/info")
async def get_model_info():
    """Get information about the loaded model"""
    try:
        if classifier.model is None:
            return {
                "status": "no_model_loaded",
                "message": "No model is currently loaded"
            }
        
        # Get feature importance
        importance_df = classifier.get_feature_importance()
        
        return {
            "status": "model_loaded",
            "model_type": "RandomForestClassifier",
            "feature_count": len(classifier.feature_columns),
            "top_features": importance_df.head(10).to_dict('records')
        }
        
    except Exception as e:
        logger.error(f"Error getting model info: {e}")
        raise HTTPException(status_code=500, detail="Failed to get model info")

# Utility endpoints
@app.get("/stats")
async def get_stats():
    """Get service statistics"""
    try:
        rag_stats = rag_service.get_document_stats()
        
        return {
            "timestamp": datetime.now().isoformat(),
            "rag_service": rag_stats,
            "classifier": {
                "model_loaded": classifier.model is not None,
                "feature_count": len(classifier.feature_columns) if classifier.feature_columns else 0
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get stats")

@app.post("/predict/batch")
async def batch_predict(transactions: List[TransactionData]):
    """Batch prediction endpoint for better performance"""
    try:
        if not transactions:
            raise HTTPException(status_code=400, detail="No transactions provided")
        
        # Convert to DataFrame
        df = pd.DataFrame([t.dict() for t in transactions])
        
        # Make predictions
        predictions = classifier.predict(df)
        probabilities = classifier.predict_proba(df)
        
        # Format response
        results = []
        for i, (transaction, pred, prob) in enumerate(zip(transactions, predictions, probabilities)):
            results.append({
                "transaction": transaction.dict(),
                "predicted_category": pred,
                "confidence": float(np.max(prob)),
                "all_probabilities": {
                    classifier.label_encoder.classes_[j]: float(prob[j])
                    for j in range(len(prob))
                }
            })
        
        return {
            "predictions": results,
            "count": len(results)
        }
        
    except Exception as e:
        logger.error(f"Error in batch prediction: {e}")
        raise HTTPException(status_code=500, detail="Batch prediction failed")

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {"error": "Endpoint not found", "detail": str(exc)}

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Internal server error: {exc}")
    return {"error": "Internal server error", "detail": "An unexpected error occurred"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
