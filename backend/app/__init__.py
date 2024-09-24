from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173/'], supports_credentials=True)

@app.route('/')
def hello():
    return 'Hello, World!'

