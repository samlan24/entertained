from . import movies

@movies.route('/movies', methods=['GET'])
def get_movies():
    return "hello movies"