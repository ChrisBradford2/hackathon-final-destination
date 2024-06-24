import speech_recognition as sr

def transcribe_audio(audio_file):
    recognizer = sr.Recognizer()
    audio = sr.AudioFile(audio_file)
    with audio as source:
        audio_data = recognizer.record(source)
    try:
        transcription = recognizer.recognize_google(audio_data, language="fr-FR")
    except sr.UnknownValueError:
        transcription = "Transcription non reconnue"
    except sr.RequestError:
        transcription = "Erreur de service"
    
    return transcription
