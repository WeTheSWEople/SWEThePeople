import requests
import json
import os
import sys
from apikeys import API

sys.path.insert(1, os.path.join(sys.path[0], '..'))
from app import create_app, db
from models import District, State

PROPUBLICA_URL = 'https://api.propublica.org/congress/v1/members/house/'
CENSUS_API_KEY = API['CENSUS_API_KEY']
PROPUBLICA_API_KEY = API['PROPUBLICA_API_KEY']
NUM_STATES = 57
TERRITORIES = set([3, 7, 11, 14, 43, 52])

headers = {
    'x-api-key': PROPUBLICA_API_KEY,
}


def set_district(district, values):
    """
    Sets the values in district using values

    district -- the district to set
    values   -- the values to set to
    """

    district.alpha_num = values.alpha_num
    district.state = values.state
    district.id = values.id
    district.representative_id = values.representative_id
    district.population = values.population
    district.wikipedia_link = values.wikipedia_link

    district.median_age = values.median_age
    district.median_age_male = values.median_age_male
    district.median_age_female = values.median_age_female

    district.population_male = values.population_male
    district.population_white = values.population_white
    district.population_black_or_african_american = \
        values.population_black_or_african_american
    district.population_american_indian_and_alaska_native = \
        values.population_american_indian_and_alaska_native
    district.population_asian = values.population_asian
    district.population_native_hawaiian_and_other_pacific_islander = \
        values.population_native_hawaiian_and_other_pacific_islander
    district.population_some_other_race = \
        values.population_some_other_race
    district.population_two_or_more_races = \
        values.population_two_or_more_races

    district.ethnicity_not_hispanic_or_latino = \
        values.ethnicity_not_hispanic_or_latino
    district.ethnicity_hispanic_or_latino = \
        values.ethnicity_hispanic_or_latino

    district.citizenship_us_citizen_born_in_us = \
        values.citizenship_us_citizen_born_in_us
    district.citizenship_us_citizen_born_in_pr_or_us_island_areas = \
        values.citizenship_us_citizen_born_in_pr_or_us_island_areas
    district.citizenship_us_citizen_born_abroad_of_american_parents = \
        values.citizenship_us_citizen_born_abroad_of_american_parents
    district.citizenship_us_citizen_by_naturalization = \
        values.citizenship_us_citizen_by_naturalization
    district.citizenship_not_a_us_citizen = \
        values.citizenship_not_a_us_citizen

    district.language_speak_only_english = values.language_speak_only_english
    district.language_speak_spanish = values.language_speak_spanish
    district.language_speak_other_languages = \
        values.language_speak_other_languages

    district.marriage_never_married = values.marriage_never_married
    district.marriage_now_married = values.marriage_now_married
    district.marriage_divorced = values.marriage_divorced
    district.marriage_separated = values.marriage_separated
    district.marriage_widowed = values.marriage_widowed

    district.education_less_than_hs = values.education_less_than_hs
    district.education_hs_grad = values.education_hs_grad
    district.education_some_college = values.education_some_college
    district.education_bachelors = values.education_bachelors
    district.education_grad_prof = values.education_grad_prof

    district.income_none = values.income_none
    district.income_9999_less = values.income_9999_less
    district.income_10000_14999 = values.income_10000_14999
    district.income_15000_19999 = values.income_15000_19999
    district.income_20000_24999 = values.income_20000_24999
    district.income_25000_29999 = values.income_25000_29999
    district.income_30000_34999 = values.income_30000_34999
    district.income_35000_39999 = values.income_35000_39999
    district.income_40000_44999 = values.income_40000_44999
    district.income_45000_49999 = values.income_45000_49999
    district.income_50000_59999 = values.income_50000_59999
    district.income_60000_74999 = values.income_60000_74999
    district.income_75000_99999 = values.income_75000_99999
    district.income_100000_124999 = values.income_100000_124999
    district.income_125000_149999 = values.income_125000_149999
    district.income_150000_199999 = values.income_150000_199999
    district.income_200000_more = values.income_200000_more

    district.veteran = values.veteran
    district.computers_has_one_or_more = values.computers_has_one_or_more
    district.computers_has_desktop_laptop = values.computers_has_desktop_laptop
    district.computers_has_smartphone = values.computers_has_smartphone
    district.computers_has_tablet = values.computers_has_tablet
    district.computers_has_other = values.computers_has_other
    district.computers_none = values.computers_none

    district.internet_has = values.internet_has
    district.internet_has_dialup = values.internet_has_dialup
    district.internet_has_broadband = values.internet_has_broadband
    district.internet_has_cellular_data = values.internet_has_cellular_data
    district.internet_has_satellite = values.internet_has_satellite
    district.internet_none = values.internet_none


