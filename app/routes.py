from flask import jsonify, Blueprint, send_from_directory
from models import Representative
root_route = Blueprint('root', __name__)
rep_route = Blueprint('representative', __name__)




def getResponse(data):
	if data is None:
		return None
	else:
		return data.format()


@root_route.route('/')
def endpoints():
	return send_from_directory('static', 'index.html')

@rep_route.route('/')
def representatives():
    return jsonify([getResponse(rep) for rep in Representative.query.limit(50).all()])

@rep_route.route('/<bioguide>')
def representative(bioguide):
    return jsonify(getResponse(Representative.query.filter(Representative.bioguide == bioguide).first()))
