from transformers import pipeline

sentiment_pipeline = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

def analyze_sentiment(text):
    result = sentiment_pipeline(text)[0]
    label_map = {
        "1 star": "Très négatif",
        "2 stars": "Négatif",
        "3 stars": "Neutre",
        "4 stars": "Positif",
        "5 stars": "Très positif"
    }
    sentiment = {
        "label": label_map.get(result['label'], "Inconnu"),
        "score": result['score']
    }
    return sentiment
