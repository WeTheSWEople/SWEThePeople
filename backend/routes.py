import json
from flask import Blueprint, jsonify, request, send_from_directory # noqa
from models import District, PartyColor, PoliticalParty, Representative, State # noqa
from sqlalchemy import or_ # noqa
from util import * # noqa


root_route = Blueprint('root', __name__)
rep_route = Blueprint('representative', __name__)
error_route = Blueprint('error', __name__)
party_route = Blueprint('political_party', __name__)
state_route = Blueprint('state', __name__)
district_route = Blueprint('district', __name__)
search_route = Blueprint('search', __name__)


@root_route.route('/')
def endpoints():
    """
    Index page with example routes
    """

    return send_from_directory('static', 'index.html')


@rep_route.route('/')
def all_representatives():
    """
    Endpoint to get all the representatives instances

    Returns a list of representative dictionaries
    """

    return get_all_items(Representative, Representative.bioguide,
                         'Representative')


@rep_route.route('/<bioguide>')
def representative(bioguide):
    """
    Endpoint to get a single representative instance

    bioguide -- the bioguide ID of the representative to get

    Returns a dictionary of request representative
    """

    return get_single_item(Representative, Representative.bioguide,
                           bioguide.upper())


@rep_route.route('/page/<num>')
def representatives_by_page(num):
    """
    Gets the representatives given the page number.

    Provides 25 representatives per page, ordering the representatives by their
    bioguide ID

    num -- the page number to get

    Returns a list of representative dictionaries
    """

    num = int(num)
    if num < 0:
        response = jsonify({"Error": "Item Not Found."})
        response.status_code = 404
        return response

    offset = num * 25
    query = Representative.query.order_by(Representative.bioguide)
    query = query.offset(offset).limit(25)
    return jsonify([get_response(rep) for rep in query.all()])


@rep_route.route("/filter")
def representatives_filter():
    """
    Gets representatives based on the filter query given by the 'query'
    parameter.

    The query parameter should be JSON formatted with the following fields:
    - "state"       -- the usps abbreviation of a state
    - "last_name"   -- the range of last names given as two letters (ex: 'A-L')
    - "party_id"    -- the ID of a political party
    - "votes_pct"   -- the range of vote percentages given as two floats
                       (ex: 60-69.99)
    - "order_by"    -- how to order the results. Should be last_asc, last_desc,
                       votes_pct_asc, or votes_pct_desc

    Returns list of representative dictionaries that match the given filter or
    an error if the query is invalid
    """

    try:
        filter_query = request.args.get('filter')
        filter_query = str(filter_query)
        filter_query = json.loads(filter_query)
    except:
        return error("Filter Query Invalid")

    state = 'None'
    last_name = 'None'
    party_id = 'None'
    votes_pct = 'None'
    order_by = 'None'
    if 'state' in filter_query:
        state = str(filter_query['state'])

    if 'party_id' in filter_query:
        party_id = filter_query['party_id']

    if 'last_name' in filter_query:
        last_name = str(filter_query['last_name']).lower().split('-')

    if 'votes_pct' in filter_query:
        votes_pct = str(filter_query['votes_pct']).split('-')

    if 'order_by' in filter_query:
        order_by = str(filter_query['order_by'])

    filtered_result = Representative.query
    if state != 'None':
        filtered_result = filtered_result.filter(Representative.state == state)

    if party_id != 'None':
        filtered_result = filtered_result.filter(
            Representative.party_id == int(party_id))

    if votes_pct != 'None' and votes_pct[0] != 'None':
        filtered_result = filtered_result.filter(
            Representative.votes_with_party_pct >= float(votes_pct[0]),
            Representative.votes_with_party_pct < float(votes_pct[1]))

    if order_by != 'None':
        if (order_by == 'last_asc'):
            filtered_result = filtered_result.order_by(
                Representative.lastname.asc())
        elif (order_by == 'last_desc'):
            filtered_result = filtered_result.order_by(
                Representative.lastname.desc())
        elif (order_by == 'votes_pct_asc'):
            filtered_result = filtered_result.order_by(
                Representative.votes_with_party_pct.asc())
        else:
            filtered_result = filtered_result.order_by(
                Representative.votes_with_party_pct.desc())
    else:
        filtered_result = filtered_result.order_by(
            Representative.lastname.asc())

    filtered_result = filtered_result.all()
    filtered_dict_list = [get_response(rep) for rep in filtered_result]

    if last_name != 'None':
        return jsonify(filter(
            lambda s: s['lastname'][0].lower() >= last_name[0] and
            s['lastname'][0].lower() <= last_name[1],
            filtered_dict_list))
    else:
        return jsonify(filtered_dict_list)


