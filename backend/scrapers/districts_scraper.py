import requests
import json
import os
import sys
from apikeys import API
sys.path.insert(1, os.path.join(sys.path[0], '..'))
from app import create_app, db
from models import District, State

CENSUS_API_KEY = API['CENSUS_API_KEY']
PROPUBLICA_API_KEY = API['PROPUBLICA_API_KEY']

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

endpoints = json.load(open('backend/scrapers/src/dictionaries/acs2016_endpoints.json'))
fips_state_codes = json.load(open('backend/scrapers/src/dictionaries/fips_state_codes.json'))
usps_state_abbreviations = json.load(
	open('backend/scrapers/src/dictionaries/usps_state_abbreviations.json'))

app = create_app()
app.app_context().push()

# only using US states
non_states = set([3, 7, 11, 14, 43, 52])

for num in range(1, 57):
	if num in non_states:
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

		# via https://tinyurl.com/ordinal-codegolf-python
		ordinal = lambda n: "%d%s" % \
			(n,"tsnrhtdd"[(n/10%10!=1)*(n%10<4)*n%10::4])
		if (district_name != 'At-Large'):
			wikipedia_link = "https://en.wikipedia.org/wiki/" + state_name + \
				"%27s_" + ordinal(district_key) + "_congressional_district"
		else:
			wikipedia_link = "https://en.wikipedia.org/wiki/" + state_name + \
				"%27s_at-large_congressional_district"

		response = requests.request('GET', MemberURL, headers=headers)
		rep = response.json()['results']
		rep_id = rep[0]['id'] if len(rep) > 0 else None

		district = districts[district_key]
		dist = District(
			alpha_num = abbrev + '-' + str(district_name),
			state = abbrev,
			id = district_name,
			representative_id = rep_id,
			wikipedia_link = wikipedia_link,

			population = district['population'],
			population_male = district['population_male'],

			median_age = float(district['median_age']),
			median_age_male = float(district['median_age_male']),
			median_age_female = float(district['median_age_female']),

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
				district['population_two_or_more_races'],

			ethnicity_not_hispanic_or_latino = \
				district['ethnicity_not_hispanic_or_latino'],
			ethnicity_hispanic_or_latino = \
				district['ethnicity_hispanic_or_latino'],
			citizenship_us_citizen_born_in_us = \
				district['citizenship_us_citizen_born_in_us'],
			citizenship_us_citizen_born_in_pr_or_us_island_areas = \
				district['citizenship_us_citizen_born_in_pr_or_us_island_areas'],
			citizenship_us_citizen_born_abroad_of_american_parents = \
				district['citizenship_us_citizen_born_abroad_of_american_parents'],
			citizenship_us_citizen_by_naturalization = \
				district['citizenship_us_citizen_by_naturalization'],
			citizenship_not_a_us_citizen = \
				district['citizenship_not_a_us_citizen'],

			language_speak_only_english = \
				district['language_speak_only_english'],
			language_speak_spanish = \
				district['language_speak_spanish'],
			language_speak_other_languages = \
				district['language_speak_other_languages'],

			marriage_never_married = \
				district['marriage_never_married'],
			marriage_now_married = \
				district['marriage_now_married'],
			marriage_divorced = \
				district['marriage_divorced'],
			marriage_separated = \
				district['marriage_separated'],
			marriage_widowed = \
				district['marriage_widowed'],

			education_less_than_hs = \
				district['education_less_than_hs'],
			education_hs_grad = \
				district['education_hs_grad'],
			education_some_college = \
				district['education_some_college'],
			education_bachelors = \
				district['education_bachelors'],
			education_grad_prof = \
				district['education_grad_prof'],

			income_none = \
				district['income_none'],
			income_9999_less = \
				district['income_9999_less'],
			income_10000_14999 = \
				district['income_10000_14999'],
			income_15000_19999 = \
				district['income_15000_19999'],
			income_20000_24999 = \
				district['income_20000_24999'],
			income_25000_29999 = \
				district['income_25000_29999'],
			income_30000_34999 = \
				district['income_30000_34999'],
			income_35000_39999 = \
				district['income_35000_39999'],
			income_40000_44999 = \
				district['income_40000_44999'],
			income_45000_49999 = \
				district['income_45000_49999'],
			income_50000_59999 = \
				district['income_50000_59999'],
			income_60000_74999 = \
				district['income_60000_74999'],
			income_75000_99999 = \
				district['income_75000_99999'],
			income_100000_124999 = \
				district['income_100000_124999'],
			income_125000_149999 = \
				district['income_125000_149999'],
			income_150000_199999 = \
				district['income_150000_199999'],
			income_200000_more = \
				district['income_200000_more'],

			veteran = \
				district['veteran'],

			computers_has_one_or_more = \
				district['computers_has_one_or_more'],
			computers_has_desktop_laptop = \
				district['computers_has_desktop_laptop'],
			computers_has_smartphone = \
				district['computers_has_smartphone'],
			computers_has_tablet = \
				district['computers_has_tablet'],
			computers_has_other = \
				district['computers_has_other'],
			computers_none = \
				district['computers_none'],

			internet_has = \
				district['internet_has'],
			internet_has_dialup = \
				district['internet_has_dialup'],
			internet_has_broadband = \
				district['internet_has_broadband'],
			internet_has_cellular_data = \
				district['internet_has_cellular_data'],
			internet_has_satellite = \
				district['internet_has_satellite'],
			internet_none = \
				district['internet_none']
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
			dist_result.wikipedia_link = dist.wikipedia_link

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

			dist_result.ethnicity_not_hispanic_or_latino = \
				dist.ethnicity_not_hispanic_or_latino
			dist_result.ethnicity_hispanic_or_latino = \
				dist.ethnicity_hispanic_or_latino

			dist_result.citizenship_us_citizen_born_in_us = \
				dist.citizenship_us_citizen_born_in_us
			dist_result.citizenship_us_citizen_born_in_pr_or_us_island_areas = \
				dist.citizenship_us_citizen_born_in_pr_or_us_island_areas
			dist_result.citizenship_us_citizen_born_abroad_of_american_parents = \
				dist.citizenship_us_citizen_born_abroad_of_american_parents
			dist_result.citizenship_us_citizen_by_naturalization = \
				dist.citizenship_us_citizen_by_naturalization
			dist_result.citizenship_not_a_us_citizen = \
				dist.citizenship_not_a_us_citizen

			dist_result.language_speak_only_english = \
				dist.language_speak_only_english
			dist_result.language_speak_spanish = \
				dist.language_speak_spanish
			dist_result.language_speak_other_languages = \
				dist.language_speak_other_languages

			dist_result.marriage_never_married = \
				dist.marriage_never_married
			dist_result.marriage_now_married = \
				dist.marriage_now_married
			dist_result.marriage_divorced = \
				dist.marriage_divorced
			dist_result.marriage_separated = \
				dist.marriage_separated
			dist_result.marriage_widowed = \
				dist.marriage_widowed

			dist_result.education_less_than_hs = \
				dist.education_less_than_hs
			dist_result.education_hs_grad = \
				dist.education_hs_grad
			dist_result.education_some_college = \
				dist.education_some_college
			dist_result.education_bachelors = \
				dist.education_bachelors
			dist_result.education_grad_prof = \
				dist.education_grad_prof

			dist_result.income_none = \
				dist.income_none
			dist_result.income_9999_less = \
				dist.income_9999_less
			dist_result.income_10000_14999 = \
				dist.income_10000_14999
			dist_result.income_15000_19999 = \
				dist.income_15000_19999
			dist_result.income_20000_24999 = \
				dist.income_20000_24999
			dist_result.income_25000_29999 = \
				dist.income_25000_29999
			dist_result.income_30000_34999 = \
				dist.income_30000_34999
			dist_result.income_35000_39999 = \
				dist.income_35000_39999
			dist_result.income_40000_44999 = \
				dist.income_40000_44999
			dist_result.income_45000_49999 = \
				dist.income_45000_49999
			dist_result.income_50000_59999 = \
				dist.income_50000_59999
			dist_result.income_60000_74999 = \
				dist.income_60000_74999
			dist_result.income_75000_99999 = \
				dist.income_75000_99999
			dist_result.income_100000_124999 = \
				dist.income_100000_124999
			dist_result.income_125000_149999 = \
				dist.income_125000_149999
			dist_result.income_150000_199999 = \
				dist.income_150000_199999
			dist_result.income_200000_more = \
				dist.income_200000_more

			dist_result.veteran = \
				dist.veteran

			dist_result.computers_has_one_or_more = \
				dist.computers_has_one_or_more
			dist_result.computers_has_desktop_laptop = \
				dist.computers_has_desktop_laptop
			dist_result.computers_has_smartphone = \
				dist.computers_has_smartphone
			dist_result.computers_has_tablet = \
				dist.computers_has_tablet
			dist_result.computers_has_other = \
				dist.computers_has_other
			dist_result.computers_none = \
				dist.computers_none

			dist_result.internet_has = \
				dist.internet_has
			dist_result.internet_has_dialup = \
				dist.internet_has_dialup
			dist_result.internet_has_broadband = \
				dist.internet_has_broadband
			dist_result.internet_has_cellular_data = \
				dist.internet_has_cellular_data
			dist_result.internet_has_satellite = \
				dist.internet_has_satellite
			dist_result.internet_none = \
				dist.internet_none

			db.session.commit()