def build_district(name, abbrev, rep_id, wikipedia_link, district):
    """
    Builds a District from the information scrapped

    name            -- the name of the district
    abbrev          -- the state usps abbreviation
    rep_id          -- the ID of the representative
    wikipedia_link  -- the link to the Wikipedia page for this district
    district        -- the dict of scraped information

    Returns the built District
    """

    return District(
        alpha_num=abbrev + '-' + str(name),
        state=abbrev,
        id=name,
        representative_id=rep_id,
        wikipedia_link=wikipedia_link,
        population=district['population'],
        population_male=district['population_male'],

        median_age=float(district['median_age']),
        median_age_male=float(district['median_age_male']),
        median_age_female=float(district['median_age_female']),

        population_white=district['population_white'],
        population_black_or_african_american=district[
            'population_black_or_african_american'],
        population_american_indian_and_alaska_native=district[
            'population_american_indian_and_alaska_native'],
        population_asian=district['population_asian'],
        population_native_hawaiian_and_other_pacific_islander=district[
            'population_native_hawaiian_and_other_pacific_islander'],
        population_some_other_race=district['population_some_other_race'],
        population_two_or_more_races=district['population_two_or_more_races'],

        ethnicity_not_hispanic_or_latino=district[
            'ethnicity_not_hispanic_or_latino'],
        ethnicity_hispanic_or_latino=district['ethnicity_hispanic_or_latino'],
        citizenship_us_citizen_born_in_us=district[
            'citizenship_us_citizen_born_in_us'],
        citizenship_us_citizen_born_in_pr_or_us_island_areas=district[
            'citizenship_us_citizen_born_in_pr_or_us_island_areas'],
        citizenship_us_citizen_born_abroad_of_american_parents=district[
            'citizenship_us_citizen_born_abroad_of_american_parents'],
        citizenship_us_citizen_by_naturalization=district[
            'citizenship_us_citizen_by_naturalization'],
        citizenship_not_a_us_citizen=district['citizenship_not_a_us_citizen'],

        language_speak_only_english=district['language_speak_only_english'],
        language_speak_spanish=district['language_speak_spanish'],
        language_speak_other_languages=district[
            'language_speak_other_languages'],

        marriage_never_married=district['marriage_never_married'],
        marriage_now_married=district['marriage_now_married'],
        marriage_divorced=district['marriage_divorced'],
        marriage_separated=district['marriage_separated'],
        marriage_widowed=district['marriage_widowed'],

        education_less_than_hs=district['education_less_than_hs'],
        education_hs_grad=district['education_hs_grad'],
        education_some_college=district['education_some_college'],
        education_bachelors=district['education_bachelors'],
        education_grad_prof=district['education_grad_prof'],

        income_none=district['income_none'],
        income_9999_less=district['income_9999_less'],
        income_10000_14999=district['income_10000_14999'],
        income_15000_19999=district['income_15000_19999'],
        income_20000_24999=district['income_20000_24999'],
        income_25000_29999=district['income_25000_29999'],
        income_30000_34999=district['income_30000_34999'],
        income_35000_39999=district['income_35000_39999'],
        income_40000_44999=district['income_40000_44999'],
        income_45000_49999=district['income_45000_49999'],
        income_50000_59999=district['income_50000_59999'],
        income_60000_74999=district['income_60000_74999'],
        income_75000_99999=district['income_75000_99999'],
        income_100000_124999=district['income_100000_124999'],
        income_125000_149999=district['income_125000_149999'],
        income_150000_199999=district['income_150000_199999'],
        income_200000_more=district['income_200000_more'],

        veteran=district['veteran'],

        computers_has_one_or_more=district['computers_has_one_or_more'],
        computers_has_desktop_laptop=district['computers_has_desktop_laptop'],
        computers_has_smartphone=district['computers_has_smartphone'],
        computers_has_tablet=district['computers_has_tablet'],
        computers_has_other=district['computers_has_other'],
        computers_none=district['computers_none'],

        internet_has=district['internet_has'],
        internet_has_dialup=district['internet_has_dialup'],
        internet_has_broadband=district['internet_has_broadband'],
        internet_has_cellular_data=district['internet_has_cellular_data'],
        internet_has_satellite=district['internet_has_satellite'],
        internet_none=district['internet_none']
    )