@party_route.route("/")
def all_parties():
    """
    Endpoint to get all of the political parties

    Accepts the parameter 'party_name' with the values 'True' or 'False'. If
    'True', will get only the party's ID, name, and path instead of the full
    party dictionary.

    Returns a list of the political party dictionaries
    """

    party_name = request.args.get('party_name')
    party_color = request.args.get('party_color')
    if party_name == 'True':
        query = PoliticalParty.query.with_entities(
            PoliticalParty.id, PoliticalParty.name, PoliticalParty.path)
        query = query.order_by(PoliticalParty.id)
        return jsonify(
            {party.id: [party.name, party.path] for party in query.all()})
    elif party_color == 'True':
        query = PartyColor.query.distinct(PartyColor.party_id)
        query = query.order_by(PartyColor.party_id)

        return jsonify(
            {c.party_id: c.color for c in query.all()}
        )
    return get_all_items(PoliticalParty, PoliticalParty.id, 'PoliticalParty')


@party_route.route("/<path>")
def party_by_path(path):
    """
    Endpoint to get a political party given its path

    path -- the path of the political party to get

    Returns the dictionary of the requested political party
    """

    return get_single_item(PoliticalParty, PoliticalParty.path, path.lower())


@party_route.route("/id/<party_id>")
def party_by_id(party_id):
    """
    Endpoint to get the political party given its ID

    party_id -- the ID of the political party to get

    Returns the dictionary of the requested political party
    """

    return get_single_item(PoliticalParty, PoliticalParty.id, party_id)


@party_route.route("/filter")
def party_filter():
    """
    Endpoint to get political parties based on the filter query given by the
    'query' parameter.

    The query parameter should be a JSON formatted with the following fields:
    - social    -- the types of social media. Should be YT, T, Y, Neither
    - color     -- the party color
    - date      -- the range of dates for the formation of the party given as
                   two integers (ex: 1776-2018)
    - name      -- the range of party names given as two letters (ex: 'A-L')
    - order_by  -- how to order the results. Should be name_asc, name_desc,
                   chair_name_asc, or chair_name_desc

    Returns a list of the political parties that match the given query
    """

    try:
        filter_query = request.args.get('filter')
        filter_query = str(filter_query)
        filter_query = json.loads(filter_query)
    except:
        return error("Filter Query Invalid")

    social = 'None'
    color = 'None'
    formation_date = 'None'
    name = ['a', 'z']
    order_by = 'None'

    if 'social' in filter_query:
        social = str(filter_query['social'])
    if 'color' in filter_query:
        color = str(filter_query['color'])
    if 'date' in filter_query:
        formation_date = filter_query['date'].split("-")
    if 'name' in filter_query:
        name = str(filter_query['name']).lower().split('-')
    if 'order_by' in filter_query:
        order_by = str(filter_query['order_by'])

    filtered_result = PoliticalParty.query
    if social == 'YT':
        filtered_result = filtered_result.filter(
            PoliticalParty.youtube != '',
            PoliticalParty.twitter_handle != '')
    elif social == 'T':
        filtered_result = filtered_result.filter(
            PoliticalParty.twitter_handle != '')
    elif social == 'Y':
        filtered_result = filtered_result.filter(
            PoliticalParty.youtube != '')
    elif social != 'None':
        filtered_result = filtered_result.filter(
            PoliticalParty.youtube == '',
            PoliticalParty.twitter_handle == '')

    if color != 'None':
        color = color.title()
        filtered_result = filtered_result.join(PartyColor).filter(
            PartyColor.color == color)

    result = None
    if order_by == 'name_asc':
        filtered_result = filtered_result.order_by(
            PoliticalParty.name.asc())
    elif order_by == 'name_desc':
        result = [get_response(party) for party in filtered_result.all()]
        result = sorted(result, key=party_chair)
        result = list(reversed(result))
    elif order_by == 'chair_name_asc':
        result = [get_response(party) for party in filtered_result.all()]
        result = sorted(result, key=party_chair)
    elif order_by == 'chair_name_desc':
        filtered_result = filtered_result.order_by(
            PoliticalParty.chair.desc())
    else:
        filtered_result = filtered_result.order_by(PoliticalParty.id)

    # Delete Bills from the result
    if result is None:
        result = [get_response(party) for party in filtered_result.all()]
    for party in result:
        for rep in party['representatives']:
            del rep['bills']

    if formation_date != 'None' and formation_date[0] != 'None':
        # Filter to parties formed between the given years

        date_begin = int(formation_date[0])
        date_end = int(formation_date[1])

        def party_formed_between(party):
            year = int(party['formation_date'].split()[-1])
            return date_begin <= year <= date_end
        result = filter(party_formed_between, result)

    # Filter the names of the parties
    return jsonify(filter(lambda n: name[0] <= n['name'].lower()[0] <= name[1],
                   result))


