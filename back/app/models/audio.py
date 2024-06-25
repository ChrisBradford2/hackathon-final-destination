from flask_sqlalchemy import SQLAlchemy
from flask import current_app as app
db = SQLAlchemy(app)

class audios(db.Model):
    id = db.Column('audio_id', db.Integer, primary_key = True)
    audioLink = db.Column(db.String(100))
    isAnalysed = db.Column(db.Boolean)  
    isInNeed = db.Column(db.Boolean)
    transcription = db.Column(db.Text(4294000000))

def __init__(self, audioLink):
    self.audioLink = audioLink
    self.isAnalysed = False
    self.isInNeed = False