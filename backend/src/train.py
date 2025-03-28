import torch
from torch.utils.data import Dataset, DataLoader
from transformers import (
    DistilBertTokenizer,
    DistilBertForSequenceClassification,
    AdamW,
    get_linear_schedule_with_warmup
)
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import logging
import os
from typing import List, Dict, Tuple, Any
import json
from datetime import datetime
from tqdm import tqdm
import nltk
from nltk.tokenize import word_tokenize
import random

# Download required NLTK data
nltk.download('punkt')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TextAugmenter:
    """Text augmentation techniques for training data"""
    
    @staticmethod
    def synonym_replacement(text: str, n: int = 1) -> str:
        """Replace n words in the text with their synonyms"""
        words = word_tokenize(text)
        # Implementation would require WordNet
        # For now, return original text
        return text
    
    @staticmethod
    def random_deletion(text: str, p: float = 0.1) -> str:
        """Randomly delete words from the text with probability p"""
        words = word_tokenize(text)
        if len(words) == 1:
            return text
            
        new_words = []
        for word in words:
            if random.random() > p:
                new_words.append(word)
                
        if len(new_words) == 0:
            rand_int = random.randint(0, len(words)-1)
            new_words = [words[rand_int]]
            
        return ' '.join(new_words)
    
    @staticmethod
    def random_swap(text: str, n: int = 1) -> str:
        """Randomly swap n pairs of words in the text"""
        words = word_tokenize(text)
        if len(words) < 2:
            return text
            
        for _ in range(n):
            idx1, idx2 = random.sample(range(len(words)), 2)
            words[idx1], words[idx2] = words[idx2], words[idx1]
            
        return ' '.join(words)

class TextDataset(Dataset):
    def __init__(self, texts: List[str], labels: List[int], tokenizer, max_length: int = 512, augment: bool = False):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
        self.augment = augment
        self.augmenter = TextAugmenter()

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = self.labels[idx]

        # Apply augmentation if enabled
        if self.augment and random.random() < 0.3:  # 30% chance of augmentation
            aug_type = random.choice(['delete', 'swap'])
            if aug_type == 'delete':
                text = self.augmenter.random_deletion(text)
            else:
                text = self.augmenter.random_swap(text)

        encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )

        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'label': torch.tensor(label, dtype=torch.long)
        }

