from . import movies

@movies.route('/', methods=['GET'])
def get_movies():
    return "hello movies"