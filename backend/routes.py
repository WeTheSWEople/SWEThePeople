from flask import jsonify, Blueprint, send_from_directory, render_template, request
from models import Representative, PoliticalParty, PartyColor, District, State
from util import *
import json
from sqlalchemy.orm import load_only, defer
from sqlalchemy import or_
root_route = Blueprint('root', __name__)
rep_route = Blueprint('representative', __name__)
error_route = Blueprint('error', __name__)
party_route = Blueprint('political_party', __name__)
state_route = Blueprint('state', __name__)
district_route = Blueprint('district', __name__)
search_route = Blueprint('search', __name__)


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

@rep_route.route("/filter")
def representatives_filter():
    filter_query = request.args.get('filter')
    filter_query = str(filter_query)
    filter_query = json.loads(filter_query)

    state = str(filter_query['state']) # check state is None
    party_id = filter_query['party_id'] # check party id is None
    last_name = str(filter_query['last_name']).lower().split('-')
    votes_pct = str(filter_query['votes_pct']).split('-') # votes pct is none
    order_by = str(filter_query['order_by'])
   
    filtered_result = Representative.query
    if state != 'None':
        filtered_result = filtered_result.filter(Representative.state == state)

    if party_id != 'None':
        filtered_result = filtered_result.filter(Representative.party_id == int(party_id))


    if votes_pct[0] != 'None':
        filtered_result = filtered_result.filter(Representative.votes_with_party_pct >= float(votes_pct[0]), 
                                Representative.votes_with_party_pct < float(votes_pct[1]))

    if (order_by == 'last_asc'):
        filtered_result = filtered_result.order_by(Representative.lastname.asc())

    elif (order_by == 'last_desc'):
        filtered_result = filtered_result.order_by(Representative.lastname.desc())

    elif (order_by == 'votes_pct_asc'):
        filtered_result = filtered_result.order_by(Representative.votes_with_party_pct.asc())
    else:
        filtered_result = filtered_result.order_by(Representative.votes_with_party_pct.desc())

    filtered_result = filtered_result.all()
    filtered_dict_list = [get_response(rep) for rep in filtered_result]
    return jsonify(filter(lambda s: s['lastname'][0].lower() >= last_name[0] and s['lastname'][0].lower() <= last_name[1], filtered_dict_list))

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
    #return get_single_item(PoliticalParty, PoliticalParty.id, path)

@party_route.route("/filter")
def party_filter():
    filter_query = request.args.get('filter')
    filter_query = str(filter_query)
    filter_query = json.loads(filter_query)

    #ideology = str(filter_query['ideology'])
    social = str(filter_query['social'])
    color = str(filter_query['color'])
    formation_date = filter_query['date'].split("-")
    name = str(filter_query['name']).lower().split('-') # Default: A-Z
    order_by = str(filter_query['order_by'])

    filtered_result = PoliticalParty.query
    if social != 'None':
        if social == 'YT':
            filtered_result = filtered_result.filter(PoliticalParty.youtube != '', PoliticalParty.twitter_handle != '')

        elif social == 'T':
            filtered_result = filtered_result.filter(PoliticalParty.twitter_handle != '')

        elif social == 'Y':
            filtered_result = filtered_result.filter(PoliticalParty.youtube != '')

        else: # neither
            filtered_result = filtered_result.filter(PoliticalParty.youtube == '', PoliticalParty.twitter_handle == '')

    if color != 'None':
        color = color.title()
        filtered_result = filtered_result.join(PartyColor).filter(PartyColor.color == color)


    if (order_by == 'name_asc'):
        filtered_result = filtered_result.order_by(PoliticalParty.name.asc())
    elif (order_by == 'name_desc'):
        filtered_result = filtered_result.order_by(PoliticalParty.name.desc())
    elif (order_by == 'chair_name_asc'):
        filtered_result = filtered_result.order_by(PoliticalParty.chair.asc())
    elif (order_by == 'chair_name_desc'):
        filtered_result = filtered_result.order_by(PoliticalParty.chair.desc())
    else:
        filtered_result = filtered_result.order_by(PoliticalParty.id)

    filtered_result = filtered_result.all()
    filtered_dict_list = [get_response(party) for party in filtered_result]
    for item in filtered_dict_list:
        for rep in item['representatives']:
            del rep['bills']

    if formation_date[0] != 'None':
        date_filtered_dict = filter(lambda s: int(s['formation_date'].split(" ")[-1]) >= int(formation_date[0]) and int(s['formation_date'].split(" ")[-1]) <= int(formation_date[1]), filtered_dict_list)
        return jsonify(filter(lambda s: s['name'][0].lower() >= name[0] and s['name'][0].lower() <= name[1], date_filtered_dict))
    return jsonify(filter(lambda s: s['name'][0].lower() >= name[0] and s['name'][0].lower() <= name[1], filtered_dict_list))



