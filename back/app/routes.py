from flask import Flask, request, jsonify, render_template
from .transcription import transcribe_audio
from .sentiment_analysis import analyze_sentiment

app = Flask(__name__)

@app.route('/')
def index():
    return "Bienvenue sur la plateforme de télésuivi améliorée par l'IA."

@app.route('/transcribe', methods=['POST'])
def transcribe():
    audio_file = request.files['file']
    transcription = transcribe_audio(audio_file)
    return jsonify({"transcription": transcription})

@app.route('/analyze_sentiment', methods=['POST'])
def sentiment_analysis():
    text = request.json.get('text')
    sentiment = analyze_sentiment(text)
    return jsonify({"sentiment": sentiment})
