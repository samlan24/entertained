import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
    SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
    YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
    LASTFM_API_KEY = os.getenv('LASTFM_API_KEY')
    MUSIXMATCH_API_KEY = os.getenv('MUSIXMATCH_API_KEY')