class ModelTrainer:
    def __init__(
        self,
        model_name: str = 'distilbert-base-uncased',
        num_labels: int = 2,
        max_length: int = 512,
        batch_size: int = 16,
        learning_rate: float = 2e-5,
        num_epochs: int = 3,
        warmup_steps: int = 0,
        device: str = None,
        use_augmentation: bool = True
    ):
        self.model_name = model_name
        self.num_labels = num_labels
        self.max_length = max_length
        self.batch_size = batch_size
        self.learning_rate = learning_rate
        self.num_epochs = num_epochs
        self.warmup_steps = warmup_steps
        self.device = device or ('cuda' if torch.cuda.is_available() else 'cpu')
        self.use_augmentation = use_augmentation
        
        self.tokenizer = DistilBertTokenizer.from_pretrained(model_name)
        self.model = DistilBertForSequenceClassification.from_pretrained(
            model_name,
            num_labels=num_labels
        ).to(self.device)
        
        logger.info(f"Using device: {self.device}")
        logger.info(f"Augmentation enabled: {self.use_augmentation}")

    def prepare_data(
        self,
        data_path: str,
        text_column: str,
        label_column: str,
        test_size: float = 0.2
    ) -> Tuple[DataLoader, DataLoader]:
        """Prepare training and validation data loaders"""
        
        # Load and preprocess data
        df = pd.read_csv(data_path)
        texts = df[text_column].tolist()
        labels = df[label_column].tolist()

        # Split data
        train_texts, val_texts, train_labels, val_labels = train_test_split(
            texts, labels, test_size=test_size, random_state=42
        )

        # Create datasets
        train_dataset = TextDataset(train_texts, train_labels, self.tokenizer, self.max_length, self.use_augmentation)
        val_dataset = TextDataset(val_texts, val_labels, self.tokenizer, self.max_length, self.use_augmentation)

        # Create data loaders
        train_loader = DataLoader(
            train_dataset,
            batch_size=self.batch_size,
            shuffle=True,
            num_workers=2
        )
        val_loader = DataLoader(
            val_dataset,
            batch_size=self.batch_size,
            shuffle=False,
            num_workers=2
        )

        return train_loader, val_loader

    def train(
        self,
        train_loader: DataLoader,
        val_loader: DataLoader,
        save_dir: str = 'weights'
    ) -> Dict:
        """Train the model and return training history"""
        
        # Prepare optimizer and scheduler
        optimizer = AdamW(self.model.parameters(), lr=self.learning_rate)
        total_steps = len(train_loader) * self.num_epochs
        scheduler = get_linear_schedule_with_warmup(
            optimizer,
            num_warmup_steps=self.warmup_steps,
            num_training_steps=total_steps
        )

        # Training history
        history = {
            'train_loss': [],
            'val_loss': [],
            'val_accuracy': []
        }

        # Create save directory if it doesn't exist
        os.makedirs(save_dir, exist_ok=True)

        # Training loop
        best_val_accuracy = 0.0
        for epoch in range(self.num_epochs):
            logger.info(f"Epoch {epoch + 1}/{self.num_epochs}")
            
            # Training phase
            self.model.train()
            train_loss = 0
            progress_bar = tqdm(train_loader, desc=f"Training")
            
            for batch in progress_bar:
                optimizer.zero_grad()
                
                input_ids = batch['input_ids'].to(self.device)
                attention_mask = batch['attention_mask'].to(self.device)
                labels = batch['label'].to(self.device)

                outputs = self.model(
                    input_ids=input_ids,
                    attention_mask=attention_mask,
                    labels=labels
                )

                loss = outputs.loss
                loss.backward()
                optimizer.step()
                scheduler.step()

                train_loss += loss.item()
                progress_bar.set_postfix({'loss': loss.item()})

            avg_train_loss = train_loss / len(train_loader)
            history['train_loss'].append(avg_train_loss)

            # Validation phase
            self.model.eval()
            val_loss = 0
            correct_predictions = 0
            total_predictions = 0

            with torch.no_grad():
                for batch in tqdm(val_loader, desc="Validation"):
                    input_ids = batch['input_ids'].to(self.device)
                    attention_mask = batch['attention_mask'].to(self.device)
                    labels = batch['label'].to(self.device)

                    outputs = self.model(
                        input_ids=input_ids,
                        attention_mask=attention_mask,
                        labels=labels
                    )

                    val_loss += outputs.loss.item()
                    predictions = torch.argmax(outputs.logits, dim=1)
                    correct_predictions += (predictions == labels).sum().item()
                    total_predictions += labels.shape[0]

            avg_val_loss = val_loss / len(val_loader)
            val_accuracy = correct_predictions / total_predictions
            
            history['val_loss'].append(avg_val_loss)
            history['val_accuracy'].append(val_accuracy)

            logger.info(f"Epoch {epoch + 1} - Train Loss: {avg_train_loss:.4f}, "
                       f"Val Loss: {avg_val_loss:.4f}, Val Accuracy: {val_accuracy:.4f}")

            # Save best model
            if val_accuracy > best_val_accuracy:
                best_val_accuracy = val_accuracy
                torch.save(
                    self.model.state_dict(),
                    os.path.join(save_dir, 'toxic_classifier.pt')
                )
                logger.info(f"Saved best model with validation accuracy: {val_accuracy:.4f}")

            # Save training history
            with open(os.path.join(save_dir, 'training_history.json'), 'w') as f:
                json.dump(history, f)

        return history

    def evaluate_model(self, val_loader: DataLoader) -> Dict[str, Any]:
        """Evaluate model performance"""
        self.model.eval()
        all_predictions = []
        all_labels = []
        val_loss = 0

        with torch.no_grad():
            for batch in val_loader:
                input_ids = batch['input_ids'].to(self.device)
                attention_mask = batch['attention_mask'].to(self.device)
                labels = batch['label'].to(self.device)

                outputs = self.model(
                    input_ids=input_ids,
                    attention_mask=attention_mask,
                    labels=labels
                )

                val_loss += outputs.loss.item()
                predictions = torch.argmax(outputs.logits, dim=1)
                
                all_predictions.extend(predictions.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())

        # Calculate metrics
        report = classification_report(all_labels, all_predictions, output_dict=True)
        conf_matrix = confusion_matrix(all_labels, all_predictions)

        return {
            'classification_report': report,
            'confusion_matrix': conf_matrix.tolist(),
            'val_loss': val_loss / len(val_loader)
        }

    def save_model(self, save_dir: str, metrics: Dict[str, Any]):
        """Save model, tokenizer, and training metrics"""
        os.makedirs(save_dir, exist_ok=True)
        
        # Save model
        self.model.save_pretrained(os.path.join(save_dir, 'model'))
        self.tokenizer.save_pretrained(os.path.join(save_dir, 'tokenizer'))
        
        # Save metrics
        metrics['timestamp'] = datetime.now().isoformat()
        metrics['model_config'] = {
            'model_name': self.model_name,
            'num_labels': self.num_labels,
            'max_length': self.max_length,
            'batch_size': self.batch_size,
            'learning_rate': self.learning_rate,
            'num_epochs': self.num_epochs,
            'device': str(self.device),
            'use_augmentation': self.use_augmentation
        }
        
        with open(os.path.join(save_dir, 'metrics.json'), 'w') as f:
            json.dump(metrics, f, indent=2)

def main():
    """Main training function"""
    # Training configuration
    config = {
        'model_name': 'distilbert-base-uncased',
        'num_labels': 2,
        'max_length': 512,
        'batch_size': 16,
        'learning_rate': 2e-5,
        'num_epochs': 3,
        'warmup_steps': 0,
        'save_dir': 'weights',
        'use_augmentation': True
    }

    # Initialize trainer
    trainer = ModelTrainer(**config)

    # Prepare data
    train_loader, val_loader = trainer.prepare_data(
        data_path='data/toxic_comments.csv',
        text_column='text',
        label_column='is_toxic',
        test_size=0.2
    )

    # Train model
    history = trainer.train(train_loader, val_loader, config['save_dir'])
    
    # Log final results
    logger.info("Training completed!")
    logger.info(f"Best validation accuracy: {max(history['val_accuracy']):.4f}")

    # Evaluate model
    metrics = trainer.evaluate_model(val_loader)
    logger.info("Model evaluation metrics:")
    for metric, value in metrics.items():
        logger.info(f"{metric}: {value}")

    # Save model
    trainer.save_model(config['save_dir'], metrics)

if __name__ == "__main__":
    main() 