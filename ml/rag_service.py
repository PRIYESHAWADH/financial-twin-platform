import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any, Optional
import logging
import os
import json
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        self.embedding_model = None
        self.vector_store = None
        self.llm_model = None
        self.initialize_models()
    
    def initialize_models(self):
        """Initialize embedding and LLM models"""
        try:
            # Initialize sentence transformer for embeddings
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("Embedding model initialized successfully")
            
            # Initialize LLM model (placeholder for local model)
            # In production, this would load a local LLM like Llama2 or Mistral
            self.llm_model = self._initialize_llm()
            logger.info("LLM model initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing models: {e}")
            raise
    
    def _initialize_llm(self):
        """Initialize local LLM model"""
        # Placeholder for local LLM initialization
        # In production, this would load a model like:
        # from transformers import AutoTokenizer, AutoModelForCausalLM
        # tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
        # model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")
        
        class MockLLM:
            def generate(self, prompt: str, context: str = "") -> str:
                # Mock response generation
                return f"Based on the context: {context[:100]}... Here's a response to: {prompt[:50]}..."
        
        return MockLLM()
    
    def chunk_document(self, document: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """Split document into overlapping chunks"""
        if len(document) <= chunk_size:
            return [document]
        
        chunks = []
        start = 0
        
        while start < len(document):
            end = start + chunk_size
            
            # Try to break at sentence boundary
            if end < len(document):
                # Look for sentence endings
                for i in range(end, max(start + chunk_size - 100, start), -1):
                    if document[i] in '.!?':
                        end = i + 1
                        break
            
            chunk = document[start:end].strip()
            if chunk:
                chunks.append(chunk)
            
            start = end - overlap
        
        return chunks
    
    def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        """Generate embeddings for a list of texts"""
        if not texts:
            return np.array([])
        
        try:
            embeddings = self.embedding_model.encode(texts, convert_to_tensor=False)
            return embeddings
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            raise
    
    def store_documents(self, documents: List[Dict[str, Any]]) -> List[str]:
        """Store documents in vector database"""
        try:
            # Extract text content and metadata
            texts = []
            metadatas = []
            
            for doc in documents:
                # Chunk the document
                chunks = self.chunk_document(doc['content'])
                
                for chunk in chunks:
                    texts.append(chunk)
                    metadatas.append({
                        'document_id': doc['id'],
                        'chunk_index': len(texts) - 1,
                        'metadata': doc.get('metadata', {}),
                        'created_at': datetime.now().isoformat()
                    })
            
            # Generate embeddings
            embeddings = self.generate_embeddings(texts)
            
            # Store in vector database (placeholder)
            # In production, this would store in pgvector or similar
            document_ids = []
            for i, (text, metadata, embedding) in enumerate(zip(texts, metadatas, embeddings)):
                doc_id = f"{metadata['document_id']}_chunk_{i}"
                document_ids.append(doc_id)
                
                # Store in database (placeholder)
                self._store_embedding(doc_id, text, metadata, embedding)
            
            logger.info(f"Stored {len(document_ids)} document chunks")
            return document_ids
            
        except Exception as e:
            logger.error(f"Error storing documents: {e}")
            raise
    
    def _store_embedding(self, doc_id: str, text: str, metadata: Dict, embedding: np.ndarray):
        """Store embedding in database (placeholder)"""
        # In production, this would store in PostgreSQL with pgvector
        # For now, we'll just log the storage
        logger.info(f"Storing embedding for document {doc_id}")
    
    def retrieve_relevant_documents(self, query: str, k: int = 5) -> List[Dict[str, Any]]:
        """Retrieve relevant documents for a query"""
        try:
            # Generate query embedding
            query_embedding = self.generate_embeddings([query])[0]
            
            # Search for similar documents (placeholder)
            # In production, this would use vector similarity search
            similar_docs = self._search_similar_documents(query_embedding, k)
            
            return similar_docs
            
        except Exception as e:
            logger.error(f"Error retrieving documents: {e}")
            raise
    
    def _search_similar_documents(self, query_embedding: np.ndarray, k: int) -> List[Dict[str, Any]]:
        """Search for similar documents (placeholder)"""
        # In production, this would use vector similarity search in pgvector
        # For now, return mock results
        mock_docs = [
            {
                'content': 'Sample financial document content about tax planning',
                'metadata': {'type': 'tax_guide', 'year': '2023'},
                'similarity_score': 0.95
            },
            {
                'content': 'Investment strategies for long-term wealth building',
                'metadata': {'type': 'investment', 'year': '2023'},
                'similarity_score': 0.87
            }
        ]
        
        return mock_docs[:k]
    
    def generate_response(self, query: str, context_docs: List[Dict[str, Any]]) -> str:
        """Generate response using RAG"""
        try:
            # Prepare context from retrieved documents
            context = "\n\n".join([doc['content'] for doc in context_docs])
            
            # Generate response using LLM
            response = self.llm_model.generate(query, context)
            
            return response
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            raise
    
    def rag_pipeline(self, query: str) -> str:
        """Complete RAG pipeline: retrieve + generate"""
        try:
            # Retrieve relevant documents
            relevant_docs = self.retrieve_relevant_documents(query)
            
            # Generate response
            response = self.generate_response(query, relevant_docs)
            
            return response
            
        except Exception as e:
            logger.error(f"Error in RAG pipeline: {e}")
            raise
    
    def load_embeddings(self, filepath: str) -> np.ndarray:
        """Load embeddings from file"""
        try:
            embeddings = np.load(filepath)
            logger.info(f"Loaded embeddings from {filepath}")
            return embeddings
        except Exception as e:
            logger.error(f"Error loading embeddings: {e}")
            raise
    
    def save_embeddings(self, embeddings: np.ndarray, filepath: str):
        """Save embeddings to file"""
        try:
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            np.save(filepath, embeddings)
            logger.info(f"Saved embeddings to {filepath}")
        except Exception as e:
            logger.error(f"Error saving embeddings: {e}")
            raise
    
    def get_embedding_dimensions(self) -> int:
        """Get the dimension of embeddings"""
        if self.embedding_model is None:
            raise ValueError("Embedding model not initialized")
        
        # Get embedding dimension from the model
        test_embedding = self.embedding_model.encode(["test"])
        return test_embedding.shape[1]
    
    def batch_process_documents(self, documents: List[Dict[str, Any]], batch_size: int = 10) -> List[str]:
        """Process documents in batches for better performance"""
        all_document_ids = []
        
        for i in range(0, len(documents), batch_size):
            batch = documents[i:i + batch_size]
            batch_ids = self.store_documents(batch)
            all_document_ids.extend(batch_ids)
            
            logger.info(f"Processed batch {i//batch_size + 1}/{(len(documents) + batch_size - 1)//batch_size}")
        
        return all_document_ids
    
    def update_document(self, document_id: str, new_content: str, metadata: Dict[str, Any]):
        """Update an existing document"""
        try:
            # Remove old chunks
            self._remove_document_chunks(document_id)
            
            # Store new content
            new_doc = {
                'id': document_id,
                'content': new_content,
                'metadata': metadata
            }
            
            self.store_documents([new_doc])
            logger.info(f"Updated document {document_id}")
            
        except Exception as e:
            logger.error(f"Error updating document: {e}")
            raise
    
    def _remove_document_chunks(self, document_id: str):
        """Remove all chunks for a document (placeholder)"""
        # In production, this would remove from the database
        logger.info(f"Removing chunks for document {document_id}")
    
    def delete_document(self, document_id: str):
        """Delete a document and all its chunks"""
        try:
            self._remove_document_chunks(document_id)
            logger.info(f"Deleted document {document_id}")
        except Exception as e:
            logger.error(f"Error deleting document: {e}")
            raise
    
    def get_document_stats(self) -> Dict[str, Any]:
        """Get statistics about stored documents"""
        # In production, this would query the database
        return {
            'total_documents': 0,
            'total_chunks': 0,
            'embedding_dimensions': self.get_embedding_dimensions(),
            'model_name': 'all-MiniLM-L6-v2'
        }
    
    def health_check(self) -> Dict[str, Any]:
        """Check the health of the RAG service"""
        try:
            # Test embedding generation
            test_embedding = self.generate_embeddings(["test"])
            
            # Test LLM generation
            test_response = self.llm_model.generate("test query", "test context")
            
            return {
                'status': 'healthy',
                'embedding_model': 'working',
                'llm_model': 'working',
                'embedding_dimensions': test_embedding.shape[1],
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            return {
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