@state_route.route("/")
def all_states():
    state_usps = request.args.get('state_usps')
    if state_usps == 'True':
        return jsonify({state.usps_abbreviation :state.name for state in State.query.with_entities(State.number, State.usps_abbreviation, State.name).all()})
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

@district_route.route("/filter")
def districts_filter():
    filter_query = request.args.get('filter')
    filter_query = str(filter_query)
    filter_query = json.loads(filter_query)

    state = str(filter_query['state'])
    population = str(filter_query['population']).split('-')
    median_age = str(filter_query['median_age']).split('-')
    order_by = str(filter_query['order_by'])

    # order by state, alpha num, population  
    filtered_result = District.query
    if state != 'None':
        filtered_result = filtered_result.filter(District.state == state)

    if population[0] != 'None':
        filtered_result = filtered_result.filter(District.population >= int(population[0]), 
                                District.population < int(population[1]))

    if median_age[0] != 'None':
       filtered_result = filtered_result.filter(District.median_age >= float(median_age[0]), 
                                District.median_age < float(median_age[1]))
    if (order_by == 'state_asc'):
        filtered_result = filtered_result.order_by(District.alpha_num.asc())
    elif (order_by == 'state_desc'):
        filtered_result = filtered_result.order_by(District.alpha_num.desc())
    elif (order_by == 'population_desc'):
        filtered_result = filtered_result.order_by(District.population.desc())
    else:
        filtered_result = filtered_result.order_by(District.population.asc())
    filtered_result = filtered_result.all()
    filtered_dict_list = [get_response(rep) for rep in filtered_result]
    return jsonify(filtered_dict_list)

def get_party_json(rep_party_id = None, party_param = None):
    party_json = None

    if rep_party_id:
        party = PoliticalParty.query.with_entities(PoliticalParty.id, PoliticalParty.name, \
                        PoliticalParty.chair, \
                        PoliticalParty.formation_date, \
                        PoliticalParty.office, \
                        PoliticalParty.path)\
                        .filter(PoliticalParty.id == rep_party_id).first()
    else:
        party = party_param

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
    return party_json


def get_district_json(rep_bioguide = None, district_param = None, state_param = None):
    district_json = None
    if rep_bioguide:
        district = District.query.filter(District.representative_id == rep_bioguide).first()
        state = State.query.with_entities(State.name, State.usps_abbreviation).filter(State.usps_abbreviation == district.state).first()
    elif district_param and not state_param:
        district = district_param
        state = State.query.with_entities(State.name, State.usps_abbreviation).filter(State.usps_abbreviation == district.state).first()
    else:
        district = district_param
        state = state_param

    if district and state:
        district_json = {
            "alpha_num": district.alpha_num,
            "id": district.id,
            "representative_id": district.representative_id,
            "population": district.population,
            "median_age": district.median_age,
            "state": district.state,
            "state_full": state.name
        }     
    return district_json


def get_brief_search_results(search_query, reps_result, parties_result, districts_result):
    rank = 0
    reps = Representative.query.filter(or_(
        Representative.firstname.like(search_query),
        Representative.lastname.like(search_query),
        Representative.state.like(search_query),
        Representative.district.like(search_query),
        Representative.twitter.like(search_query),
        Representative.youtube.like(search_query)
    )).all()
    if reps:
        rank = 1
        for rep in reps:
            item = get_response(rep)
            del item['bills']
            if item is not None and item not in reps_result:
                reps_result.append(item)

    parties = PoliticalParty.query.filter(or_(
        PoliticalParty.name.like(search_query),
        PoliticalParty.path.like(search_query),
        PoliticalParty.chair.like(search_query),
        PoliticalParty.formation_date.like(search_query),
        PoliticalParty.twitter_handle.like(search_query),
        PoliticalParty.youtube.like(search_query)
    )).all()
    if parties:
        rank = 2
        for party in parties:
            party_json = get_party_json(party_param = party)
            if party_json is not None and party_json not in parties_result:
                parties_result.append(party_json)
                   
    districts = District.query.filter(or_(
        District.alpha_num.like(search_query)
    )).all()
    if districts:
        rank = 3
        for district in districts:
            district_json = get_district_json(district_param=district)
            if district_json is not None and district_json not in districts_result:
                districts_result.append(district_json)

    states = State.query.filter(or_(
        State.usps_abbreviation.like(search_query),
        State.name.like(search_query)
    )).all()
    if states:
        rank = 3
        for state in states:
            districts = District.query.filter(District.state == state.usps_abbreviation).all()
            if districts:
                for district in districts:
                    district_json = get_district_json(district_param = district, state_param = state) 
                    if district_json is not None and district_json not in districts_result:     
                        districts_result.append(district_json)
    return rank


