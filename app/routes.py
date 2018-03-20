from flask import jsonify, Blueprint, send_from_directory, render_template, request
from models import Representative, PoliticalParty, PartyColor, District, State
from util import get_all_items, get_single_item
root_route = Blueprint('root', __name__)
rep_route = Blueprint('representative', __name__)
error_route = Blueprint('error', __name__)
party_route = Blueprint('political_party', __name__)
state_route = Blueprint('state', __name__)
district_route = Blueprint('district', __name__)

def get_response(data):
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
	return jsonify([get_response(rep) for rep in Representative.query.order_by(Representative.bioguide).offset(offset).limit(25).all()])

@party_route.route("/")
def all_parties():
    #return jsonify([get_response(party) for party in PoliticalParty.query.order_by(PoliticalParty.id).all()])
    party_name = request.args.get('party_name')
    if party_name == 'True':
    	return jsonify({party.id : [party.name, party.path] for party in PoliticalParty.query.with_entities(PoliticalParty.id, PoliticalParty.name, PoliticalParty.path).order_by(PoliticalParty.id).all()})
    return get_all_items(PoliticalParty, PoliticalParty.id, 'PoliticalParty')

@party_route.route("/<path>")
def party_by_path(path):
    #return jsonify(get_response(PoliticalParty.query.filter(PoliticalParty.id == path).first()))
    return get_single_item(PoliticalParty, PoliticalParty.id, path)

@state_route.route("/")
def all_states():
    return get_all_items(State, State.number, 'State')


@state_route.route("/<abbrev>")
def single_state(abbrev):
    return get_single_item(State, State.usps_abbreviation, abbrev)


@district_route.route("/")
def all_districts():
    return get_all_items(District, District.alpha_num, 'District')

@district_route.route("/<abbrev>")
def districts_by_state(abbrev):
    district_list = District.query.filter(District.state == abbrev).all()
    if not district_list:
        return error("Item not found for id " + abbrev)
    return jsonify([get_response(district) for district in district_list])

@district_route.route("/<abbrev>/<id>")
def districts_by_id(abbrev, id):
    #return get_single_item(District, District.state, abbrev)
    data = District.query.filter(District.state == abbrev).filter(District.id == id).first()
    if not data:
        return error("Item not found for id " + abbrev + " and" + id)
    return jsonify(get_response(data))

@error_route.app_errorhandler(404)
def url_not_found(e):
    return send_from_directory('static/templates', '404.html')



