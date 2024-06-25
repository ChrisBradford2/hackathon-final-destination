from flask import current_app as app
from .transcription import transcribe_audio
from .sentiment_analysis import analyze_sentiment
from .upload_to_s3 import upload_to_s3
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

@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    if 'file' not in request.files:
        return "No file part in the request", 400

    file = request.files['file']
    if file.filename == '':
        return "No file selected for uploading", 400

    bucket_name = 'hackathon-final-destination'
    s3_file_name = file.filename

    if upload_to_s3(file, bucket_name, s3_file_name):
        return "File successfully uploaded", 200
    else:
        return "File upload failed", 500
