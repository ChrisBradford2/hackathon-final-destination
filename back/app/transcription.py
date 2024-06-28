import tempfile
import os
from io import BytesIO
import requests
from app.whisperModel import stt_model

def transcribe_audio(audio_file):
    if stt_model is None:
        raise ValueError("Whisper model is not initialized. Check model loading.")

    # Save the audio file to a temporary file
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
        temp_audio.write(audio_file.read())
        temp_audio_path = temp_audio.name

    try:
        # Ensure the audio file is in the correct format for transcription
        result = stt_model.transcribe(temp_audio_path, language="fr", fp16=False)
        transcription = result["text"]
    except Exception as e:
        raise ValueError(f"Error during transcription: {str(e)}")
    finally:
        # Remove the temporary audio file
        os.remove(temp_audio_path)

    return transcription

def download_audio(url):
    response = requests.get(url)
    response.raise_for_status()
    return BytesIO(response.content)

def transcribe_audio_from_url(url):
    if stt_model is None:
        raise ValueError("Whisper model is not initialized. Check model loading.")
    audio_data = download_audio(url)

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
        temp_audio.write(audio_data.read())
        temp_audio_path = temp_audio.name

    try:
        # Ensure the audio file is in the correct format for transcription
        result = stt_model.transcribe(temp_audio_path, language="fr", fp16=False)
        transcription = result["text"]
    except Exception as e:
        raise ValueError(f"Error during transcription: {str(e)}")
    finally:
        # Remove the temporary audio file
        os.remove(temp_audio_path)

    return transcription
