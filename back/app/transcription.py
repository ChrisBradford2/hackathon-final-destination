import whisper
import tempfile
import os
from io import BytesIO
import requests

def transcribe_audio(audio_file):
    model = whisper.load_model("base")

    # Créer un fichier temporaire pour le fichier audio
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
        temp_audio.write(audio_file.read())
        temp_audio_path = temp_audio.name

    # Transcrire l'audio
    result = model.transcribe(temp_audio_path, language="french")
    transcription = result["text"]

    # Supprimer le fichier temporaire
    os.remove(temp_audio_path)
    
    return transcription

def download_audio(url):
    response = requests.get(url)
    response.raise_for_status()
    return BytesIO(response.content)

def transcribe_audio_from_url(url):
    audio_data = download_audio(url)

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
        temp_audio.write(audio_data.read())
        temp_audio_path = temp_audio.name

    model = whisper.load_model("base")
    result = model.transcribe(temp_audio_path, language="french")
    transcription = result["text"]

    os.remove(temp_audio_path)

    return transcription