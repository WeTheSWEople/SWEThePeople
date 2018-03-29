from flask import jsonify, Blueprint, send_from_directory, render_template, request
from models import Representative, PoliticalParty, PartyColor, District, State
from util import *
from sqlalchemy.orm import load_only, defer
root_route = Blueprint('root', __name__)
rep_route = Blueprint('representative', __name__)
error_route = Blueprint('error', __name__)
party_route = Blueprint('political_party', __name__)
state_route = Blueprint('state', __name__)
district_route = Blueprint('district', __name__)
search_route = Blueprint('search', __name__)

# def get_response(data):
#     if data is None:
#         return None
#     else:
#         return data.format()

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
		response = jsonify({"Error": "Item Not Found."})
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
    return get_single_item(PoliticalParty, PoliticalParty.path, path)

@party_route.route("/id/<party_id>")
def party_by_id(party_id):
    return get_single_item(PoliticalParty, PoliticalParty.id, party_id)
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
        return error("Item not found for id " + abbrev + " and " + id)
    return jsonify(get_response(data))

@search_route.route("/")
def search():
    search_query = request.args.get('query')
    print(search_query)
    reps_result = []
    parties_result = []
    districts_result = []

    # data = model.query.filter(model_id == parameter).first()
    # if not data:
    #     return error("Item not found for id " + parameter)
    # return jsonify(get_response(data))

#with_entities(PoliticalParty.chair, PoliticalParty.colors, PoliticalParty.formation_date, PoliticalParty.name, PoliticalParty.office, PoliticalParty.path).

    reps = Representative.query.search(search_query).all()
    if reps:
        for rep in reps:
            item = get_response(rep)
            del item['bills']
            reps_result.append(item)
        #reps_result += [del get_response(rep) ['bills'] for rep in reps]
        # add the corresponding party stuff
        for rep in reps:
            print(rep.party_id)
            party = PoliticalParty.query.with_entities(PoliticalParty.id, PoliticalParty.name, \
                    PoliticalParty.chair, \
                    PoliticalParty.formation_date, \
                    PoliticalParty.office, \
                    PoliticalParty.path)\
                    .filter(PoliticalParty.id == rep.party_id).first()
            party_json = {
                "id": party.id,
                "name": party.name,
                "path": party.path,
                "chair": party.chair,
                "formation_date": party.formation_date,
                "office": party.office,
                "path": party.path
            }  

            if party_json not in parties_result:
                parties_result.append(party_json)

            district = District.query.filter(District.representative_id == rep.bioguide).first()
            district_json = {
                "alpha_num": district.alpha_num,
                "id": district.id,
                "representative_id": district.representative_id,
                "state": district.state
            }            
            if district_json not in districts_result:
                districts_result.append(district_json)        

        # add the corresponding district stuff


    parties = PoliticalParty.query.search(search_query).all()
    if parties:
        for party in parties:
            item = get_response(party)
            del item['representatives']
            del item['colors']
            del item['twitter_handle']
            del item['website']
            del item['youtube']
            parties_result.append(item)

        for party in parties:
            reps = Representative.query.filter(party.id == Representative.party_id).all()
            for rep in reps:
                rep_json = get_response(rep)
                del rep_json['bills']
                if rep_json not in reps_result:
                    reps_result.append(rep_json)

                district = District.query.filter(District.representative_id == rep.bioguide).first()
                district_json = {
                    "alpha_num": district.alpha_num,
                    "id": district.id,
                    "representative_id": district.representative_id,
                    "state": district.state
                }            
                if district_json not in districts_result:
                    districts_result.append(district_json) 

                   
    districts = District.query.search(search_query).all()
    if districts:
        for district in districts:
            district_json = {
                "alpha_num": district.alpha_num,
                "id": district.id,
                "representative_id": district.representative_id,
                "state": district.state
            }       
            districts_result.append(district_json)

        for district in districts:
            rep = Representative.query.filter(district.representative_id == Representative.bioguide).first()
            if rep:
                rep_json = get_response(rep)
                del rep_json['bills']
                if rep_json not in reps_result:
                    reps_result.append(rep_json)


                party = PoliticalParty.query.with_entities(PoliticalParty.id, PoliticalParty.name, \
                        PoliticalParty.chair, \
                        PoliticalParty.formation_date, \
                        PoliticalParty.office, \
                        PoliticalParty.path)\
                        .filter(PoliticalParty.id == rep.party_id).first()

                        
                if party:
                    party_json = {
                        "id": party.id,
                        "name": party.name,
                        "path": party.path,
                        "chair": party.chair,
                        "formation_date": party.formation_date,
                        "office": party.office,
                        "path": party.path
                    }  

                    if party_json not in parties_result:
                        parties_result.append(party_json)

    states = State.query.search(search_query).all()
    if states:
        for state in states:
            districts = District.query.filter(District.state == state.usps_abbreviation).all()
            if districts:
                for district in districts:
                    district_json = {
                        "alpha_num": district.alpha_num,
                        "id": district.id,
                        "representative_id": district.representative_id,
                        "state": district.state
                    }       
                    districts_result.append(district_json)

                    rep = Representative.query.filter(district.representative_id == Representative.bioguide).first()
                    if rep:
                        rep_json = get_response(rep)
                        del rep_json['bills']
                        if rep_json not in reps_result:
                            reps_result.append(rep_json)


                        party = PoliticalParty.query.with_entities(PoliticalParty.id, PoliticalParty.name, \
                                PoliticalParty.chair, \
                                PoliticalParty.formation_date, \
                                PoliticalParty.office, \
                                PoliticalParty.path)\
                                .filter(PoliticalParty.id == rep.party_id).first()

                                
                        if party:
                            party_json = {
                                "id": party.id,
                                "name": party.name,
                                "path": party.path,
                                "chair": party.chair,
                                "formation_date": party.formation_date,
                                "office": party.office,
                                "path": party.path
                            }  

                            if party_json not in parties_result:
                                parties_result.append(party_json)

    return jsonify({
        "reps": reps_result,
        "parties": parties_result,
        "districts": districts_result
    })
    # parties = 
    # districts = 




@error_route.app_errorhandler(404)
def url_not_found(e):
    return send_from_directory('static/templates', '404.html')
