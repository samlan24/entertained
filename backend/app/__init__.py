from flask import Flask
from flask_cors import CORS
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize CORS
    CORS(app, origins=['http://localhost:5173'], supports_credentials=True)




    # Register the blueprints


    from app.movies import movies
    app.register_blueprint(movies, url_prefix='/movies')

    @app.route('/')
    def hello():
        return 'Hello, World!'

    return app
