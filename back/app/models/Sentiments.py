from .Label import Label
from app import db

class Sentiments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.Enum(Label), nullable=False)
    score = db.Column(db.Float, nullable=False)
    
    # Clé étrangère reliant à Audio
    audio_id = db.Column(db.Integer, db.ForeignKey('audio.id'), nullable=False)
