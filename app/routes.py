from flask import jsonify, Blueprint, send_from_directory, render_template, request
from models import Representative, PoliticalParty, PartyColor
from util import get_all_items, get_single_item
root_route = Blueprint('root', __name__)
rep_route = Blueprint('representative', __name__)
error_route = Blueprint('error', __name__)
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
    return get_all_items(Representative, Representative.bioguide, 'Representative')


@rep_route.route('/<bioguide>')
def representative(bioguide):
    return get_single_item(Representative, Representative.bioguide, bioguide)

@rep_route.route('/page/<num>')
def representatives_by_page(num):
	num = int(num)
	if num < 0:
		response = jsonify({"Error": "Data Not Found."})
		response.status_code = 404
		return response
	offset = num * 25
	return jsonify([getResponse(rep) for rep in Representative.query.order_by(Representative.bioguide).offset(offset).limit(25).all()])

@party_route.route("/")
def all_parties():
    #return jsonify([getResponse(party) for party in PoliticalParty.query.order_by(PoliticalParty.id).all()])
    return get_all_items(PoliticalParty, PoliticalParty.id, 'PoliticalParty')

@party_route.route("/<path>")
def party_by_path(path):
    #return jsonify(getResponse(PoliticalParty.query.filter(PoliticalParty.id == path).first()))
    return get_single_item(PoliticalParty, PoliticalParty.id, path)

@error_route.app_errorhandler(404)
def url_not_found(e):
    return send_from_directory('static/templates', '404.html')