def party_chair(party):
    """
    Provides the key to sort parties when sorting by chair

    party -- the party to get the chair of

    Returns the party chair or a string of z's if party does not have a chair
    """

    if party['chair'] == '':
        return 'zzzzzzzzzzzzzzzzzzzzzzz'
    return party['chair']


@state_route.route("/")
def all_states():
    """
    Endpoint to get all of the states.

    Accepts the parameter 'state_usps' with the values 'True' or 'False'. If
    'True', will get only the state's usps abbreviation mapped to its name
    instead of the full state dictionary.

    Returns a list of state dictionaries
    """

    state_usps = request.args.get('state_usps')
    if state_usps == 'True':
        query = State.query.with_entities(
            State.number, State.usps_abbreviation, State.name)
        return jsonify(
            {state.usps_abbreviation: state.name for state in query.all()})

    return get_all_items(State, State.number, 'State')


@state_route.route("/<abbrev>")
def single_state(abbrev):
    """
    Endpoint to get a single state instance given its usps abbreviation.

    abbrev -- the usps abbreviation of the state

    Returns the dictionary of the requested state
    """

    return get_single_item(State, State.usps_abbreviation, abbrev.upper())


@district_route.route("/")
def all_districts():
    """
    Endpoint to get all of the districts

    Returns a list of all district dictionaries
    """

    return get_all_items(District, District.alpha_num, 'District')


@district_route.route("/<abbrev>")
def districts_by_state(abbrev):
    """
    Endpoint to get all the districts that belong to the given state.

    abbrev -- the usps abbreviation of the state to get districts from

    Returns a list of the districts that belong to the given state
    """

    district_list = District.query.filter(District.state == abbrev).all()
    if not district_list:
        return error("Item not found for id " + abbrev)
    return jsonify([get_response(district) for district in district_list])


@district_route.route("/<abbrev>/<district_id>")
def districts_by_id(abbrev, district_id):
    """
    Gets the district given its state's usps abbreviation and its district
    number.

    abbrev      -- the usps abbreviation of the district's state
    district_id -- the ID of the district

    Returns the district dictionary matching the usps abbreviation and ID
    """

    data = District.query.filter(
        District.state == abbrev.upper(), District.id == district_id).first()
    if not data:
        return error("Item not found for id " + abbrev + " and " + district_id)
    return jsonify(get_response(data))


@district_route.route("/filter")
def districts_filter():
    """
    Endpoint to get the districts based on the filter query given the 'query'
    parameter.

    The query parameter should be a JSON formatted with the following fields:
    - state         -- the usps abbreviation of the district's state
    - population    -- the range of populations given as two integers
                       (ex: 500000-1000000)
    - median_age    -- the range of median ages given as two floats
                       (ex: 46.6-50)
    - order_by      -- how the results should be ordered. Should be state_asc,
                       state_desc, population_asc, or population_desc

    Returns a list of the districts that match the given query
    """

    try:
        filter_query = request.args.get('filter')
        filter_query = str(filter_query)
        filter_query = json.loads(filter_query)
    except:
        return error("Filter Query Invalid")

    order_by = 'state_asc'

    filtered_result = District.query
    if 'state' in filter_query and filter_query['state'] != 'None':
        filtered_result = filtered_result.filter(
            District.state == str(filter_query['state']))

    if 'population' in filter_query and filter_query['population'] != 'None':
        population = str(filter_query['population']).split('-')
        filtered_result = filtered_result.filter(
            int(population[0]) <= District.population)
        filtered_result = filtered_result.filter(
            District.population < int(population[1]))

    if 'median_age' in filter_query and filter_query['median_age'] != 'None':
        median_age = str(filter_query['median_age']).split('-')
        filtered_result = filtered_result.filter(
            float(median_age[0]) <= District.median_age)
        filtered_result = filtered_result.filter(
            District.median_age < float(median_age[1]))

    if 'order_by' in filter_query:
        order_by = str(filter_query['order_by'])

    result = None
    if order_by == 'state_desc':
        result = [get_response(rep) for rep in filtered_result.all()]
        result = sorted(result, key=district_id)
        result = sorted(result, key=lambda district: district['state'])
        result = list(reversed(result))
    elif order_by == 'population_desc':
        filtered_result = filtered_result.order_by(District.population.desc())
    elif order_by == 'population_asc':
        filtered_result = filtered_result.order_by(District.population.asc())
    else:
        result = [get_response(rep) for rep in filtered_result.all()]
        result = sorted(result, key=district_id)
        result = sorted(result, key=lambda district: district['state'])

    if result != None: # noqa
        return jsonify(result)
    return jsonify([get_response(rep) for rep in filtered_result.all()])


