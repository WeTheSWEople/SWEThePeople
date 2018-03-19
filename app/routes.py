from flask import jsonify, Blueprint, send_from_directory
from models import Representative
from models import PoliticalParty
from models import PartyColor
root_route = Blueprint('root', __name__)
rep_route = Blueprint('representative', __name__)
party_route = Blueprint('political_party', __name__)

def getResponse(data):
    if data is None:
        return None
    else:
        return data.format()


@root_route.route('/')
def endpoints():
	return send_from_directory('static', 'index.html')

@rep_route.route('/')
def all_representatives():
    return jsonify([getResponse(rep) for rep in Representative.query.order_by(Representative.bioguide).limit(500).all()])


@rep_route.route('/<bioguide>')
def representative(bioguide):
    return jsonify(getResponse(Representative.query.filter(Representative.bioguide == bioguide).first()))

@rep_route.route('/page/<num>')
def representatives_by_page(num):
	num = int(num)
	if num < 0:
		return jsonify("Invalid Page Number")
	offset = num * 25
	return jsonify([getResponse(rep) for rep in Representative.query.order_by(Representative.bioguide).offset(offset).limit(25).all()])  
