from flask import Blueprint

movies = Blueprint('movies', __name__)

from . import routes