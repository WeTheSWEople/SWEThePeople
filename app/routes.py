from flask import jsonify, Blueprint
from models import Representative
rep_route = Blueprint('representative', __name__)


def getResponse(data):
	if data is None:
		return None
	else:
		return data.format()


@rep_route.route('/')
def representatives():
    return jsonify([getResponse(rep) for rep in Representative.query.limit(50).all()])

@rep_route.route('/<bioguide>')
def representative(bioguide):
    return jsonify(getResponse(Representative.query.filter(Representative.bioguide == bioguide).first()))
