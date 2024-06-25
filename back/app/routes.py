from flask import current_app as app
from .transcription import transcribe_audio
from .sentiment_analysis import analyze_sentiment
from .upload_file import upload_file
from flask import request, jsonify, Blueprint

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return "Hello World!"

@main.route('/transcribe', methods=['POST'])
def transcribe():
    audio_file = request.files['file']
    transcription = transcribe_audio(audio_file)
    return jsonify({"transcription": transcription})

@main.route('/analyze_sentiment', methods=['POST'])
def sentiment_analysis():
    text = request.json.get('text')
    sentiment = analyze_sentiment(text)
    return jsonify({"sentiment": sentiment})

@main.route('/upload_audio', methods=['POST'])
def upload_audio():
    try:
        if 'file' not in request.files:
            app.logger.error("No file part in the request")
            return "No file part in the request", 400

        file = request.files['file']
        if file.filename == '':
            app.logger.error("No file selected for uploading")
            return "No file selected for uploading", 400

        bucket_name = 'hackathon-final-destination'
        s3_file_name = file.filename

        if upload_file(file, bucket_name, s3_file_name):
            app.logger.info(f"File {s3_file_name} successfully uploaded to {bucket_name}")
            return "File successfully uploaded", 200
        else:
            app.logger.error(f"File upload failed for {s3_file_name}")
            return "File upload failed", 500
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return f"An error occurred: {str(e)}", 500