def district_id(district):
    """
    Get the district ID for the given district

    district -- the district to get the ID of

    Returns the int of the district ID or 1 if the district is At-Large
    """

    if district['id'] == 'At-Large':
        return 1
    return int(district['id'])


def get_party_json(rep_party_id=None, party_param=None):
    """
    Gets the JSON for a political party given either the party_id or the party
    itself.

    rep_party_id -- the ID of the party
    party_param  -- the party

    Returns the JSON for the party matching the parameters.
    """

    party = party_param

    if rep_party_id:
        party = PoliticalParty.query.with_entities(
            PoliticalParty.id, PoliticalParty.name, PoliticalParty.chair,
            PoliticalParty.formation_date, PoliticalParty.office,
            PoliticalParty.path)
        party = party.filter(PoliticalParty.id == rep_party_id).first()

    if party is not None:
        return {
            "id": party.id,
            "name": party.name,
            "path": party.path,
            "chair": party.chair,
            "formation_date": party.formation_date,
            "office": party.office,
            "path": party.path
        }
    return None


def get_district_json(rep_bioguide=None, district_param=None,
                      state_param=None):
    """
    Gets the JSON for a district given its rep's ID, the district itself, or
    the state itself

    rep_bioguide    -- the bioguide ID of the representative
    district_param  -- the district itself
    state_param     -- the state the given district belongs to. district_param
                       must be supplied with state_param

    Returns the JSON for the district
    """

    district = district_param
    state = state_param
    if rep_bioguide:
        district = District.query.filter(
            District.representative_id == rep_bioguide).first()
        state = State.query.with_entities(
            State.name, State.usps_abbreviation)
        state = state.filter(State.usps_abbreviation == district.state).first()
    elif district_param and not state_param:
        district = district_param
        state = State.query.with_entities(State.name, State.usps_abbreviation)
        state = state.filter(State.usps_abbreviation == district.state).first()

    if district is None or state is None:
        return None

    return {
        "alpha_num": district.alpha_num,
        "id": district.id,
        "representative_id": district.representative_id,
        "population": district.population,
        "median_age": district.median_age,
        "state": district.state,
        "state_full": state.name
    }


def handle_rep_search(query, result, ranks):
    """
    Handles searching the representatives

    Finds any representative that matches the given query. If finds a new
    representative, appends it to result, appends a 1 for its rank, adds the
    rep's political party and district to the results with a rank of 0 if they
    are not already present. If finds a rep that is already in result,
    increments its rank in ranks.

    The index of the item in result should match the index of its rank in ranks

    query   -- the query to search for
    result  -- the list to append results to
    ranks   -- the list to append ranks for results to
    """

    reps = Representative.query.filter(or_(
        Representative.firstname.ilike(query),
        Representative.lastname.ilike(query),
        Representative.state.ilike(query),
        Representative.district.ilike(query),
        Representative.twitter.ilike(query),
        Representative.youtube.ilike(query)
    )).all()

    for rep in reps:
        item = get_response(rep)
        del item['bills']
        if item is not None:
            if item not in result:
                result.append(item)
                ranks.append(1)

                party_json = get_party_json(rep_party_id=rep.party_id)
                if party_json is not None and party_json not in result:
                    result.append(party_json)
                    ranks.append(0)

                district_json = get_district_json(rep_bioguide=rep.bioguide)
                if district_json is not None and district_json not in result:
                    result.append(district_json)
                    ranks.append(0)
            else:
                ranks[result.index(item)] += 1


