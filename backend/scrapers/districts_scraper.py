import requests
import json
import os
#import apikeys
from app.app import create_app, db
from app.models import District, State

CENSUS_API_KEY = 'e6d938b2ce182a3d35b4ab995f9a28f07a9c6350'
PROPUBLICA_API_KEY = 'icU6XnQ63Mu9qDhEg1QCz0Emb7wt5n9GoLEAEnmI'

headers = {
	'x-api-key': PROPUBLICA_API_KEY,
}

class CensusURL:
	def __init__(self, endpoint, state):
		self.endpoint = endpoint
		if state < 10:
			self.state = '0' + str(state)
		else:
			self.state = str(state)

	def getURL(self):
		global CENSUS_API_KEY
		return 'https://api.census.gov/data/2016/acs/acs1?get=NAME,' + str(self.endpoint) + \
			'&for=congressional%20district:*&in=state:' + str(self.state) + \
			'&key=' + CENSUS_API_KEY

endpoints = json.load(open('./src/dictionaries/acs2016_endpoints.json'))
fips_state_codes = json.load(open('./src/dictionaries/fips_state_codes.json'))
usps_state_abbreviations = json.load(
	open('./dictionaries/usps_state_abbreviations.json'))

app = create_app()
app.app_context().push()

for num in range(1, 57):
	# only using US states
	if num == 3 or num == 7 or num == 11 or num == 14 or num == 43 or num == 52:
		continue
	districts = {}
	for endpoint in endpoints.keys():
		url = CensusURL(endpoint, num)
		response = requests.request('GET', url.getURL())
		results = response.json()
		for index in range(1, len(results)):
			district = results[index]
			district_num = int(district[3])
			if (district_num not in districts):
				districts[district_num] = {}
			districts[district_num]['number'] = district_num
			districts[district_num][endpoints[endpoint]] = district[1]

	state_name = fips_state_codes[str(num)]
	abbrev = usps_state_abbreviations[state_name]
	state = State(
		number = num,
		name = state_name,
		usps_abbreviation = abbrev
	)

	for district_key in districts.keys():
		propublica_district = district_key if district_key != 0 else 1
		district_name = district_key if district_key != 0 else 'At-Large'
		MemberURL = 'https://api.propublica.org/congress/v1/members/house/' + \
			abbrev + '/' + str(propublica_district) + '/current.json'
		response = requests.request('GET', MemberURL, headers=headers)
		rep = response.json()['results']
		rep_id = rep[0]['id'] if len(rep) > 0 else None

		district = districts[district_key]
		dist = District(
			alpha_num = abbrev + '-' + str(district_name),
			state = abbrev,
			id = district_name,
			representative_id = rep_id,
			population = district['population'],
			median_age = float(district['median_age']),
			median_age_male = float(district['median_age_male']),
			median_age_female = float(district['median_age_female']),
			population_male = district['population_male'],
			population_white = district['population_white'],
			population_black_or_african_american = \
				district['population_black_or_african_american'],
			population_american_indian_and_alaska_native = \
				district['population_american_indian_and_alaska_native'],
			population_asian = district['population_asian'],
			population_native_hawaiian_and_other_pacific_islander = \
				district['population_native_hawaiian_and_other' +
					'_pacific_islander'],
			population_some_other_race = district['population_some_other_race'],
			population_two_or_more_races = \
				district['population_two_or_more_races']
		)
		state.districts.append(dist)

		state_result = District.query.filter(
			State.number == state.number).first()

		if state_result == None:
			db.session.add(state)
			db.session.commit()
		else:
			state_result.number = state.number
			state_result.name = state.name
			state_result.usps_abbreviation = state.usps_abbreviation
			db.session.commit()

		dist_result = District.query.filter(
			District.alpha_num == dist.alpha_num).first()

		if dist_result == None:
			db.session.add(dist)
			db.session.commit()
		else:
			dist_result.alpha_num = dist.alpha_num
			dist_result.state = dist.state
			dist_result.id = dist.id
			dist_result.representative_id = dist.representative_id
			dist_result.population = dist.population
			dist_result.median_age = dist.median_age
			dist_result.median_age_male = dist.median_age_male
			dist_result.median_age_female = dist.median_age_female
			dist_result.population_male = dist.population_male
			dist_result.population_white = dist.population_white
			dist_result.population_black_or_african_american = \
				dist.population_black_or_african_american
			dist_result.population_american_indian_and_alaska_native = \
				dist.population_american_indian_and_alaska_native
			dist_result.population_asian = dist.population_asian
			dist_result.population_native_hawaiian_and_other_pacific_islander = \
				dist.population_native_hawaiian_and_other_pacific_islander
			dist_result.population_some_other_race = \
				dist.population_some_other_race
			dist_result.population_two_or_more_races = \
				dist.population_two_or_more_races
			db.session.commit()
