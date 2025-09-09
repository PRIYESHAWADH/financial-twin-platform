#!/usr/bin/env python3
"""
RAG Document Ingestion Script
FinTwin AI Financial Twin - Document Processing Pipeline

This script processes financial documents and regulations, creates embeddings,
and stores them in the vector database for the RAG system.

Author: FinTwin ML Team
Date: 2024-01-15
"""

import os
import json
import hashlib
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
import psycopg2
from psycopg2.extras import RealDictCursor
import argparse
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class RAGDocumentIngestion:
    """
    Document ingestion pipeline for the RAG system
    """
    
    def __init__(self, 
                 model_name: str = "all-MiniLM-L6-v2",
                 chunk_size: int = 1000,
                 chunk_overlap: int = 200,
                 db_config: Optional[Dict] = None):
        """
        Initialize the RAG document ingestion pipeline
        
        Args:
            model_name: Name of the sentence transformer model
            chunk_size: Maximum size of text chunks
            chunk_overlap: Overlap between chunks
            db_config: Database configuration
        """
        self.model_name = model_name
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.db_config = db_config or {
            'host': 'localhost',
            'port': 5432,
            'database': 'fintwin',
            'user': 'fintwin',
            'password': 'fintwin_password'
        }
        
        # Initialize embedding model
        self.embedding_model = None
        self.load_embedding_model()
        
        # Initialize database connection
        self.db_connection = None
        self.connect_to_database()
    
    def load_embedding_model(self):
        """Load the sentence transformer model"""
        try:
            logger.info(f"Loading embedding model: {self.model_name}")
            self.embedding_model = SentenceTransformer(self.model_name)
            logger.info("Embedding model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            raise
    
    def connect_to_database(self):
        """Connect to PostgreSQL database"""
        try:
            logger.info("Connecting to database...")
            self.db_connection = psycopg2.connect(**self.db_config)
            logger.info("Database connection established")
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            raise
    
    def process_documents(self, documents_dir: str) -> Dict[str, Any]:
        """
        Process all documents in the specified directory
        
        Args:
            documents_dir: Path to directory containing documents
            
        Returns:
            Dictionary with processing statistics
        """
        documents_path = Path(documents_dir)
        if not documents_path.exists():
            raise FileNotFoundError(f"Documents directory not found: {documents_dir}")
        
        stats = {
            'total_documents': 0,
            'total_chunks': 0,
            'total_embeddings': 0,
            'processing_time': 0,
            'errors': []
        }
        
        start_time = datetime.now()
        
        try:
            # Process markdown files
            md_files = list(documents_path.glob("*.md"))
            for md_file in md_files:
                try:
                    chunks = self.process_markdown_file(md_file)
                    embeddings = self.generate_embeddings(chunks)
                    self.store_embeddings(chunks, embeddings, md_file.name)
                    
                    stats['total_documents'] += 1
                    stats['total_chunks'] += len(chunks)
                    stats['total_embeddings'] += len(embeddings)
                    
                    logger.info(f"Processed {md_file.name}: {len(chunks)} chunks")
                except Exception as e:
                    error_msg = f"Error processing {md_file.name}: {e}"
                    logger.error(error_msg)
                    stats['errors'].append(error_msg)
            
            # Process CSV files
            csv_files = list(documents_path.glob("*.csv"))
            for csv_file in csv_files:
                try:
                    chunks = self.process_csv_file(csv_file)
                    embeddings = self.generate_embeddings(chunks)
                    self.store_embeddings(chunks, embeddings, csv_file.name)
                    
                    stats['total_documents'] += 1
                    stats['total_chunks'] += len(chunks)
                    stats['total_embeddings'] += len(embeddings)
                    
                    logger.info(f"Processed {csv_file.name}: {len(chunks)} chunks")
                except Exception as e:
                    error_msg = f"Error processing {csv_file.name}: {e}"
                    logger.error(error_msg)
                    stats['errors'].append(error_msg)
            
            stats['processing_time'] = (datetime.now() - start_time).total_seconds()
            
        except Exception as e:
            logger.error(f"Error in document processing: {e}")
            stats['errors'].append(str(e))
        
        return stats
    
    def process_markdown_file(self, file_path: Path) -> List[Dict[str, Any]]:
        """
        Process a markdown file and extract chunks
        
        Args:
            file_path: Path to markdown file
            
        Returns:
            List of text chunks with metadata
        """
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract title and sections
        title = self.extract_title(content)
        sections = self.extract_sections(content)
        
        chunks = []
        for i, section in enumerate(sections):
            if len(section['content']) > 50:  # Only process substantial sections
                chunk = {
                    'id': f"{file_path.stem}_section_{i}",
                    'content': section['content'],
                    'metadata': {
                        'title': title,
                        'section': section['heading'],
                        'source': file_path.name,
                        'type': 'regulation',
                        'file_type': 'markdown',
                        'created_at': datetime.now().isoformat()
                    }
                }
                chunks.append(chunk)
        
        return chunks
    
    def process_csv_file(self, file_path: Path) -> List[Dict[str, Any]]:
        """
        Process a CSV file and extract chunks
        
        Args:
            file_path: Path to CSV file
            
        Returns:
            List of text chunks with metadata
        """
        try:
            df = pd.read_csv(file_path)
        except Exception as e:
            logger.error(f"Failed to read CSV file {file_path}: {e}")
            return []
        
        chunks = []
        
        # Create chunks from CSV data
        if 'description' in df.columns and 'amount' in df.columns:
            # Transaction data
            for idx, row in df.iterrows():
                content = f"Transaction: {row.get('description', 'N/A')} - Amount: {row.get('amount', 0)} - Date: {row.get('date', 'N/A')}"
                if row.get('category'):
                    content += f" - Category: {row['category']}"
                
                chunk = {
                    'id': f"{file_path.stem}_transaction_{idx}",
                    'content': content,
                    'metadata': {
                        'title': f"Transaction Data - {file_path.stem}",
                        'section': 'transactions',
                        'source': file_path.name,
                        'type': 'financial_data',
                        'file_type': 'csv',
                        'row_index': idx,
                        'created_at': datetime.now().isoformat()
                    }
                }
                chunks.append(chunk)
        
        # Create summary chunks
        if len(df) > 0:
            summary_content = f"Data summary: {len(df)} records from {file_path.name}. "
            if 'amount' in df.columns:
                total_amount = df['amount'].sum()
                summary_content += f"Total amount: {total_amount}. "
            if 'category' in df.columns:
                categories = df['category'].value_counts().to_dict()
                summary_content += f"Categories: {categories}."
            
            chunk = {
                'id': f"{file_path.stem}_summary",
                'content': summary_content,
                'metadata': {
                    'title': f"Data Summary - {file_path.stem}",
                    'section': 'summary',
                    'source': file_path.name,
                    'type': 'financial_data',
                    'file_type': 'csv',
                    'created_at': datetime.now().isoformat()
                }
            }
            chunks.append(chunk)
        
        return chunks
    
    def extract_title(self, content: str) -> str:
        """Extract title from markdown content"""
        lines = content.split('\n')
        for line in lines:
            if line.startswith('# '):
                return line[2:].strip()
        return 'Financial Document'
    
    def extract_sections(self, content: str) -> List[Dict[str, str]]:
        """Extract sections from markdown content"""
        sections = []
        lines = content.split('\n')
        current_section = {'heading': '', 'content': ''}
        
        for line in lines:
            if line.startswith('#'):
                if current_section['content'].strip():
                    sections.append(current_section)
                current_section = {
                    'heading': line.strip(),
                    'content': ''
                }
            else:
                current_section['content'] += line + '\n'
        
        if current_section['content'].strip():
            sections.append(current_section)
        
        return sections
    
    def generate_embeddings(self, chunks: List[Dict[str, Any]]) -> List[List[float]]:
        """
        Generate embeddings for text chunks
        
        Args:
            chunks: List of text chunks
            
        Returns:
            List of embedding vectors
        """
        if not chunks:
            return []
        
        texts = [chunk['content'] for chunk in chunks]
        embeddings = self.embedding_model.encode(texts)
        
        return embeddings.tolist()
    
    def store_embeddings(self, chunks: List[Dict[str, Any]], embeddings: List[List[float]], source_file: str):
        """
        Store embeddings in the database
        
        Args:
            chunks: List of text chunks
            embeddings: List of embedding vectors
            source_file: Source file name
        """
        if not chunks or not embeddings:
            return
        
        cursor = self.db_connection.cursor()
        
        try:
            for chunk, embedding in zip(chunks, embeddings):
                # Create unique ID
                chunk_id = f"{source_file}_{hashlib.md5(chunk['content'].encode()).hexdigest()[:8]}"
                
                # Store in vector_embeddings table
                insert_query = """
                INSERT INTO vector_embeddings (id, content, embedding, metadata, created_at)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    content = EXCLUDED.content,
                    embedding = EXCLUDED.embedding,
                    metadata = EXCLUDED.metadata,
                    updated_at = NOW()
                """
                
                cursor.execute(insert_query, (
                    chunk_id,
                    chunk['content'],
                    json.dumps(embedding),
                    json.dumps(chunk['metadata']),
                    datetime.now()
                ))
            
            self.db_connection.commit()
            logger.info(f"Stored {len(chunks)} embeddings for {source_file}")
            
        except Exception as e:
            self.db_connection.rollback()
            logger.error(f"Failed to store embeddings for {source_file}: {e}")
            raise
        finally:
            cursor.close()
    
    def create_vector_extension(self):
        """Create pgvector extension if it doesn't exist"""
        cursor = self.db_connection.cursor()
        try:
            cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            self.db_connection.commit()
            logger.info("pgvector extension created/verified")
        except Exception as e:
            logger.error(f"Failed to create pgvector extension: {e}")
            raise
        finally:
            cursor.close()
    
    def create_embeddings_table(self):
        """Create vector_embeddings table if it doesn't exist"""
        cursor = self.db_connection.cursor()
        try:
            create_table_query = """
            CREATE TABLE IF NOT EXISTS vector_embeddings (
                id VARCHAR(255) PRIMARY KEY,
                content TEXT NOT NULL,
                embedding VECTOR(384),
                metadata JSONB,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
            
            CREATE INDEX IF NOT EXISTS vector_embeddings_embedding_idx 
            ON vector_embeddings USING ivfflat (embedding vector_cosine_ops);
            
            CREATE INDEX IF NOT EXISTS vector_embeddings_metadata_idx 
            ON vector_embeddings USING GIN (metadata);
            """
            
            cursor.execute(create_table_query)
            self.db_connection.commit()
            logger.info("vector_embeddings table created/verified")
        except Exception as e:
            logger.error(f"Failed to create embeddings table: {e}")
            raise
        finally:
            cursor.close()
    
    def cleanup_old_embeddings(self, days_old: int = 30):
        """Clean up old embeddings"""
        cursor = self.db_connection.cursor()
        try:
            delete_query = """
            DELETE FROM vector_embeddings 
            WHERE created_at < NOW() - INTERVAL '%s days'
            """
            cursor.execute(delete_query, (days_old,))
            deleted_count = cursor.rowcount
            self.db_connection.commit()
            logger.info(f"Cleaned up {deleted_count} old embeddings")
        except Exception as e:
            logger.error(f"Failed to cleanup old embeddings: {e}")
            raise
        finally:
            cursor.close()
    
    def get_embedding_stats(self) -> Dict[str, Any]:
        """Get statistics about stored embeddings"""
        cursor = self.db_connection.cursor(cursor_factory=RealDictCursor)
        try:
            stats_query = """
            SELECT 
                COUNT(*) as total_embeddings,
                COUNT(DISTINCT metadata->>'source') as unique_sources,
                COUNT(DISTINCT metadata->>'type') as unique_types,
                MIN(created_at) as oldest_embedding,
                MAX(created_at) as newest_embedding
            FROM vector_embeddings
            """
            cursor.execute(stats_query)
            stats = cursor.fetchone()
            return dict(stats)
        except Exception as e:
            logger.error(f"Failed to get embedding stats: {e}")
            return {}
        finally:
            cursor.close()
    
    def close(self):
        """Close database connection"""
        if self.db_connection:
            self.db_connection.close()
            logger.info("Database connection closed")


def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='RAG Document Ingestion Pipeline')
    parser.add_argument('--documents-dir', default='data/documents', 
                       help='Directory containing documents to process')
    parser.add_argument('--model-name', default='all-MiniLM-L6-v2',
                       help='Sentence transformer model name')
    parser.add_argument('--chunk-size', type=int, default=1000,
                       help='Maximum chunk size')
    parser.add_argument('--chunk-overlap', type=int, default=200,
                       help='Chunk overlap size')
    parser.add_argument('--db-host', default='localhost',
                       help='Database host')
    parser.add_argument('--db-port', type=int, default=5432,
                       help='Database port')
    parser.add_argument('--db-name', default='fintwin',
                       help='Database name')
    parser.add_argument('--db-user', default='fintwin',
                       help='Database user')
    parser.add_argument('--db-password', default='fintwin_password',
                       help='Database password')
    parser.add_argument('--cleanup-days', type=int, default=30,
                       help='Days old embeddings to cleanup')
    
    args = parser.parse_args()
    
    # Database configuration
    db_config = {
        'host': args.db_host,
        'port': args.db_port,
        'database': args.db_name,
        'user': args.db_user,
        'password': args.db_password
    }
    
    # Initialize ingestion pipeline
    ingestion = RAGDocumentIngestion(
        model_name=args.model_name,
        chunk_size=args.chunk_size,
        chunk_overlap=args.chunk_overlap,
        db_config=db_config
    )
    
    try:
        # Setup database
        logger.info("Setting up database...")
        ingestion.create_vector_extension()
        ingestion.create_embeddings_table()
        
        # Process documents
        logger.info(f"Processing documents from: {args.documents_dir}")
        stats = ingestion.process_documents(args.documents_dir)
        
        # Print statistics
        logger.info("Processing completed!")
        logger.info(f"Total documents processed: {stats['total_documents']}")
        logger.info(f"Total chunks created: {stats['total_chunks']}")
        logger.info(f"Total embeddings stored: {stats['total_embeddings']}")
        logger.info(f"Processing time: {stats['processing_time']:.2f} seconds")
        
        if stats['errors']:
            logger.warning(f"Errors encountered: {len(stats['errors'])}")
            for error in stats['errors']:
                logger.warning(f"  - {error}")
        
        # Get embedding statistics
        embedding_stats = ingestion.get_embedding_stats()
        if embedding_stats:
            logger.info("Embedding statistics:")
            for key, value in embedding_stats.items():
                logger.info(f"  {key}: {value}")
        
        # Cleanup old embeddings
        if args.cleanup_days > 0:
            logger.info(f"Cleaning up embeddings older than {args.cleanup_days} days...")
            ingestion.cleanup_old_embeddings(args.cleanup_days)
        
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        raise
    finally:
        ingestion.close()


if __name__ == "__main__":
    main()