def get_all_search_results(search_query, reps_result, parties_result,
    districts_result):
    rank = 0
    
    # Get all representatives that match the query
    reps = Representative.query.filter(or_(
        Representative.firstname.like(search_query),
        Representative.lastname.like(search_query),
        Representative.state.like(search_query),
        Representative.district.like(search_query),
        Representative.twitter.like(search_query),
        Representative.youtube.like(search_query)
    )).all()
    if len(reps) > 0:
        rank = 1
        for rep in reps:
            # Get the party and the district that match rep
            item = get_response(rep)
            del item['bills']
            if item != None and not item in reps_result:
                reps_result.append(item)

            party_json = get_party_json(rep_party_id=rep.party_id)
            if party_json != None and not party_json in parties_result:
                parties_result.append(party_json)

            district_json = get_district_json(rep_bioguide=rep.bioguide)
            if district_json != None and not district_json in districts_result:
                districts_result.append(district_json)

    parties = PoliticalParty.query.filter(or_(
        PoliticalParty.name.like(search_query),
        PoliticalParty.path.like(search_query),
        PoliticalParty.chair.like(search_query),
        PoliticalParty.formation_date.like(search_query),
        PoliticalParty.twitter_handle.like(search_query),
        PoliticalParty.youtube.like(search_query)
    )).all()
    if len(parties) > 0:
        rank = 2
        for party in parties:
            party_json = get_party_json(party_param=party)
            if party_json != None and not party_json in parties_result:
                parties_result.append(party_json)
            
            for rep in  Representative.query.filter(
                party.id == Representative.party_id).all():
                rep_json = get_response(rep)
                del rep_json['bills']
                if rep_json != None and not rep_json in reps_result:
                    reps_result.append(rep_json)

                district_json = get_district_json(rep_bioguide=rep.bioguide)
                if district_json != None and \
                    not district_json in districts_result:
                    districts_result.append(district_json)

    districts = District.query.filter(or_(
        District.alpha_num.like(search_query)
    )).all()
    if len(districts) > 0:
        rank = 3
        for district in districts:
            district_json = get_district_json(district_param=district)
            if district_json != None and not district_json in districts_result:
                districts_result.append(district_json)

            rep = Representative.query.filter(
                district_json['representative_id'] == Representative.bioguide).first()
            if rep:
                rep_json = get_response(rep)
                del rep_json['bills']
                if rep_json != None and not rep_json in reps_result:
                    reps_result.append(rep_json)
                
                party_json = get_party_json(rep_party_id=rep.party_id)
                if party_json != None and not party_json in parties_result:
                    parties_result.append(party_json)

    states = State.query.filter(or_(
        State.usps_abbreviation.like(search_query),
        State.name.like(search_query)
    )).all()
    if len(states) > 0:
        rank = 3
        for state in states:
            districts = District.query.filter(
                District.state == state.usps_abbreviation).all()
            if districts:
                for district in districts:
                    district_json = get_district_json(district_param=district,
                        state_param=state)
                    if district_json != None and \
                        not district_json in districts_result:
                        districts_result.append(district_json)

                    rep = Representative.query.filter(
                        district.representative_id == Representative.bioguide).first()
                    if rep:
                        rep_json = get_response(rep)
                        del rep_json['bills']
                        if rep_json != None and not rep_json in reps_result:
                            reps_result.append(rep_json)

                        party_json = get_party_json(rep_party_id=rep.party_id)
                        if party_json != None and \
                            not party_json in parties_result:
                            parties_result.append(party_json)
    return rank

@search_route.route("/")
def search():
    search_query = request.args.get('query')
    reps_result = []
    parties_result = []
    districts_result = []
    search_query = '%' + search_query[1:-1] + '%'

    rank = get_all_search_results(search_query, reps_result, parties_result, districts_result)
    if (not reps_result and not parties_result and not districts_result):
        search_query_words = search_query.split()
        index = 0
        while index < 5 and index < len(search_query_words):
            rank = get_brief_search_results(search_query_words[index], reps_result, parties_result, districts_result)
            index = index + 1

    return jsonify({
        "rank": rank,
        "reps": reps_result,
        "parties": parties_result,
        "districts": districts_result

    })

@error_route.app_errorhandler(404)
def url_not_found(e):
    return send_from_directory('static/templates', '404.html')
