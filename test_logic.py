import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from ml_engine import ml_engine

def test_emotion(text):
    result = ml_engine.analyze_text(text)
    print(f"Text: {text}")
    print(f"Emotion: {result['emotion']}")
    for emo, score in result['scores'].items():
        print(f"  - {emo}: {score:.2%}")
    print("-" * 30)

if __name__ == "__main__":
    test_cases = [
        "I am so happy and I trust you completely!",
        "This is terrible, I hate it so much, so annoying.",
        "I am looking forward to the future and upcoming events.",
        "I feel scared and worried about the panic.",
        "This is a neutral sentence with no emotions.",
        "I am happy but also a bit worried."
    ]
    
    for case in test_cases:
        test_emotion(case)
