from . import music

@music.route('/music', methods=['GET'])
def get_music():
    return "hello music"