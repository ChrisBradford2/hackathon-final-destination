from datetime import datetime
from app import db

class FileUpload(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    bucket_name = db.Column(db.String(255), nullable=False)
    s3_key = db.Column(db.String(255), nullable=False)
    uploaded_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Relation One-to-Many
    audios = db.relationship('Audio', back_populates='file_upload')

    def __repr__(self):
        return f"<FileUpload {self.filename} to {self.bucket_name}/{self.s3_key}>"
