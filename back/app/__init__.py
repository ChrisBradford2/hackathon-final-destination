from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)  # Enable all origins
    app.config.from_object('instance.config.Config')
    app.config.from_pyfile('config.py', silent=True)

    db.init_app(app)

    with app.app_context():
        from . import routes
        db.create_all()

    return app
