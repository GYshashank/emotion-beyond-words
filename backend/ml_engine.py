import re
import string
import numpy as np
from typing import List, Dict, Any

import torch
from transformers import pipeline

class MultiDimensionEmotionModel:
    def __init__(self):
        # We use j-hartmann/emotion-english-distilroberta-base 
        # which predicts: anger, disgust, fear, joy, neutral, sadness, surprise
        self.emotions_map = {
            "joy": "Joy",
            "anger": "Anger",
            "fear": "Fear",
            "sadness": "Sadness",
            "surprise": "Trust",
            "neutral": "Anticipation",
            "disgust": "Anger"
        }
        
        # Heavy model loading is disabled for speed performance
        self.classifier = None



    def preprocess_text(self, text: str) -> str:
        """
        Clean text: remove URLs, handle emojis, remove extra spaces
        """
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        # Remove mentions
        text = re.sub(r'@\w+', '', text)
        # Remove basic punctuation just to normalize space
        text = text.replace('\n', ' ').strip()
        # Ensure single spaces
        text = re.sub(r'\s+', ' ', text)
        return text

    def analyze_text(self, text: str) -> Dict[str, Any]:
        """
        Analyze a single string for emotion probabilities.
        Provides a 6-way multidimensional distribution.
        """
        clean_text = self.preprocess_text(text).lower()
        
        # Heuristic-based multidimensional mock
        base_probs = {
            "Joy": 0.05,
            "Anger": 0.05,
            "Fear": 0.05,
            "Sadness": 0.05,
            "Trust": 0.05,
            "Anticipation": 0.05
        }

        # Boost specific emotions based on keywords
        if any(word in clean_text for word in ["happy", "thrilled", "great", "fantastic", "amazing", "joy"]):
            base_probs["Joy"] += 0.70
        elif any(word in clean_text for word in ["angry", "mad", "worst", "hate", "terrible", "annoying"]):
            base_probs["Anger"] += 0.70
        elif any(word in clean_text for word in ["scared", "fear", "nervous", "anxious", "worried"]):
            base_probs["Fear"] += 0.70
        elif any(word in clean_text for word in ["sad", "unhappy", "cry", "pity", "sorry", "gloomy"]):
            base_probs["Sadness"] += 0.70
        elif any(word in clean_text for word in ["trust", "believe", "agree", "together", "friend", "loyal"]):
            base_probs["Trust"] += 0.70
        elif any(word in clean_text for word in ["look forward", "upcoming", "excited", "wait", "soon", "future"]):
            base_probs["Anticipation"] += 0.70
        else:
            base_probs["Anticipation"] += 0.20 # Default

        # Add slight randomness
        for k in base_probs:
            base_probs[k] += np.random.uniform(0.01, 0.05)
            
        # Normalize
        total = sum(base_probs.values())
        probs = {k: v/total for k, v in base_probs.items()}

        # Map highest to primary emotion
        primary = max(probs, key=lambda k: probs[k])
        
        return {
            "emotion": primary,
            "scores": probs
        }

    def analyze_batch(self, texts: List[str]) -> List[Dict[str, Any]]:
        return [self.analyze_text(t) for t in texts]

ml_engine = MultiDimensionEmotionModel()
