from .models.Audio import Audio
from flask import Blueprint, request, jsonify, current_app as app, json
from .transcription import transcribe_audio, transcribe_audio_from_url
from .sentiment_analysis import analyze_sentiment, refine_transcription
from .upload_file import upload_file
from . import db

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return "Hello World!"

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
            return jsonify({"error": "Audio not found"}), 404
        
        try:
            transcription = transcribe_audio_from_url(audio.url)
            refined_transcription_data = refine_transcription(transcription)
            if "error" in refined_transcription_data:
                refined_transcription = refined_transcription_data["error"]
            else:
                refined_transcription = refined_transcription_data["transcription"]
        except Exception as transcribe_error:
            refined_transcription = f"Error during transcription refinement. Status code: 404"
            app.logger.error(f"Transcription error for audio {audio_id}: {str(transcribe_error)}")
        
        # Store the refined transcription as plain text
        audio.transcription = refined_transcription
        audio.isAnalysed = True
        
        db.session.commit()  # Save changes to the database
        app.logger.info(f"Transcription for audio {audio_id} completed")

        return jsonify({"transcription": refined_transcription}), 200
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@main.route('/analyze/<int:audio_id>', methods=['GET'])
def analyze_audio(audio_id):
    try:
        audio = Audio.query.get(audio_id)
        if not audio:
            return "Audio not found", 404
        
        if audio.transcription == None:
            return "Transcription not found", 404
        sentiment = analyze_sentiment(audio.transcription)
        if (sentiment['label'] == 'Négatif' or sentiment['label'] == 'Très négatif'):
            audio.isInNeed = True
        else :
            audio.isInNeed = False
        audio.isAnalysed = True
        db.session.commit()  # Sauvegarder les changements dans la base de données
        app.logger.info(f"Sentiment analysis for audio {audio_id} completed")
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return f"An error occurred: {str(e)}", 500
