from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.note_routes import note_bp
from db import get_db, close_db
from config import Config
from routes.ai_routes import ai_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ Correct CORS setup for React frontend
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    app.teardown_appcontext(close_db)
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(note_bp, url_prefix='/api/notes')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=8080)
