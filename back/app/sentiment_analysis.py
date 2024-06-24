from transformers import pipeline

def analyze_sentiment(text):
    sentiment_pipeline = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")
    result = sentiment_pipeline(text)
    return result[0]
