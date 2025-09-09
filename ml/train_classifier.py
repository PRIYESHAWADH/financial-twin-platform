#!/usr/bin/env python3
"""
Transaction Categorization Model Training Script
FinTwin AI Financial Twin - ML Pipeline

This script trains a transaction categorization model using a hybrid approach:
1. Rule-based engine for common patterns
2. Machine learning classifier for complex cases
3. Embedding-based similarity for new merchants

Author: FinTwin ML Team
Date: 2024-01-15
"""

import pandas as pd
import numpy as np
import pickle
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.preprocessing import LabelEncoder
import joblib
try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    # Fallback for compatibility issues
    SentenceTransformer = None
import warnings
warnings.filterwarnings('ignore')

class TransactionCategorizer:
    """
    Hybrid transaction categorization system combining rules, ML, and embeddings
    """
    
    def __init__(self, model_dir: str = "models"):
        self.model_dir = Path(model_dir)
        self.model_dir.mkdir(exist_ok=True)
        
        # Initialize components
        self.rule_engine = RuleBasedCategorizer()
        self.ml_classifier = None
        self.embedding_model = None
        self.vectorizer = None
        self.label_encoder = None
        self.merchant_embeddings = {}
        
        # Categories mapping
        self.categories = {
            'Food & Dining': ['restaurant', 'food', 'dining', 'cafe', 'coffee', 'lunch', 'dinner'],
            'Transportation': ['uber', 'ola', 'metro', 'bus', 'taxi', 'petrol', 'fuel', 'parking'],
            'Shopping': ['amazon', 'flipkart', 'myntra', 'shopping', 'store', 'mall', 'retail'],
            'Entertainment': ['netflix', 'spotify', 'movie', 'cinema', 'theater', 'gaming', 'streaming'],
            'Utilities': ['electricity', 'water', 'gas', 'internet', 'phone', 'mobile', 'broadband'],
            'Healthcare': ['hospital', 'clinic', 'pharmacy', 'medical', 'doctor', 'health', 'medicine'],
            'Education': ['school', 'college', 'university', 'course', 'training', 'book', 'education'],
            'Insurance': ['insurance', 'premium', 'policy', 'lic', 'health insurance', 'life insurance'],
            'Investments': ['mutual fund', 'sip', 'investment', 'stock', 'equity', 'bond', 'nps', 'ppf'],
            'Housing': ['rent', 'home loan', 'emi', 'property', 'real estate', 'maintenance'],
            'Income': ['salary', 'freelance', 'business', 'revenue', 'payment', 'credit'],
            'Business': ['office', 'supplies', 'software', 'marketing', 'professional', 'equipment']
        }
    
    def load_data(self, csv_path: str) -> pd.DataFrame:
        """Load and preprocess transaction data"""
        print(f"Loading data from {csv_path}")
        df = pd.read_csv(csv_path)
        
        # Basic preprocessing
        df['description'] = df['description'].str.lower().str.strip()
        df['merchant'] = df['merchant'].str.lower().str.strip()
        df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
        df['date'] = pd.to_datetime(df['date'])
        
        # Remove rows with missing essential data
        df = df.dropna(subset=['description', 'category', 'amount'])
        
        print(f"Loaded {len(df)} transactions")
        return df
    
    def create_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create features for ML model"""
        print("Creating features...")
        
        # Text features
        df['description_length'] = df['description'].str.len()
        df['word_count'] = df['description'].str.split().str.len()
        
        # Amount features
        df['amount_log'] = np.log1p(df['amount'])
        df['amount_category'] = pd.cut(df['amount'], 
                                     bins=[0, 100, 500, 1000, 5000, 10000, float('inf')],
                                     labels=['micro', 'small', 'medium', 'large', 'xlarge', 'xxlarge'])
        
        # Time features
        df['hour'] = df['date'].dt.hour
        df['day_of_week'] = df['date'].dt.dayofweek
        df['is_weekend'] = df['day_of_week'].isin([5, 6])
        
        # Merchant features
        df['merchant_length'] = df['merchant'].str.len()
        df['has_numbers'] = df['description'].str.contains(r'\d', regex=True)
        df['has_special_chars'] = df['description'].str.contains(r'[^a-zA-Z0-9\s]', regex=True)
        
        # Payment method features
        df['is_online'] = df['payment_method'] == 'online'
        df['is_card'] = df['payment_method'] == 'card'
        df['is_cash'] = df['payment_method'] == 'cash'
        
        return df
    
    def train_rule_engine(self, df: pd.DataFrame):
        """Train rule-based categorizer"""
        print("Training rule-based engine...")
        self.rule_engine.fit(df)
    
    def train_ml_classifier(self, df: pd.DataFrame):
        """Train machine learning classifier"""
        print("Training ML classifier...")
        
        # Prepare features
        feature_columns = [
            'description_length', 'word_count', 'amount_log', 'hour', 
            'day_of_week', 'is_weekend', 'merchant_length', 'has_numbers',
            'has_special_chars', 'is_online', 'is_card', 'is_cash'
        ]
        
        # Text features
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2),
            min_df=2
        )
        
        text_features = self.vectorizer.fit_transform(df['description'])
        
        # Combine features
        X_numerical = df[feature_columns].fillna(0)
        X_combined = np.hstack([X_numerical.values, text_features.toarray()])
        
        # Encode labels
        self.label_encoder = LabelEncoder()
        y = self.label_encoder.fit_transform(df['category'])
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X_combined, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Train model
        self.ml_classifier = RandomForestClassifier(
            n_estimators=100,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        )
        
        self.ml_classifier.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.ml_classifier.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"ML Classifier Accuracy: {accuracy:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, 
                                  target_names=self.label_encoder.classes_))
        
        return accuracy
    
    def train_embedding_model(self, df: pd.DataFrame):
        """Train embedding model for merchant similarity"""
        print("Training embedding model...")
        
        # Initialize sentence transformer
        if SentenceTransformer is not None:
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        else:
            # Fallback to TF-IDF vectorizer
            from sklearn.feature_extraction.text import TfidfVectorizer
            self.embedding_model = TfidfVectorizer(max_features=1000, stop_words='english')
        
        # Create merchant embeddings
        unique_merchants = df['merchant'].unique()
        merchant_descriptions = []
        
        for merchant in unique_merchants:
            # Get all descriptions for this merchant
            merchant_data = df[df['merchant'] == merchant]
            descriptions = merchant_data['description'].tolist()
            
            # Create a representative description
            if len(descriptions) > 1:
                # Use the most common words
                all_words = ' '.join(descriptions).split()
                word_freq = pd.Series(all_words).value_counts()
                representative = ' '.join(word_freq.head(10).index)
            else:
                representative = descriptions[0]
            
            merchant_descriptions.append(representative)
        
        # Generate embeddings
        if hasattr(self.embedding_model, 'encode'):
            # SentenceTransformer
            embeddings = self.embedding_model.encode(merchant_descriptions)
        else:
            # TF-IDF Vectorizer
            embeddings = self.embedding_model.fit_transform(merchant_descriptions).toarray()
        
        # Store merchant embeddings
        for merchant, embedding in zip(unique_merchants, embeddings):
            self.merchant_embeddings[merchant] = embedding
        
        print(f"Created embeddings for {len(unique_merchants)} merchants")
    
    def predict_category(self, description: str, amount: float, merchant: str = None, 
                        payment_method: str = None, date: str = None) -> Tuple[str, float]:
        """
        Predict transaction category using hybrid approach
        Returns: (category, confidence)
        """
        # Rule-based prediction
        rule_pred, rule_conf = self.rule_engine.predict(description, amount, merchant)
        
        if rule_conf > 0.8:  # High confidence rule-based prediction
            return rule_pred, rule_conf
        
        # ML-based prediction
        if self.ml_classifier is not None:
            # Create features
            features = self._create_prediction_features(
                description, amount, merchant, payment_method, date
            )
            
            # Predict
            ml_pred_proba = self.ml_classifier.predict_proba([features])
            ml_pred_idx = np.argmax(ml_pred_proba)
            ml_pred = self.label_encoder.inverse_transform([ml_pred_idx])[0]
            ml_conf = ml_pred_proba[0][ml_pred_idx]
            
            # Combine predictions
            if ml_conf > rule_conf:
                return ml_pred, ml_conf
            else:
                return rule_pred, rule_conf
        
        return rule_pred, rule_conf
    
    def _create_prediction_features(self, description: str, amount: float, 
                                  merchant: str = None, payment_method: str = None, 
                                  date: str = None) -> np.ndarray:
        """Create features for prediction"""
        # Basic features
        features = [
            len(description),
            len(description.split()),
            np.log1p(amount),
        ]
        
        # Time features
        if date:
            dt = pd.to_datetime(date)
            features.extend([dt.hour, dt.dayofweek, dt.dayofweek in [5, 6]])
        else:
            features.extend([12, 0, False])  # Default values
        
        # Merchant features
        if merchant:
            features.extend([len(merchant), bool(re.search(r'\d', description))])
        else:
            features.extend([0, False])
        
        # Text features
        features.extend([
            bool(re.search(r'[^a-zA-Z0-9\s]', description)),
            payment_method == 'online' if payment_method else False,
            payment_method == 'card' if payment_method else False,
            payment_method == 'cash' if payment_method else False
        ])
        
        # TF-IDF features
        if self.vectorizer:
            text_features = self.vectorizer.transform([description]).toarray()[0]
            features.extend(text_features)
        else:
            features.extend([0] * 1000)  # Default TF-IDF features
        
        return np.array(features)
    
    def save_models(self):
        """Save all trained models"""
        print("Saving models...")
        
        # Save ML classifier
        if self.ml_classifier:
            joblib.dump(self.ml_classifier, self.model_dir / 'ml_classifier.pkl')
        
        # Save vectorizer
        if self.vectorizer:
            joblib.dump(self.vectorizer, self.model_dir / 'vectorizer.pkl')
        
        # Save label encoder
        if self.label_encoder:
            joblib.dump(self.label_encoder, self.model_dir / 'label_encoder.pkl')
        
        # Save rule engine
        joblib.dump(self.rule_engine, self.model_dir / 'rule_engine.pkl')
        
        # Save merchant embeddings
        with open(self.model_dir / 'merchant_embeddings.json', 'w') as f:
            # Convert numpy arrays to lists for JSON serialization
            embeddings_dict = {
                merchant: embedding.tolist() 
                for merchant, embedding in self.merchant_embeddings.items()
            }
            json.dump(embeddings_dict, f)
        
        # Save model metadata
        metadata = {
            'categories': list(self.categories.keys()),
            'model_version': '1.0.0',
            'training_date': pd.Timestamp.now().isoformat(),
            'num_merchants': len(self.merchant_embeddings)
        }
        
        with open(self.model_dir / 'metadata.json', 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"Models saved to {self.model_dir}")
    
    def load_models(self):
        """Load pre-trained models"""
        print("Loading models...")
        
        try:
            # Load ML classifier
            self.ml_classifier = joblib.load(self.model_dir / 'ml_classifier.pkl')
            
            # Load vectorizer
            self.vectorizer = joblib.load(self.model_dir / 'vectorizer.pkl')
            
            # Load label encoder
            self.label_encoder = joblib.load(self.model_dir / 'label_encoder.pkl')
            
            # Load rule engine
            self.rule_engine = joblib.load(self.model_dir / 'rule_engine.pkl')
            
            # Load merchant embeddings
            with open(self.model_dir / 'merchant_embeddings.json', 'r') as f:
                embeddings_dict = json.load(f)
                self.merchant_embeddings = {
                    merchant: np.array(embedding) 
                    for merchant, embedding in embeddings_dict.items()
                }
            
            print("Models loaded successfully")
            return True
            
        except FileNotFoundError as e:
            print(f"Model files not found: {e}")
            return False


class RuleBasedCategorizer:
    """Rule-based transaction categorizer"""
    
    def __init__(self):
        self.rules = {}
        self.merchant_categories = {}
    
    def fit(self, df: pd.DataFrame):
        """Learn rules from data"""
        print("Learning rules from data...")
        
        # Learn merchant categories
        for merchant in df['merchant'].unique():
            merchant_data = df[df['merchant'] == merchant]
            if len(merchant_data) > 0:
                # Get most common category for this merchant
                most_common = merchant_data['category'].mode()
                if len(most_common) > 0:
                    self.merchant_categories[merchant] = most_common[0]
        
        # Learn keyword rules
        for category in df['category'].unique():
            category_data = df[df['category'] == category]
            descriptions = category_data['description'].str.lower()
            
            # Find common keywords
            all_words = ' '.join(descriptions).split()
            word_freq = pd.Series(all_words).value_counts()
            
            # Get top keywords (excluding common words)
            common_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
            keywords = word_freq[~word_freq.index.isin(common_words)].head(10)
            
            self.rules[category] = keywords.index.tolist()
        
        print(f"Learned rules for {len(self.rules)} categories")
        print(f"Learned merchant mappings for {len(self.merchant_categories)} merchants")
    
    def predict(self, description: str, amount: float, merchant: str = None) -> Tuple[str, float]:
        """Predict category using rules"""
        description_lower = description.lower()
        
        # Check merchant-based rules first
        if merchant and merchant in self.merchant_categories:
            return self.merchant_categories[merchant], 0.9
        
        # Check keyword-based rules
        best_category = None
        best_score = 0
        
        for category, keywords in self.rules.items():
            score = 0
            for keyword in keywords:
                if keyword in description_lower:
                    score += 1
            
            if score > best_score:
                best_score = score
                best_category = category
        
        if best_category and best_score > 0:
            confidence = min(0.8, best_score / 5.0)  # Normalize confidence
            return best_category, confidence
        
        # Default fallback
        return 'Others', 0.1


def main():
    """Main training function"""
    print("🚀 Starting FinTwin Transaction Categorizer Training")
    print("=" * 60)
    
    # Initialize categorizer
    categorizer = TransactionCategorizer()
    
    # Load data
    data_path = Path("data/seed_transactions.csv")
    if not data_path.exists():
        print(f"❌ Data file not found: {data_path}")
        return
    
    df = categorizer.load_data(str(data_path))
    
    # Create features
    df = categorizer.create_features(df)
    
    # Train components
    categorizer.train_rule_engine(df)
    ml_accuracy = categorizer.train_ml_classifier(df)
    categorizer.train_embedding_model(df)
    
    # Save models
    categorizer.save_models()
    
    # Test predictions
    print("\n🧪 Testing predictions...")
    test_cases = [
        ("Zomato Order - Lunch", 450.0, "zomato", "online"),
        ("Uber Ride to Office", 120.0, "uber", "online"),
        ("Amazon Purchase - Electronics", 2500.0, "amazon", "online"),
        ("Electricity Bill Payment", 1800.0, "mseb", "online"),
        ("Salary Credit", 52000.0, "company xyz", "transfer"),
    ]
    
    for description, amount, merchant, payment_method in test_cases:
        category, confidence = categorizer.predict_category(
            description, amount, merchant, payment_method
        )
        print(f"  {description} -> {category} (confidence: {confidence:.2f})")
    
    print("\n✅ Training completed successfully!")
    print(f"📊 ML Model Accuracy: {ml_accuracy:.4f}")
    print(f"💾 Models saved to: {categorizer.model_dir}")


if __name__ == "__main__":
    main()
