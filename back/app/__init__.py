import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from instance.config import Config
from dotenv import load_dotenv
import app.whisperModel as whisperModel

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)  # Enable all origins
    db.init_app(app)
    migrate = Migrate(app, db)  # Initialisation de Migrate après la création de l'app

    # Configuration des logs
    if not app.debug:
        handler = logging.StreamHandler()
        handler.setLevel(logging.INFO)
        app.logger.addHandler(handler)

    with app.app_context():
        whisperModel.init_whisper()
        from .models import Audio, FileUpload, Sentiments  # Importer les modèles
        from .routes import main  # Import du Blueprint
        app.register_blueprint(main)  # Enregistrer le Blueprint
        db.create_all()

    load_dotenv()


    return app
