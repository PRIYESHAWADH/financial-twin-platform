import pytest
import numpy as np
from unittest.mock import Mock, patch, MagicMock
import sys
import os

# Add the ml directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rag_service import RAGService

class TestRAGService:
    @pytest.fixture
    def rag_service(self):
        """Create a RAGService instance for testing"""
        return RAGService()

    @pytest.fixture
    def sample_documents(self):
        """Create sample documents for testing"""
        return [
            {
                'id': '1',
                'content': 'This is a financial document about tax planning.',
                'metadata': {'type': 'tax_guide', 'year': '2023'}
            },
            {
                'id': '2',
                'content': 'Investment strategies for long-term wealth building.',
                'metadata': {'type': 'investment', 'year': '2023'}
            },
            {
                'id': '3',
                'content': 'GST filing procedures and compliance requirements.',
                'metadata': {'type': 'gst_guide', 'year': '2023'}
            }
        ]

    def test_init(self, rag_service):
        """Test RAGService initialization"""
        assert rag_service.embedding_model is None
        assert rag_service.vector_store is None
        assert rag_service.llm_model is None

    @patch('sentence_transformers.SentenceTransformer')
    def test_initialize_models(self, mock_sentence_transformer, rag_service):
        """Test model initialization"""
        mock_model = Mock()
        mock_sentence_transformer.return_value = mock_model
        
        rag_service.initialize_models()
        
        assert rag_service.embedding_model is not None
        mock_sentence_transformer.assert_called_once()

    def test_chunk_document(self, rag_service):
        """Test document chunking functionality"""
        long_document = "This is a very long document. " * 100  # 3000+ characters
        
        chunks = rag_service.chunk_document(long_document, chunk_size=500)
        
        assert len(chunks) > 1
        assert all(len(chunk) <= 500 for chunk in chunks)
        assert all(len(chunk) > 0 for chunk in chunks)

    def test_chunk_document_short(self, rag_service):
        """Test chunking of short documents"""
        short_document = "This is a short document."
        
        chunks = rag_service.chunk_document(short_document, chunk_size=500)
        
        assert len(chunks) == 1
        assert chunks[0] == short_document

    @patch('numpy.array')
    def test_generate_embeddings(self, mock_numpy_array, rag_service):
        """Test embedding generation"""
        mock_embeddings = np.random.rand(3, 384)  # Mock embeddings
        mock_numpy_array.return_value = mock_embeddings
        
        # Mock the embedding model
        rag_service.embedding_model = Mock()
        rag_service.embedding_model.encode.return_value = mock_embeddings
        
        texts = ["Document 1", "Document 2", "Document 3"]
        embeddings = rag_service.generate_embeddings(texts)
        
        assert embeddings.shape == (3, 384)
        rag_service.embedding_model.encode.assert_called_once_with(texts)

    def test_store_documents(self, rag_service, sample_documents):
        """Test document storage in vector database"""
        # Mock the vector store
        rag_service.vector_store = Mock()
        rag_service.vector_store.add_documents.return_value = ['1', '2', '3']
        
        # Mock embedding generation
        with patch.object(rag_service, 'generate_embeddings') as mock_embeddings:
            mock_embeddings.return_value = np.random.rand(3, 384)
            
            result = rag_service.store_documents(sample_documents)
            
            assert result == ['1', '2', '3']
            rag_service.vector_store.add_documents.assert_called_once()

    def test_retrieve_relevant_documents(self, rag_service):
        """Test document retrieval"""
        query = "How to file GST returns?"
        
        # Mock the vector store
        rag_service.vector_store = Mock()
        mock_docs = [
            Mock(content="GST filing guide", metadata={'type': 'gst_guide'}),
            Mock(content="Tax planning tips", metadata={'type': 'tax_guide'})
        ]
        rag_service.vector_store.similarity_search.return_value = mock_docs
        
        # Mock embedding generation
        with patch.object(rag_service, 'generate_embeddings') as mock_embeddings:
            mock_embeddings.return_value = np.random.rand(1, 384)
            
            documents = rag_service.retrieve_relevant_documents(query, k=2)
            
            assert len(documents) == 2
            assert all(hasattr(doc, 'content') for doc in documents)

    def test_generate_response(self, rag_service):
        """Test response generation with RAG"""
        query = "What are the GST filing requirements?"
        context_docs = [
            Mock(content="GST must be filed monthly", metadata={'type': 'gst_guide'}),
            Mock(content="Late filing attracts penalties", metadata={'type': 'gst_guide'})
        ]
        
        # Mock the LLM
        rag_service.llm_model = Mock()
        rag_service.llm_model.generate.return_value = "GST must be filed monthly. Late filing attracts penalties."
        
        response = rag_service.generate_response(query, context_docs)
        
        assert isinstance(response, str)
        assert len(response) > 0
        rag_service.llm_model.generate.assert_called_once()

    def test_rag_pipeline(self, rag_service, sample_documents):
        """Test complete RAG pipeline"""
        query = "How to plan taxes for the year?"
        
        # Mock all components
        rag_service.embedding_model = Mock()
        rag_service.vector_store = Mock()
        rag_service.llm_model = Mock()
        
        # Mock embedding generation
        rag_service.embedding_model.encode.return_value = np.random.rand(1, 384)
        
        # Mock document retrieval
        mock_docs = [Mock(content="Tax planning guide", metadata={'type': 'tax_guide'})]
        rag_service.vector_store.similarity_search.return_value = mock_docs
        
        # Mock response generation
        rag_service.llm_model.generate.return_value = "Tax planning involves..."
        
        response = rag_service.rag_pipeline(query)
        
        assert isinstance(response, str)
        assert len(response) > 0

    def test_handle_empty_query(self, rag_service):
        """Test handling of empty queries"""
        query = ""
        
        with pytest.raises(ValueError, match="Query cannot be empty"):
            rag_service.retrieve_relevant_documents(query)

    def test_handle_no_documents(self, rag_service):
        """Test handling when no documents are found"""
        query = "Very specific query that won't match anything"
        
        # Mock the vector store to return empty results
        rag_service.vector_store = Mock()
        rag_service.vector_store.similarity_search.return_value = []
        
        with patch.object(rag_service, 'generate_embeddings') as mock_embeddings:
            mock_embeddings.return_value = np.random.rand(1, 384)
            
            documents = rag_service.retrieve_relevant_documents(query)
            
            assert len(documents) == 0

    def test_embedding_dimensions(self, rag_service):
        """Test that embeddings have correct dimensions"""
        texts = ["Test document"]
        
        # Mock the embedding model
        rag_service.embedding_model = Mock()
        rag_service.embedding_model.encode.return_value = np.random.rand(1, 384)
        
        embeddings = rag_service.generate_embeddings(texts)
        
        assert embeddings.shape == (1, 384)
        assert embeddings.dtype == np.float32

    def test_document_metadata_preservation(self, rag_service, sample_documents):
        """Test that document metadata is preserved during processing"""
        # Mock the vector store
        rag_service.vector_store = Mock()
        rag_service.vector_store.add_documents.return_value = ['1', '2', '3']
        
        with patch.object(rag_service, 'generate_embeddings') as mock_embeddings:
            mock_embeddings.return_value = np.random.rand(3, 384)
            
            result = rag_service.store_documents(sample_documents)
            
            # Check that the vector store was called with documents that have metadata
            call_args = rag_service.vector_store.add_documents.call_args
            stored_docs = call_args[0][0]
            
            assert all('metadata' in doc for doc in stored_docs)
            assert all(doc['metadata']['year'] == '2023' for doc in stored_docs)

    @patch('os.path.exists')
    def test_load_existing_embeddings(self, mock_exists, rag_service):
        """Test loading of existing embeddings from file"""
        mock_exists.return_value = True
        
        with patch('numpy.load') as mock_load:
            mock_embeddings = np.random.rand(100, 384)
            mock_load.return_value = mock_embeddings
            
            embeddings = rag_service.load_embeddings('test_embeddings.npy')
            
            assert embeddings.shape == (100, 384)
            mock_load.assert_called_once_with('test_embeddings.npy')

    def test_save_embeddings(self, rag_service, tmp_path):
        """Test saving embeddings to file"""
        embeddings = np.random.rand(10, 384)
        file_path = tmp_path / "test_embeddings.npy"
        
        rag_service.save_embeddings(embeddings, str(file_path))
        
        assert file_path.exists()
        loaded_embeddings = np.load(str(file_path))
        np.testing.assert_array_equal(embeddings, loaded_embeddings)
