from flask_socketio import SocketIO
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from instance.config import Config
from dotenv import load_dotenv
import app.whisperModel as whisperModel

db = SQLAlchemy()
socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)  # Enable all origins
    db.init_app(app)
    migrate = Migrate(app, db)  # Initialize Migrate after the app creation

    # Log configuration
    if not app.debug:
        handler = logging.StreamHandler()
        handler.setLevel(logging.INFO)
        app.logger.addHandler(handler)

    with app.app_context():
        whisperModel.init_whisper()
        from .models import Audio, FileUpload, Sentiments  # Import models
        from .routes import main  # Import Blueprint
        app.register_blueprint(main)  # Register Blueprint
        db.create_all()

    load_dotenv()

    socketio.init_app(app, cors_allowed_origins="*")  # Initialize SocketIO after app creation

    return app
