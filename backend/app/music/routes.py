from . import music
from flask import jsonify, request
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import requests
from app.config import Config


 # Spotify setup
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id=Config.SPOTIFY_CLIENT_ID,
    client_secret=Config.SPOTIFY_CLIENT_SECRET
))

@music.route('/recommendations', methods=['GET'])
def get_recommendations():
    artist_name = request.args.get('artist', 'Adele')  # Default to 'Adele' if no artist is provided

    # Get artist ID
    results = sp.search(q=artist_name, type='artist')
    if not results['artists']['items']:
        return jsonify({'artists': []})  # Return empty list if no artist found
    artist_id = results['artists']['items'][0]['id']

    # Get similar artists from Spotify
    similar_artists_spotify = sp.artist_related_artists(artist_id)
    spotify_artists = [artist['name'] for artist in similar_artists_spotify['artists'][:15]]

    # Get similar artists from Last.fm
    lastfm_url = f"http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist={artist_name}&api_key={Config.LASTFM_API_KEY}&format=json&limit=15"
    response = requests.get(lastfm_url)
    similar_artists_lastfm = response.json()['similarartists']['artist']
    lastfm_artists = [artist['name'] for artist in similar_artists_lastfm]

    # Combine results and remove duplicates
    combined_artists = list(set(spotify_artists + lastfm_artists))

    # Create final recommendation object
    recommendations = {
        'artists': combined_artists
    }

    return jsonify(recommendations)

@music.route('/artist-info', methods=['GET'])
def get_artist_info():
    artist_name = request.args.get('artist', 'Adele')  # Default to 'Adele' if no artist is provided


    # Get artist ID from Spotify
    results = sp.search(q=artist_name, type='artist')
    if not results['artists']['items']:
        return jsonify({'error': 'Artist not found'}), 404
    artist = results['artists']['items'][0]
    artist_id = artist['id']

    # Get top tracks from Spotify
    top_tracks = sp.artist_top_tracks(artist_id)['tracks'][:5]
    top_tracks_info = [{'name': track['name'], 'preview_url': track.get('preview_url')} for track in top_tracks]

    # Combine results
    artist_info = {
        'name': artist['name'],
        'bio': f"Genres: {', '.join(artist['genres'])}. Popularity: {artist['popularity']}",
        'image_url': artist['images'][0]['url'] if artist['images'] else '',
        'top_tracks': top_tracks_info,
        'social_media': artist['external_urls'].get('spotify', '')
    }

    return jsonify(artist_info)


# enables a dropdown search bar for the user to search for artists
@music.route('/artist-suggestions', methods=['GET'])
def get_artist_suggestions():
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    # Search for artists on Spotify
    results = sp.search(q=query, type='artist', limit=5)
    suggestions = [{'name': artist['name']} for artist in results['artists']['items']]

    return jsonify({'suggestions': suggestions})

@music.route('/similar-songs', methods=['GET'])
def get_song_recommendations():
    song_name = request.args.get('song')
    if not song_name:
        return jsonify({'error': 'Song name is required'}), 400

    # Get song ID from Spotify
    results = sp.search(q=song_name, type='track')
    if not results['tracks']['items']:
        return jsonify({'error': 'Song not found'}), 404
    song = results['tracks']['items'][0]
    song_id = song['id']
    song_genres = sp.artist(song['artists'][0]['id'])['genres']

    # Get song details
    song_details = {
        'name': song['name'],
        'artist': song['artists'][0]['name'],
        'album': song['album']['name'],
        'release_date': song['album']['release_date'],
        'duration_ms': song['duration_ms'],
        'preview_url': song.get('preview_url')
    }

    # Get recommendations from Spotify
    spotify_recommendations = sp.recommendations(seed_tracks=[song_id], seed_genres=song_genres, limit=20)['tracks']
    spotify_songs = [{'name': track['name'], 'artist': track['artists'][0]['name'], 'preview_url': track.get('preview_url')} for track in spotify_recommendations]

    # Get recommendations from Last.fm
    last_fm_api_key = Config.LASTFM_API_KEY
    last_fm_url = f'http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&track={song_name}&api_key={last_fm_api_key }&format=json'
    last_fm_response = requests.get(last_fm_url)
    last_fm_data = last_fm_response.json()
    last_fm_songs = [{'name': track['name'], 'artist': track['artist']['name'], 'preview_url': None} for track in last_fm_data.get('similartracks', {}).get('track', [])]

    # Combine results and remove duplicates using set
    unique_songs_set = set()
    unique_songs = []

    for song in spotify_songs + last_fm_songs:
        song_identifier = f"{song['name']} - {song['artist']}"
        if song_identifier not in unique_songs_set:
            unique_songs_set.add(song_identifier)
            unique_songs.append(song)

    # Create final recommendation object
    song_recommendations = {
        'song_details': song_details,
        'similar_songs': unique_songs
    }

    return jsonify(song_recommendations)


# show song recommendations based on the user's input
@music.route('/song-suggestions', methods=['GET'])
def get_song_suggestions():
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    # Search for the song on Spotify
    results = sp.search(q=query, type='track', limit=1)
    if not results['tracks']['items']:
        return jsonify({'error': 'Song not found'}), 404
    song = results['tracks']['items'][0]
    song_id = song['id']
    song_genres = sp.artist(song['artists'][0]['id'])['genres']

    # Get recommendations from Spotify
    spotify_recommendations = sp.recommendations(seed_tracks=[song_id], seed_genres=song_genres, limit=10)['tracks']
    recommendations = [{'name': track['name'], 'artist': track['artists'][0]['name']} for track in spotify_recommendations]

    return jsonify({'recommendations': recommendations})