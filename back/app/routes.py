from .send_sms import send_sms
from .models.Audio import Audio
from .models.Label import Label
from .models.Sentiments import Sentiments
from flask import Blueprint, request, jsonify, current_app
from .transcription import transcribe_audio, transcribe_audio_from_url
from .sentiment_analysis import analyze_sentiment, refine_transcription, fixError_transcription
from .upload_file import upload_file
from . import db, socketio

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return "Hello World!"

@main.route('/upload_audio', methods=['POST'])
def upload_audio():
    try:
        if 'file' not in request.files:
            current_app.logger.error("No file part in the request")
            return "No file part in the request", 400

        file = request.files['file']
        if file.filename == '':
            current_app.logger.error("No file selected for uploading")
            return "No file selected for uploading", 400

        bucket_name = 'hackathon-final-destination'
        s3_file_name = file.filename

        if upload_file(file, bucket_name, s3_file_name):
            current_app.logger.info(f"File {s3_file_name} successfully uploaded to {bucket_name}")
            return "File successfully uploaded", 200
        else:
            current_app.logger.error(f"File upload failed for {s3_file_name}")
            return "File upload failed", 500
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
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
                'raw_transcription': audio.raw_transcription,
                'sentiment': sentiment_data,
                'isInNeed': audio.isInNeed,
                'url': audio.url
            }
            audio_list.append(audio_data)
        return jsonify(audio_list), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
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
            'raw_transcription': audio.raw_transcription,
            'sentiment': sentiment_data,
            'isInNeed': audio.isInNeed,
            'url': audio.url
        }
        return jsonify(audio_data), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return f"An error occurred: {str(e)}", 500

@main.route('/audios/<int:audio_id>', methods=['DELETE'])
def delete_audio(audio_id):
    try:
        audio = Audio.query.get(audio_id)
        if not audio:
            return "Audio not found", 404

        db.session.delete(audio)
        db.session.commit()

        return "Audio deleted", 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return f"An error occurred: {str(e)}", 500

@main.route('/process_audio/<int:audio_id>', methods=['POST'])
def process_audio(audio_id):
    try:
        audio = Audio.query.get(audio_id)
        if not audio:
            return jsonify({"error": "Audio not found"}), 404
        try:
            socketio.emit('processing_update', {'audio_id': audio_id, 'status': 'Transcription en cours'})
            transcription = transcribe_audio_from_url(audio.url)
            current_app.logger.info(f"Raw transcription for audio {audio_id}: {transcription}")

            socketio.emit('processing_update', {'audio_id': audio_id, 'status': 'Transcription complété, raffinement en cours'})

            raw_transcription = fixError_transcription(transcription)
            current_app.logger.info(f"Fixed transcription for audio {audio_id}: {raw_transcription}")

            socketio.emit('processing_update', {'audio_id': audio_id, 'status': 'Transcription fixée, résumé en cours'})

            refined_transcription_data = refine_transcription(raw_transcription)
            current_app.logger.info(f"Refined transcription data for audio {audio_id}: {refined_transcription_data}")

            if isinstance(refined_transcription_data, dict):
                if "error" in refined_transcription_data:
                    refined_transcription = refined_transcription_data["error"]
                elif "transcription" in refined_transcription_data:
                    refined_transcription = refined_transcription_data["transcription"]
                else:
                    refined_transcription = "Error during transcription refinement. Status code: 404"
            else:
                refined_transcription = refined_transcription_data

            current_app.logger.info(f"Refined transcription for audio {audio_id}: {refined_transcription}")

            socketio.emit('processing_update', {'audio_id': audio_id, 'status': 'Transcription raffinée, analyse de sentiment en cours'})

        except Exception as transcribe_error:
            refined_transcription = "Error during transcription refinement. Status code: 404"
            current_app.logger.error(f"Transcription error for audio {audio_id}: {str(transcribe_error)}")
            socketio.emit('processing_update', {'audio_id': audio_id, 'status': f'Transcription error: {str(transcribe_error)}'})
            return jsonify({"error": refined_transcription}), 500

        audio.transcription = refined_transcription
        audio.raw_transcription = raw_transcription

        try:
            sentiment_result = analyze_sentiment(transcription)
            sentiment_label_str = sentiment_result['label']
            sentiment_score = sentiment_result['score']

            current_app.logger.info(f"Sentiment label: {sentiment_label_str}, Score: {sentiment_score}")

            try:
                sentiment_label_map = {
                    "Très négatif": Label.TRES_NEGATIF,
                    "Négatif": Label.NEGATIF,
                    "Neutre": Label.NEUTRE,
                    "Positif": Label.POSITIF,
                    "Très positif": Label.TRES_POSITIF
                }
                sentiment_label = sentiment_label_map.get(sentiment_label_str)
                if sentiment_label is None:
                    raise KeyError

            except KeyError:
                current_app.logger.error(f"Sentiment label '{sentiment_label_str}' not found in Label enum")
                socketio.emit('processing_update', {'audio_id': audio_id, 'status': f'Invalid sentiment label: {sentiment_label_str}'})
                return jsonify({"error": f"Invalid sentiment label: {sentiment_label_str}"}), 500

            sentiment = Sentiments(
                label=sentiment_label,
                score=sentiment_score,
                audio_id=audio.id
            )

            db.session.add(sentiment)

            if sentiment.label in [Label.NEGATIF, Label.TRES_NEGATIF]:
                audio.isInNeed = True
                send_sms(f"Alerte: Analyse de sentiment négative pour l'audio {audio.id}, résultat {sentiment_label_str}")
            else:
                audio.isInNeed = False

            audio.isAnalysed = True
            db.session.commit()

            socketio.emit('processing_update', {'audio_id': audio_id, 'status': 'Processing completed'})

            current_app.logger.info(f"Processing for audio {audio_id} completed")

            sentiment_data = {
                "label": sentiment.label.value,
                "score": sentiment.score
            }

            return jsonify({
                "message": "Processing completed",
                "transcription": refined_transcription,
                "raw_transcription": raw_transcription,
                "sentiment": sentiment_data
            }), 200
        except Exception as sentiment_error:
            current_app.logger.error(f"Sentiment analysis error for audio {audio_id}: {str(sentiment_error)}")
            socketio.emit('processing_update', {'audio_id': audio_id, 'status': f'Sentiment analysis error: {str(sentiment_error)}'})
            return jsonify({"error": f"Sentiment analysis error: {str(sentiment_error)}"}), 500
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        socketio.emit('processing_update', {'audio_id': audio_id, 'status': f'Error: {str(e)}'})
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
