from flask import jsonify, Blueprint
from models import Representative
rep_route = Blueprint('representative', __name__)

@rep_route.route('/')
def index():
    return jsonify([rep.format() for rep in Representative.query.limit(50).all()])