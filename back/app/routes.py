from .send_sms import send_sms
from .models.Audio import Audio
from .models.Label import Label
from .models.Sentiments import Sentiments
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
            send_sms(f"New audio file uploaded: {s3_file_name}")
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
            sentiment_data = None
            if audio.sentiment:
                sentiment_data = {
                    'label': audio.sentiment.label.name,
                    'score': audio.sentiment.score
                }

            audio_data = {
                'id': audio.id,
                'createdAt': audio.createdAt,
                'audio': audio.audio,
                'isAnalysed': audio.isAnalysed,
                'transcription': audio.transcription,
                'sentiment': sentiment_data,
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

        sentiment_data = None
        if audio.sentiment:
            sentiment_data = {
                'label': audio.sentiment.label.name,
                'score': audio.sentiment.score
            }
        
        audio_data = {
            'id': audio.id,
            'createdAt': audio.createdAt,
            'audio': audio.audio,
            'isAnalysed': audio.isAnalysed,
            'transcription': audio.transcription,
            'sentiment': sentiment_data,
            'isInNeed': audio.isInNeed,
            'url': audio.url
        }
        return jsonify(audio_data), 200
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return f"An error occurred: {str(e)}", 500

@main.route('/process_audio/<int:audio_id>', methods=['POST'])
def process_audio(audio_id):
    try:
        audio = Audio.query.get(audio_id)
        if not audio:
            return jsonify({"error": "Audio not found"}), 404
        
        try:
            # Transcribe the audio
            transcription = transcribe_audio_from_url(audio.url)
            refined_transcription_data = refine_transcription(transcription)
            if "error" in refined_transcription_data:
                refined_transcription = refined_transcription_data["error"]
            else:
                refined_transcription = refined_transcription_data["transcription"]
        except Exception as transcribe_error:
            refined_transcription = f"Error during transcription refinement. Status code: 404"
            app.logger.error(f"Transcription error for audio {audio_id}: {str(transcribe_error)}")
            return jsonify({"error": refined_transcription}), 500

        # Store the refined transcription
        audio.transcription = refined_transcription

        try:
            # Analyze the sentiment
            sentiment_result = analyze_sentiment(audio.transcription)
            sentiment_label = Label[sentiment_result['label'].replace(' ', '_').upper()]
            
            # Create and save the sentiment record
            sentiment = Sentiments(
                label=sentiment_label,
                score=sentiment_result['score'],
                audio_id=audio_id
            )
            
            db.session.add(sentiment)

            if sentiment.label in [Label.NEGATIF, Label.TRES_NEGATIF]:
                audio.isInNeed = True
                send_sms(f"Alert: Negative sentiment detected for audio {audio_id}. Sentiment: {sentiment.label.name}")
            else:
                audio.isInNeed = False

            audio.isAnalysed = True
            db.session.commit()
            
            app.logger.info(f"Processing for audio {audio_id} completed")

            # Convert the sentiment result to a JSON-serializable format
            sentiment_data = {
                "label": sentiment.label.name,
                "score": sentiment.score
            }

            return jsonify({
                "message": "Processing completed",
                "transcription": refined_transcription,
                "sentiment": sentiment_data
            }), 200
        except Exception as sentiment_error:
            app.logger.error(f"Sentiment analysis error for audio {audio_id}: {str(sentiment_error)}")
            return jsonify({"error": f"Sentiment analysis error: {str(sentiment_error)}"}), 500
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
