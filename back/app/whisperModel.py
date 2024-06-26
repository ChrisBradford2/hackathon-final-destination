# models.py
import whisper 
stt_model = None

def init_whisper():
    global stt_model
    stt_model = whisper.load_model("base")


