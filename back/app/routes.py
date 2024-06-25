from .models.Audio import Audio
from flask import Blueprint, request, jsonify, current_app as app
from .transcription import transcribe_audio, transcribe_audio_from_url
from .sentiment_analysis import analyze_sentiment
from .upload_file import upload_file
from . import db

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

@main.route('/transcribe_url', methods=['POST'])
def transcribe_url():
    try:
        data = request.get_json()
        url = data.get('url')
        if not url:
            return "No URL provided", 400
        
        transcription = transcribe_audio_from_url(url)
        return jsonify({"transcription": transcription})
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return f"An error occurred: {str(e)}", 500
    
@main.route('/audios', methods=['GET'])
def get_audios():
    try:
        audios = Audio.query.all()
        audio_list = []
        for audio in audios:
            audio_data = {
                'id': audio.id,
                'createdAt': audio.createdAt,
                'audio': audio.audio,
                'isAnalysed': audio.isAnalysed,
                'transcription': audio.transcription,
                'isInNeed': audio.isInNeed,
                'url': audio.url
            }
            audio_list.append(audio_data)
        return jsonify(audio_list), 200
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return f"An error occurred: {str(e)}", 500
    
@main.route('/audios/<int:audio_id>', methods=['GET'])
def get_audio(audio_id):
    try:
        audio = Audio.query.get(audio_id)
        if not audio:
            return "Audio not found", 404
        
        audio_data = {
            'id': audio.id,
            'createdAt': audio.createdAt,
            'audio': audio.audio,
            'isAnalysed': audio.isAnalysed,
            'transcription': audio.transcription,
            'isInNeed': audio.isInNeed,
            'url': audio.url
        }
        return jsonify(audio_data), 200
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return f"An error occurred: {str(e)}", 500

@main.route('/transcribe_audio/<int:audio_id>', methods=['POST'])
def transcribe_audio_by_id(audio_id):
    try:
        audio = Audio.query.get(audio_id)
        if not audio:
            return "Audio not found", 404
        
        transcription = transcribe_audio_from_url(audio.url)
        audio.transcription = transcription
        audio.isAnalysed = True
        db.session.commit()  # Sauvegarder les changements dans la base de données
        app.logger.info(f"Transcription for audio {audio_id} completed")

        return jsonify({"transcription": transcription}), 200
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return f"An error occurred: {str(e)}", 500