def ordinal(n):
    """
    Converts the given number into its ordinal representation.

    For example, converts 12 into 12th, converts 23 into 23rd.
    Taken from https://tinyurl.com/ordinal-codegolf-python

    n -- the number to convert

    Returns the ordinal form of n
    """

    return "%d%s" % (n, "tsnrhtdd"[(n / 10 % 10 != 1)*(n % 10 < 4) * n % 10::4])


def get_url(endpoint, state):
    """
    Gets the url to use to request information for a state.

    If the state is represented by a single digit number, appends a 0 before the
    state number

    endpoint -- the endpoint to request from
    state    -- the integer value for the state

    Returns the URL to request to
    """

    if state < 10:
        state = '0' + str(state)
    return 'https://api.census.gov/data/2016/acs/acs1?get=NAME,' + \
           str(endpoint) + '&for=congressional%20district:*&in=state:' + \
           str(state) + '&key=' + CENSUS_API_KEY


def main():
    endpoints = json.load(
        open('./scrapers/src/dictionaries/acs2016_endpoints.json'))
    fips_state_codes = json.load(
        open('./scrapers/src/dictionaries/fips_state_codes.json'))
    usps_state_abbreviations = json.load(
        open('./scrapers/src/dictionaries/usps_state_abbreviations.json'))

    app = create_app()
    app.app_context().push()

    # Loop through all the states skipping over the territories
    for num in range(1, NUM_STATES):
        if num not in TERRITORIES:
            districts = {}

            for endpoint in endpoints.keys():
                response = requests.request('GET', get_url(endpoint, num))
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
                    number=num,
                    name=state_name,
                    usps_abbreviation=abbrev
                )

                for district_key in districts.keys():
                    propublica_district = district_key
                    if district_key == 0:
                        propublica_district = 1

                    district_name = district_key
                    if district_key == 0:
                        district_name = "At-Large"
                    MemberURL = PROPUBLICA_URL + abbrev + '/' + \
                        str(propublica_district) + '/current.json'

                    print(state_name + '-' + str(district_name))

                    if (district_name != 'At-Large'):
                        wikipedia_link = "https://en.wikipedia.org/wiki/" + \
                                         state_name + "%27s_" + \
                                         ordinal(district_key) + \
                                         "_congressional_district"
                    else:
                        wikipedia_link = "https://en.wikipedia.org/wiki/" + \
                                         state_name + \
                                         "%27s_at-large_congressional_district"

                    response = requests.request('GET', MemberURL,
                                                headers=headers)
                    rep = response.json()['results']
                    rep_id = rep[0]['id'] if len(rep) > 0 else None

                    dist = build_district(district_name, abbrev, rep_id,
                                          wikipedia_link,
                                          districts[district_key])
                    state.districts.append(dist)

                    state_result = District.query.filter(
                        State.number == state.number).first()

                    if state_result is None:
                        db.session.add(state)
                        db.session.commit()
                    else:
                        state_result.number = state.number
                        state_result.name = state.name
                        state_result.usps_abbreviation = state.usps_abbreviation
                        db.session.commit()

                    dist_result = District.query.filter(
                            District.alpha_num == dist.alpha_num).first()

                    if dist_result is None:
                        db.session.add(dist)
                        db.session.commit()
                    else:
                        set_district(dist_result, dist)
                        db.session.commit()
