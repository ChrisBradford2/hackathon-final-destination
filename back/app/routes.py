from flask import current_app as app
from .transcription import transcribe_audio
from .sentiment_analysis import analyze_sentiment
from flask import request, jsonify

@app.route('/')
def index():
    return "Hello World!"

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
