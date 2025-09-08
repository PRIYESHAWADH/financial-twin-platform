import pytest
import pandas as pd
import numpy as np
from unittest.mock import Mock, patch
import sys
import os

# Add the ml directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from train_classifier import TransactionClassifier

class TestTransactionClassifier:
    @pytest.fixture
    def sample_data(self):
        """Create sample transaction data for testing"""
        return pd.DataFrame({
            'date': ['2023-01-01', '2023-01-02', '2023-01-03'],
            'description': ['Grocery Store', 'ATM Withdrawal', 'Salary Credit'],
            'amount': [1500.0, 5000.0, 50000.0],
            'type': ['debit', 'debit', 'credit'],
            'category': ['Food & Dining', 'Cash', 'Salary']
        })

    @pytest.fixture
    def classifier(self):
        """Create a TransactionClassifier instance for testing"""
        return TransactionClassifier()

    def test_init(self, classifier):
        """Test classifier initialization"""
        assert classifier.model is None
        assert classifier.vectorizer is None
        assert classifier.label_encoder is None

    def test_extract_features(self, classifier, sample_data):
        """Test feature extraction from transaction data"""
        features = classifier.extract_features(sample_data)
        
        assert 'description_length' in features.columns
        assert 'amount_log' in features.columns
        assert 'is_weekend' in features.columns
        assert 'hour' in features.columns
        assert 'day_of_month' in features.columns
        
        # Check that features are numeric
        assert features.select_dtypes(include=[np.number]).shape[1] == features.shape[1]

    def test_preprocess_text(self, classifier):
        """Test text preprocessing"""
        test_text = "GROCERY STORE #1234 MUMBAI"
        processed = classifier.preprocess_text(test_text)
        
        assert isinstance(processed, str)
        assert processed.islower()
        assert '#' not in processed
        assert len(processed) > 0

    def test_train(self, classifier, sample_data):
        """Test model training"""
        with patch('sklearn.ensemble.RandomForestClassifier') as mock_rf:
            mock_model = Mock()
            mock_rf.return_value = mock_model
            mock_model.fit.return_value = None
            mock_model.score.return_value = 0.95
            
            classifier.train(sample_data)
            
            assert classifier.model is not None
            assert classifier.vectorizer is not None
            assert classifier.label_encoder is not None
            mock_model.fit.assert_called_once()

    def test_predict(self, classifier, sample_data):
        """Test prediction functionality"""
        # Mock the trained components
        classifier.model = Mock()
        classifier.vectorizer = Mock()
        classifier.label_encoder = Mock()
        
        # Mock predictions
        classifier.model.predict.return_value = np.array([0, 1, 2])
        classifier.label_encoder.inverse_transform.return_value = ['Food', 'Transport', 'Salary']
        
        # Mock vectorizer transform
        classifier.vectorizer.transform.return_value = np.array([[1, 0, 1], [0, 1, 0], [1, 1, 0]])
        
        predictions = classifier.predict(sample_data)
        
        assert len(predictions) == len(sample_data)
        assert all(isinstance(pred, str) for pred in predictions)

    def test_evaluate(self, classifier, sample_data):
        """Test model evaluation"""
        # Mock the trained model
        classifier.model = Mock()
        classifier.model.score.return_value = 0.85
        
        # Mock feature extraction
        with patch.object(classifier, 'extract_features') as mock_extract:
            mock_extract.return_value = pd.DataFrame({
                'description_length': [10, 15, 20],
                'amount_log': [3.0, 3.5, 4.0],
                'is_weekend': [0, 1, 0],
                'hour': [10, 14, 9],
                'day_of_month': [1, 2, 3]
            })
            
            score = classifier.evaluate(sample_data)
            
            assert isinstance(score, float)
            assert 0 <= score <= 1

    def test_save_and_load_model(self, classifier, tmp_path):
        """Test model saving and loading"""
        # Mock a trained model
        classifier.model = Mock()
        classifier.vectorizer = Mock()
        classifier.label_encoder = Mock()
        
        model_path = tmp_path / "test_model.pkl"
        
        # Test save
        classifier.save_model(str(model_path))
        assert model_path.exists()
        
        # Test load
        new_classifier = TransactionClassifier()
        new_classifier.load_model(str(model_path))
        
        assert new_classifier.model is not None
        assert new_classifier.vectorizer is not None
        assert new_classifier.label_encoder is not None

    def test_handle_missing_data(self, classifier):
        """Test handling of missing data"""
        data_with_missing = pd.DataFrame({
            'date': ['2023-01-01', None, '2023-01-03'],
            'description': ['Grocery Store', 'ATM Withdrawal', None],
            'amount': [1500.0, None, 50000.0],
            'type': ['debit', 'debit', 'credit'],
            'category': ['Food & Dining', 'Cash', 'Salary']
        })
        
        # Should not raise an exception
        features = classifier.extract_features(data_with_missing)
        assert features is not None
        assert len(features) == len(data_with_missing)

    def test_edge_cases(self, classifier):
        """Test edge cases in data processing"""
        # Empty dataframe
        empty_data = pd.DataFrame()
        features = classifier.extract_features(empty_data)
        assert len(features) == 0
        
        # Single row
        single_row = pd.DataFrame({
            'date': ['2023-01-01'],
            'description': ['Test Transaction'],
            'amount': [100.0],
            'type': ['debit'],
            'category': ['Test']
        })
        features = classifier.extract_features(single_row)
        assert len(features) == 1
        
        # Very long description
        long_desc_data = pd.DataFrame({
            'date': ['2023-01-01'],
            'description': ['A' * 1000],  # Very long description
            'amount': [100.0],
            'type': ['debit'],
            'category': ['Test']
        })
        features = classifier.extract_features(long_desc_data)
        assert len(features) == 1

    @patch('pandas.read_csv')
    def test_load_data(self, mock_read_csv, classifier):
        """Test data loading functionality"""
        mock_read_csv.return_value = pd.DataFrame({
            'date': ['2023-01-01'],
            'description': ['Test'],
            'amount': [100.0],
            'type': ['debit'],
            'category': ['Test']
        })
        
        data = classifier.load_data('test_file.csv')
        mock_read_csv.assert_called_once_with('test_file.csv')
        assert isinstance(data, pd.DataFrame)

    def test_feature_engineering(self, classifier, sample_data):
        """Test advanced feature engineering"""
        features = classifier.extract_features(sample_data)
        
        # Check for derived features
        assert 'amount_log' in features.columns
        assert 'description_length' in features.columns
        
        # Check that log transformation is applied correctly
        assert all(features['amount_log'] >= 0)
        
        # Check that weekend detection works
        assert 'is_weekend' in features.columns
        assert all(features['is_weekend'].isin([0, 1]))