def handle_district_search(query, result, ranks):
    """
    Handles searching the districts

    Finds any district that matches the given query. If finds a new district,
    appends it to result, appends a 1 for its rank. If the district has a
    representative, appends that representative and the reps political party to
    result if they are not already present. If finds a district that is already
    in result, increments its rank in ranks.

    The index of the item in result should match index of its rank in ranks.

    query   -- the query to search for
    result  -- the list to append results to
    ranks   -- the list to append ranks for results to
    """

    districts = District.query.filter(or_(
        District.alpha_num.ilike(query)
    )).all()

    for district in districts:
        district_json = get_district_json(district_param=district)
        if district_json is not None:
            if district_json not in result:
                result.append(district_json)
                ranks.append(1)

                rep = Representative.query.filter(
                    district_json['representative_id'] ==
                    Representative.bioguide).first()
                if rep:
                    rep_json = get_response(rep)
                    del rep_json['bills']
                    if rep_json is not None and rep_json not in result:
                        result.append(rep_json)
                        ranks.append(0)
                    party_json = get_party_json(rep_party_id=rep.party_id)
                    if party_json is not None and party_json not in result:
                        result.append(party_json)
                        ranks.append(0)
            else:
                ranks[result.index(district_json)] += 1


def handle_party_search(query, result, ranks):
    """
    Handles searching the political parties

    Finds any political party that matches the given query. If finds a new
    political party, appends it to the result, appends 1 for its rank, and
    appends all representatives and districts that belong to party. If finds
    a party that is already in result, increments its rank in ranks

    The index of the item in result should match index of its rank in ranks.

    query   -- the query to search for
    result  -- the list to append results to
    ranks   -- the list to append ranks for results to
    """

    parties = PoliticalParty.query.filter(or_(
        PoliticalParty.name.ilike(query),
        PoliticalParty.path.ilike(query),
        PoliticalParty.chair.ilike(query),
        PoliticalParty.formation_date.ilike(query),
        PoliticalParty.twitter_handle.ilike(query),
        PoliticalParty.youtube.ilike(query)
    )).all()

    for party in parties:
        party_json = get_party_json(party_param=party)
        if party_json is not None:
            if party_json not in result:
                result.append(party_json)
                ranks.append(1)

                for rep in Representative.query \
                        .filter(party.id == Representative.party_id).all():
                    rep_json = get_response(rep)
                    del rep_json['bills']
                    if rep_json is not None and rep_json not in result:
                        result.append(rep_json)
                        ranks.append(0)
                    district_json = get_district_json(
                        rep_bioguide=rep.bioguide)
                    if district_json is not None and \
                       district_json not in result:
                        result.append(district_json)
                        ranks.append(0)
            else:
                ranks[result.index(party_json)] += 1


def handle_state_search(query, result, ranks):
    """
    Handles searching the states

    Finds any state that matches the search query. If finds new state, appends
    any district, representative, and political party that falls under that
    state.

    The index of the item in result should match index of its rank in ranks.

    query   -- the query to search for
    result  -- the list to append results to
    ranks   -- the list to append ranks for results to
    """

    states = State.query.filter(or_(
        State.usps_abbreviation.ilike(query),
        State.name.ilike(query)
    )).all()

    for state in states:
        districts = District.query.filter(
            District.state == state.usps_abbreviation).all()
        if districts:
            for district in districts:
                district_json = get_district_json(district_param=district,
                                                  state_param=state)
                if district_json is not None:
                    if district_json not in result:
                        result.append(district_json)
                        ranks.append(1)

                        rep = Representative.query.filter(
                            district.representative_id ==
                            Representative.bioguide)
                        rep = rep.first()
                        if rep:
                            rep_json = get_response(rep)
                            del rep_json['bills']
                            if rep_json is not None and rep_json not in result:
                                result.append(rep_json)
                                ranks.append(0)

                            party_json = get_party_json(
                                rep_party_id=rep.party_id)
                            if party_json is not None and\
                               party_json not in result:
                                result.append(party_json)
                                ranks.append(0)
                    else:
                        ranks[result.index(district_json)] += 1


@search_route.route("/")
def search():
    """
    Endpoint to handle searching the database.

    Accepts the parameter 'query' which should be the string to search against
    all the models. Searches through the models building a list of matching
    instances and a list ranking each instance.

    Returns the list of matching instances with the rank they should be ordered
    by.
    """

    try:
        query = request.args.get('query').split()
    except:
        return error("Search Query Invalid")
    result = []
    ranks = []

    for term in query:
        term = '%' + term + '%'
        handle_rep_search(term, result, ranks)
        handle_district_search(term, result, ranks)
        handle_party_search(term, result, ranks)
        handle_state_search(term, result, ranks)

    for i in range(len(result)):
        result[i]['rank'] = ranks[i]

    return jsonify(result)


@error_route.app_errorhandler(404)
def url_not_found(e):
    """
    Handles when an invalid API path is given
    """

    return send_from_directory('static/templates', '404.html')
