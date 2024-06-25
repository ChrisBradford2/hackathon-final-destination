from app import db
from datetime import datetime

class Audio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    createdAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    audio = db.Column(db.String(120), nullable=False)
    isAnalysed = db.Column(db.Boolean, default=False)
    transcription = db.Column(db.String, nullable=True)
    isInNeed = db.Column(db.Boolean, default=False)
    
    # Champs supplémentaires pour le téléchargement
    filename = db.Column(db.String(255), nullable=False)
    bucket_name = db.Column(db.String(255), nullable=False)
    s3_key = db.Column(db.String(255), nullable=False)
    
    # Relation One-to-One
    sentiment = db.relationship('Sentiments', backref='audio', uselist=False)

    # Clé étrangère vers FileUpload
    file_upload_id = db.Column(db.Integer, db.ForeignKey('file_upload.id'), nullable=False)
    file_upload = db.relationship('FileUpload', back_populates='audios')
