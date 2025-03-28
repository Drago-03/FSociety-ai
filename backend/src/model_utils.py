from typing import List, Dict, Union, Optional, Any
import torch
from transformers import (
    DistilBertTokenizer,
    DistilBertForSequenceClassification,
    DistilBertModel,
    pipeline
)
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.tokenize import sent_tokenize
import logging
import os
import datetime
import re

# Download required NLTK data
nltk.download('punkt')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ContentModerator:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
        
        # Load models for different tasks
        self.toxic_classifier = DistilBertForSequenceClassification.from_pretrained(
            'distilbert-base-uncased',
            num_labels=2
        ).to(self.device)
        
        # Load base model for embeddings
        self.base_model = DistilBertModel.from_pretrained('distilbert-base-uncased').to(self.device)
        
        # Initialize sentiment analysis pipeline
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english",
            device=0 if torch.cuda.is_available() else -1
        )

        # Initialize preprocessing parameters
        self.max_length = 512
        self.min_confidence = 0.7
        self.categories = ['vulgar', 'cyberbullying', 'misinformation']

        # Load custom weights if available
        self._load_custom_weights()

    def _load_custom_weights(self):
        """Load custom fine-tuned weights if available"""
        custom_weights_path = os.path.join(os.path.dirname(__file__), 'weights', 'toxic_classifier.pt')
        if os.path.exists(custom_weights_path):
            try:
                self.toxic_classifier.load_state_dict(
                    torch.load(custom_weights_path, map_location=self.device)
                )
                logger.info("Loaded custom weights for toxic classifier")
            except Exception as e:
                logger.error(f"Error loading custom weights: {e}")

    def get_text_embedding(self, text: str) -> np.ndarray:
        """Generate embedding for input text"""
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
            padding=True
        ).to(self.device)

        with torch.no_grad():
            outputs = self.base_model(**inputs)
            # Use mean pooling to get sentence embedding
            embedding = outputs.last_hidden_state.mean(dim=1).cpu().numpy()

        return embedding

    def check_similarity(self, text1: str, text2: str) -> float:
        """Check semantic similarity between two texts"""
        embedding1 = self.get_text_embedding(text1)
        embedding2 = self.get_text_embedding(text2)
        
        similarity = cosine_similarity(embedding1, embedding2)[0][0]
        return float(similarity)

    def analyze_toxicity(self, text: str) -> Dict[str, Union[float, str, List[str]]]:
        """Analyze text for toxic content"""
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
            padding=True
        ).to(self.device)

        with torch.no_grad():
            outputs = self.toxic_classifier(**inputs)
            probabilities = torch.softmax(outputs.logits, dim=1)
            toxic_prob = probabilities[0][1].item()

        # Get sentiment analysis
        sentiment = self.sentiment_analyzer(text)[0]
        
        # Split text into sentences for more detailed analysis
        sentences = sent_tokenize(text)
        toxic_sentences = []
        
        for sentence in sentences:
            sentence_inputs = self.tokenizer(
                sentence,
                return_tensors="pt",
                truncation=True,
                max_length=512,
                padding=True
            ).to(self.device)
            
            with torch.no_grad():
                sentence_outputs = self.toxic_classifier(**sentence_inputs)
                sentence_probs = torch.softmax(sentence_outputs.logits, dim=1)
                if sentence_probs[0][1].item() > 0.7:  # High toxicity threshold
                    toxic_sentences.append(sentence)

        return {
            "toxic_probability": toxic_prob,
            "sentiment": sentiment["label"],
            "sentiment_score": sentiment["score"],
            "toxic_sentences": toxic_sentences,
            "moderation_decision": "reject" if toxic_prob > 0.7 else "approve",
            "confidence_score": toxic_prob if toxic_prob > 0.5 else (1 - toxic_prob)
        }

    def batch_analyze_toxicity(self, texts: List[str]) -> List[Dict[str, Union[float, str, List[str]]]]:
        """Analyze multiple texts for toxic content"""
        results = []
        for text in texts:
            results.append(self.analyze_toxicity(text))
        return results

    def get_moderation_summary(self, text: str) -> Dict[str, Union[str, float, List[str]]]:
        """Generate a comprehensive moderation summary"""
        toxicity_analysis = self.analyze_toxicity(text)
        
        # Additional analysis could be added here
        return {
            **toxicity_analysis,
            "text_length": len(text),
            "num_sentences": len(sent_tokenize(text)),
            "moderation_timestamp": datetime.datetime.now().isoformat()
        }

    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess input text"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Basic URL removal
        text = re.sub(r'http\S+|www\S+|https\S+', '[URL]', text, flags=re.MULTILINE)
        
        # Remove special characters but keep punctuation
        text = re.sub(r'[^\w\s.,!?-]', '', text)
        
        return text

    def analyze_content_type(self, text: str) -> Dict[str, float]:
        """Analyze content type and return confidence scores for each category"""
        preprocessed_text = self.preprocess_text(text)
        
        # Get embeddings for the text
        inputs = self.tokenizer(
            preprocessed_text,
            return_tensors="pt",
            truncation=True,
            max_length=self.max_length,
            padding=True
        ).to(self.device)

        with torch.no_grad():
            # Get base model outputs
            outputs = self.base_model(**inputs)
            embeddings = outputs.last_hidden_state.mean(dim=1)
            
            # Get predictions for each category
            category_scores = {}
            for category in self.categories:
                category_outputs = self.toxic_classifier(inputs_embeds=embeddings)
                probabilities = torch.softmax(category_outputs.logits, dim=1)
                category_scores[category] = probabilities[0][1].item()

        return category_scores

    def get_detailed_analysis(self, text: str) -> Dict[str, Any]:
        """Perform detailed content analysis"""
        basic_analysis = self.analyze_toxicity(text)
        content_types = self.analyze_content_type(text)
        sentiment = self.sentiment_analyzer(text)[0]
        
        # Split into sentences and analyze each
        sentences = sent_tokenize(text)
        sentence_analysis = []
        
        for sentence in sentences:
            sentence_scores = self.analyze_content_type(sentence)
            sentence_sentiment = self.sentiment_analyzer(sentence)[0]
            
            sentence_analysis.append({
                'text': sentence,
                'scores': sentence_scores,
                'sentiment': sentence_sentiment
            })

        return {
            'overall_analysis': basic_analysis,
            'content_type_scores': content_types,
            'sentiment': sentiment,
            'sentence_level_analysis': sentence_analysis,
            'metadata': {
                'text_length': len(text),
                'sentence_count': len(sentences),
                'analysis_timestamp': datetime.now().isoformat()
            }
        }

    @staticmethod
    def get_model_info() -> Dict[str, str]:
        """Get information about the current model configuration"""
        return {
            "model_name": "DistilBERT",
            "base_model": "distilbert-base-uncased",
            "device": str(torch.device("cuda" if torch.cuda.is_available() else "cpu")),
            "version": "1.0.0",
            "supported_tasks": [
                "toxicity_detection",
                "sentiment_analysis",
                "semantic_similarity"
            ]
        }
