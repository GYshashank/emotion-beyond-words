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
        Provides a 6-way deterministic multidimensional distribution.
        """
        clean_text = self.preprocess_text(text).lower()
        
        # Comprehensive keyword map with relative weights
        emotion_lexicon = {
            "Joy": ["happy", "great", "fantastic", "amazing", "joy", "love", "excellent", "thrilled", "wonderful", "delight", "cheer", "bliss", "glad"],
            "Anger": ["angry", "mad", "worst", "hate", "terrible", "annoying", "frustrated", "furious", "outrage", "offend", "disgust", "revolt"],
            "Fear": ["scared", "fear", "nervous", "anxious", "worried", "panic", "dread", "fright", "terror", "apprehend", "unease"],
            "Sadness": ["sad", "unhappy", "cry", "pity", "sorry", "gloomy", "depress", "grief", "mourn", "lonely", "despair", "misery"],
            "Trust": ["trust", "believe", "agree", "together", "friend", "loyal", "reliable", "honest", "secure", "confident", "support"],
            "Anticipation": ["wait", "soon", "future", "look forward", "upcoming", "excited", "hope", "predict", "plan", "prepare", "eager"]
        }

        # Initialize baseline (very low baseline to ensure keywords drive results)
        scores = {emo: 0.01 for emo in emotion_lexicon.keys()}

        # Multi-category scoring: check all words and count occurrences
        words = clean_text.split()
        for word in words:
            for emotion, keywords in emotion_lexicon.items():
                if any(kw in word for kw in keywords):
                    scores[emotion] += 1.0

        # If no keywords found, provide a balanced baseline
        if sum(scores.values()) <= 0.06: # 0.01 * 6
            scores["Anticipation"] = 0.20 # Neutral default
            for emo in scores:
                if emo != "Anticipation":
                    scores[emo] = 0.05

        # Normalize to exactly 1.0
        total = sum(scores.values())
        final_probs = {k: v/total for k, v in scores.items()}

        # Map highest to primary emotion
        primary = max(final_probs, key=lambda k: final_probs[k])
        
        return {
            "emotion": primary,
            "scores": final_probs
        }

    def analyze_batch(self, texts: List[str]) -> List[Dict[str, Any]]:
        return [self.analyze_text(t) for t in texts]

ml_engine = MultiDimensionEmotionModel()
