from flask import Flask, send_from_directory
from flask_cors import CORS
from .config import Config
from flask_caching import Cache
import os

cache = Cache()

def create_app():
    app = Flask(__name__, static_folder='../frontend/dist/static', template_folder='../frontend/dist')
    app.config.from_object(Config)

    # Initialize CORS
    CORS(app, origins=['http://localhost:5173'], supports_credentials=True)

    # Initialize caching
    cache.init_app(app, config={'CACHE_TYPE': 'simple'})

    # Register the blueprints
    from .music import music
    app.register_blueprint(music, url_prefix='/music')

    # Serve the React app
    @app.route('/')
    @app.route('/<path:path>')
    def serve_react_app(path=''):
        if path != '' and os.path.exists(os.path.join(app.template_folder, path)):
            return send_from_directory(app.template_folder, path)
        else:
            return send_from_directory(app.template_folder, 'index.html')

    return app