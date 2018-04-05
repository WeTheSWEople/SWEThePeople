import unittest
import requests
import unicodedata
import collections
import os
from app import create_app, db
app = create_app()
app.app_context().push()
from models import *
from flask import jsonify
live_url = "http://swethepeople.me/"
#live_api_url = "http://api.swethepeople.me/"
live_api_url = "http://ec2-18-188-158-73.us-east-2.compute.amazonaws.com/"


def getResponse(data):
	if data is None:
		return None
	else:
		return data.format()

def convert(data):
	if isinstance(data, basestring):
		return str(data)
	elif isinstance(data, collections.Mapping):
		return dict(map(convert, data.iteritems()))
	elif isinstance(data, collections.Iterable):
		return type(data)(map(convert, data))
	else:
		return data

class TestStringMethods(unittest.TestCase):
	# def test1(self):
	# 	response = requests.request("GET", live_url)
	# 	self.assertEqual(response.ok, True)
	# 	print("\nTEST 1: Live Site is up: Status code response is OK")

	# def test2(self):
	# 	response = requests.request("GET", live_api_url)
	# 	self.assertEqual(response.ok, True)
	# 	print("\nTEST 2: Live API is up: Status code response is OK")

	# def test3(self):
	# 	response = requests.request("GET", live_api_url + "representative/")
	# 	self.assertEqual(response.ok, True)
	# 	print("\nTEST 3: Live API is up: Representative response is OK")

	# def test4(self):
	# 	response = requests.request("GET", live_api_url + "representative/A000374")
	# 	self.assertEqual(response.ok, True)
	# 	print("\nTEST 4: Live API is up: Bioguide Representative response OK")

	# def test5(self):
	# 	response = requests.request("GET", live_api_url + "representative/page/1")
	# 	self.assertEqual(response.ok, True)
	# 	print("\nTEST 5: Live API is up: Representative Pagination response OK")

	# def test6(self):
	# 	response = requests.request("GET", live_api_url + "representative/")
	# 	result = response.json()
	# 	with app.app_context():
	# 		self.assertEqual(result, [getResponse(rep) for rep in Representative.query.order_by(Representative.bioguide).limit(500).all()])
	# 	print("\nTEST 6: Live API is up: Representative data consistent with DB data. Response OK")

	# def test7(self):
	# 	self.maxDiff = None
	# 	response = requests.request("GET", live_api_url + "representative/A000374")
	# 	result = response.json()
	# 	#print(getResponse(Representative.query.filter(Representative.bioguide == "A000374").first()))
	# 	with app.app_context():
	# 		self.assertEqual(result, getResponse(Representative.query.filter(Representative.bioguide == "A000374").first()))
	# 	print("\nTEST 7: Live API is up: Representative Bioguide data consistent with DB data. Response OK")

	# def test8(self):
	# 	response = requests.request("GET", live_api_url + "party/democratic_party")
	# 	result = response.json()
	# 	with app.app_context():
	# 		self.assertEqual(result, getResponse(PoliticalParty.query.filter(PoliticalParty.id == 1).first()))
	# 	print("\nTEST 8: Live API is up: Political Party data consistent with DB data. Response OK")

	# def test9(self):
	# 	self.maxDiff = None
	# 	response = requests.request("GET", live_api_url + "state/AL")
	# 	result = response.json()
	# 	with app.app_context():
	# 		self.assertEqual(result, getResponse(State.query.filter(State.usps_abbreviation == "AL").first()))
	# 	print("\nTEST 9: Live API is up: State data consistent with DB data. Response OK")

	# def test_10(self):
	# 	self.maxDiff = None
	# 	response = requests.request("GET", live_api_url + "district/AL")
	# 	result = response.json()
	# 	with app.app_context():
	# 		self.assertEqual(result, [getResponse(district) for district in District.query.filter(District.state == "AL").all()])
	# 	print("\nTEST 10: Live API is up: District and state data consistent with DB data. Response OK")

	# def test_11(self):
	# 	response = requests.request("GET", live_api_url + "district/AL/1")
	# 	result = response.json()
	# 	with app.app_context():
	# 		self.assertEqual(result, getResponse(District.query.filter(District.state == "AL").filter(District.id == "1").first()))
	# 	print("\nTEST 11: Live API is up: Specific District data consistent with DB data. Response OK")

	# def test_12(self):
	# 	response = requests.request("GET", live_api_url + "representative/A0003745")
	# 	error_msg = convert(response.json())
	# 	self.assertTrue('Error' in error_msg)
	# 	self.assertEqual(response.status_code, 404)
	# 	print("\nTEST 12: Representative Endpoint: Bad bioguide parameter returns correct error response")

	# def test_13(self):
	# 	response = requests.request("GET", live_api_url + "party/bennys_party_for_heroin")
	# 	error_msg = convert(response.json())
	# 	self.assertTrue('Error' in error_msg)
	# 	self.assertEqual(response.status_code, 404)
	# 	print("\nTEST 13: Party Endpoint: Bad party id parameter returns correct error response")

	# def test_14(self):
	# 	response = requests.request("GET", live_api_url + "state/XY")
	# 	error_msg = convert(response.json())
	# 	self.assertTrue('Error' in error_msg)
	# 	self.assertEqual(response.status_code, 404)
	# 	print("\nTEST 14: State Endpoint: Bad state abbreviation parameter returns correct error response")

	# def test_15(self):
	# 	response = requests.request("GET", live_api_url + "district/XY")
	# 	error_msg = convert(response.json())
	# 	self.assertTrue('Error' in error_msg)
	# 	self.assertEqual(response.status_code, 404)
	# 	print("\nTEST 15: District Endpoint: Bad state abbreviation parameter returns correct error response")

	# def test_16(self):
	# 	response = requests.request("GET", live_api_url + "district/AL/100")
	# 	error_msg = convert(response.json())
	# 	self.assertTrue('Error' in error_msg)
	# 	self.assertEqual(response.status_code, 404)
	# 	print("\nTEST 16: District Endpoint: Bad district id parameter returns correct error response")

	# def test_17(self):
	# 	response = requests.request("GET", live_api_url + "district/XY/100")
	# 	error_msg = convert(response.json())
	# 	self.assertTrue('Error' in error_msg)
	# 	self.assertEqual(response.status_code, 404)
	# 	print("\nTEST 17: District Endpoint: Bad state abbreviation and district id and parameters returns correct error response")

	# def test_18(self):
	# 	print("\n**** Database Backend Tests ****")
	# 	self.maxDiff = None
	# 	# insert the rep
	# 	Representative.query.filter(Representative.bioguide == "ABC123").delete()
	# 	Bill.query.filter(Bill.number == "A.B.2018").delete()
	# 	db.session.commit()
	# 	rep = Representative(
	# 		bioguide = "ABC123",
	# 		firstname = "Steven",
	# 		lastname = "Austin",
	# 		party_id = 1,
	# 		state = 'TX',
	# 		district = "1",
	# 		twitter = "RepSteven",
	# 		youtube = "StevenChannel",
	# 		office = "111 Congress",
	# 		votes_with_party_pct = 50.0,
	# 		url = "https://test.house.gov",
	# 		image_uri = 'https://rep/john/photo.jpg'
	# 		)
	# 	bill = Bill(
	# 		number = 'A.B.2018',
	# 		short_title = 'Test Bill',
	# 		sponsor_id = "ABC123",
	# 		congressdotgov_url = 'https://test.gov/bill1',
	# 		introduced_date = "2018-06-20",
	# 		latest_major_action = "Move to Senate"
	# 		)
	# 	rep.bills.append(bill)
	# 	db.session.add(rep)
	# 	db.session.commit()

	# 	expected = {
	# 	  "bills": [
	# 		{
	# 		  "congressdotgov_url": "https://test.gov/bill1",
	# 		  "introduced_date": "2018-06-20",
	# 		  "latest_major_action": "Move to Senate",
	# 		  "number": "A.B.2018",
	# 		  "short_title": "Test Bill",
	# 		  "sponsor_id": "ABC123"
	# 		}
	# 	  ],
	# 	  "bioguide": "ABC123",
	# 	  "district": "1",
	# 	  "firstname": "Steven",
	# 	  "image_uri": "https://rep/john/photo.jpg",
	# 	  "lastname": "Austin",
	# 	  "office": "111 Congress",
	# 	  "party_id": 1,
	# 	  "state": "TX",
	# 	  "twitter": "RepSteven",
	# 	  "url": "https://test.house.gov",
	# 	  "votes_with_party_pct": 50.0,
	# 	  "youtube": "StevenChannel"
	# 	}

	# 	# query the rep
	# 	response = convert(getResponse(Representative.query.filter(Representative.bioguide == "ABC123").first()))
	# 	# autoincremented primary key
	# 	del response['bills'][0]['id']
	# 	self.assertEqual(expected, response)

	# 	# delete the rep
	# 	Representative.query.filter(Representative.bioguide == "ABC123").delete()
	# 	Bill.query.filter(Bill.number == "A.B.2018").delete()
	# 	db.session.commit()
	# 	print("\nTEST 18: Representative successfully inserted, queried, and removed from the database")

	# def test_19(self):
	# 	self.maxDiff = None
	# 	# insert the party
	# 	PoliticalParty.query.filter(PoliticalParty.id == 100).delete()
	# 	db.session.commit()
	# 	party = PoliticalParty(
	# 		id = 100,
	# 		name = "Random Party",
	# 		path = "random_party",
	# 		chair = "Steven Austin",
	# 		formation_date = "January 8, 1828",
	# 		twitter_handle = "randomparty",
	# 		youtube = "randomchannel",
	# 		office = "123 Main St, Austin, TX 12345",
	# 		website = "https://randomparty.com"
	# 		)

	# 	db.session.add(party)
	# 	db.session.commit()

	# 	expected = {
	# 	 "chair": "Steven Austin",
	# 	 "colors": [],
	# 	 "formation_date": "January 8, 1828",
	# 	 "id": 100,
	# 	 "name": "Random Party",
	# 	 "office": "123 Main St, Austin, TX 12345",
	# 	 "path": "random_party",
	# 	 "representatives": [],
	# 	 "twitter_handle": "randomparty",
	# 	 "website": "https://randomparty.com",
	# 	 "youtube": "randomchannel"
	# 	}

	# 	# query the party
	# 	response = convert(getResponse(PoliticalParty.query.filter(PoliticalParty.id == 100).first()))
	# 	self.assertEqual(expected, response)

	# 	# delete the party
	# 	PoliticalParty.query.filter(PoliticalParty.id == 100).delete()
	# 	db.session.commit()
	# 	print("\nTEST 19: Political Party successfully inserted, queried, and removed from the database")


	# def test_20(self):
	# 	self.maxDiff = None
	# 	# insert the party color
	# 	PartyColor.query.filter(PartyColor.id == 100).delete()
	# 	db.session.commit()
	# 	party_color = PartyColor(
	# 		id = 100,
	# 		party_id = 1,
	# 		color = "Orange"
	# 		)

	# 	db.session.add(party_color)
	# 	db.session.commit()

	# 	expected = {
	# 	  "color": "Orange",
	# 	  "id": 100,
	# 	  "party_id": 1
	# 	}

	# 	# query the party color
	# 	response = convert(getResponse(PartyColor.query.filter(PartyColor.id == 100).first()))
	# 	self.assertEqual(expected, response)

	# 	# delete the party color
	# 	PartyColor.query.filter(PartyColor.id == 100).delete()
	# 	db.session.commit()
	# 	print("\nTEST 20: Party Color successfully inserted, queried, and removed from the database")

	# def test_21(self):
	# 	self.maxDiff = None
	# 	# insert the state
	# 	State.query.filter(State.usps_abbreviation == "XY").delete()
	# 	db.session.commit()
	# 	state = State(
	# 		usps_abbreviation = "XY",
	# 		number = 55,
	# 		name = "New State"
	# 	)

	# 	db.session.add(state)
	# 	db.session.commit()

	# 	expected = {
	# 	  "usps_abbreviation": "XY",
	# 	  "number": 55,
	# 	  "name": "New State",
	# 	  "districts" : []
	# 	}

	# 	# query the state
	# 	response = convert(getResponse(State.query.filter(State.usps_abbreviation == "XY").first()))
	# 	self.assertEqual(expected, response)

	# 	# delete the state
	# 	State.query.filter(State.usps_abbreviation == "XY").delete()
	# 	db.session.commit()
	# 	print("\nTEST 21: State successfully inserted, queried, and removed from the database")

	# def test_22(self):
	# 	self.maxDiff = None
	# 	# insert the district
	# 	District.query.filter(District.alpha_num == "TX-100").delete()
	# 	db.session.commit()
	# 	district = District(
	# 		alpha_num = "TX" + '-' + str(100),
	# 		state = "TX",
	# 		id = "100",
	# 		representative_id = "G000552",
	# 		population = 12345,
	# 		median_age = 70.5,
	# 		median_age_male = 70.5,
	# 		median_age_female = 70.5,
	# 		population_male = 12345,
	# 		population_white = 12345,
	# 		population_black_or_african_american = 12345,
	# 		population_american_indian_and_alaska_native = 12345,
	# 		population_asian = 12345,
	# 		population_native_hawaiian_and_other_pacific_islander = 12345,
	# 		population_some_other_race = 12345,
	# 		population_two_or_more_races = 12345
	# 	)

	# 	db.session.add(district)
	# 	db.session.commit()

	# 	expected = {
	# 	  "alpha_num": "TX-100",
	# 	  "id": "100",
	# 	  "median_age": 70.5,
	# 	  "median_age_female": 70.5,
	# 	  "median_age_male": 70.5,
	# 	  "population": 12345,
	# 	  "population_american_indian_and_alaska_native": 12345,
	# 	  "population_asian": 12345,
	# 	  "population_black_or_african_american": 12345,
	# 	  "population_male": 12345,
	# 	  "population_native_hawaiian_and_other_pacific_islander": 12345,
	# 	  "population_some_other_race": 12345,
	# 	  "population_two_or_more_races": 12345,
	# 	  "population_white": 12345,
	# 	  "representative_id": "G000552",
	# 	  "state": "TX"
	# 	}

	# 	# query the district
	# 	response = convert(getResponse(District.query.filter(District.alpha_num == "TX-100").first()))
	# 	self.assertEqual(expected, response)

	# 	# delete the district
	# 	District.query.filter(District.alpha_num == "TX-100").delete()
	# 	db.session.commit()
	# 	print("\nTEST 22: District successfully inserted, queried, and removed from the database")

	# def test_23(self):
	# 	self.maxDiff = None
	# 	# insert the district
	# 	expected = {
	# 	    "bills": [
	# 	      {
	# 	        "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-bill/4940", 
	# 	        "id": 1197, 
	# 	        "introduced_date": "2018-02-06", 
	# 	        "latest_major_action": "Referred to the Subcommittee on Biotechnology, Horticulture, and Research.", 
	# 	        "number": "H.R.4940", 
	# 	        "short_title": "Border and Port Security Act", 
	# 	        "sponsor_id": "V000132"
	# 	      }, 
	# 	      {
	# 	        "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-bill/4578", 
	# 	        "id": 1198, 
	# 	        "introduced_date": "2017-12-06", 
	# 	        "latest_major_action": "Received in the Senate and Read twice and referred to the Committee on Homeland Security and Governmental Affairs.", 
	# 	        "number": "H.R.4578", 
	# 	        "short_title": "Counter Terrorist Network Act", 
	# 	        "sponsor_id": "V000132"
	# 	      }, 
	# 	      {
	# 	        "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-bill/3375", 
	# 	        "id": 1199, 
	# 	        "introduced_date": "2017-07-24", 
	# 	        "latest_major_action": "Referred to the Subcommittee on Economic Development, Public Buildings and Emergency Management.", 
	# 	        "number": "H.R.3375", 
	# 	        "short_title": "Javier Vega, Jr. Memorial Act of 2017", 
	# 	        "sponsor_id": "V000132"
	# 	      }
	# 	    ], 
	# 	    "bioguide": "V000132", 
	# 	    "district": "34", 
	# 	    "firstname": "Filemon", 
	# 	    "image_uri": "https://theunitedstates.io/images/congress/225x275/V000132.jpg", 
	# 	    "lastname": "Vela", 
	# 	    "office": "437 Cannon House Office Building", 
	# 	    "party_id": 1, 
	# 	    "state": "TX", 
	# 	    "twitter": "RepFilemonVela", 
	# 	    "url": "https://vela.house.gov", 
	# 	    "votes_with_party_pct": 89.38, 
	# 	    "youtube": None
	#   	}

	# 	response = requests.request("GET", live_api_url + 'representative/filter?filter={"state":"TX","party_id":"1","last_name":"D-Z","votes_pct":"30-90","order_by":"last_desc"}')
	# 	result = response.json()
	# 	with app.app_context():
	# 	 	self.assertEqual(result[0], expected)
	# 	print("\nTEST 23: Filtering API: Representative - filter by state, party, lastname, votes_pct, order by lastname - data consistent")

	# def test_24(self):
	# 	self.maxDiff = None
	# 	# insert the district
	# 	expected = {
	# 	    "bills": [
	# 	      {
	# 	        "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-bill/4178", 
	# 	        "id": 22, 
	# 	        "introduced_date": "2017-10-31", 
	# 	        "latest_major_action": "Sponsor introductory remarks on measure. (CR H8304)", 
	# 	        "number": "H.R.4178", 
	# 	        "short_title": "HEART Act", 
	# 	        "sponsor_id": "A000375"
	# 	      }, 
	# 	      {
	# 	        "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-bill/3561", 
	# 	        "id": 23, 
	# 	        "introduced_date": "2017-07-28", 
	# 	        "latest_major_action": "Ordered to be Reported in the Nature of a Substitute by Voice Vote.", 
	# 	        "number": "H.R.3561", 
	# 	        "short_title": "To amend title 38, United States Code, to permit appraisers approved by the Secretary of Veterans Affairs to make appraisals for purposes of chapter 37 of such title based on inspections performed by third parties.", 
	# 	        "sponsor_id": "A000375"
	# 	      }, 
	# 	      {
	# 	        "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-bill/3562", 
	# 	        "id": 24, 
	# 	        "introduced_date": "2017-07-28", 
	# 	        "latest_major_action": "Received in the Senate and Read twice and referred to the Committee on Veterans&#39; Affairs.", 
	# 	        "number": "H.R.3562", 
	# 	        "short_title": "To amend title 38, United States Code, to authorize the Secretary of Veterans Affairs to furnish assistance for adaptations of residences of veterans in rehabilitation programs under chapter 31 of such title, and for other purposes.", 
	# 	        "sponsor_id": "A000375"
	# 	      }
	# 	    ], 
	# 	    "bioguide": "A000375", 
	# 	    "district": "19", 
	# 	    "firstname": "Jodey", 
	# 	    "image_uri": "https://theunitedstates.io/images/congress/225x275/A000375.jpg", 
	# 	    "lastname": "Arrington", 
	# 	    "office": "1029 Longworth House Office Building", 
	# 	    "party_id": 2, 
	# 	    "state": "TX", 
	# 	    "twitter": "RepArrington", 
	# 	    "url": "https://arrington.house.gov", 
	# 	    "votes_with_party_pct": 98.44, 
	# 	    "youtube": None
	#   	}
	# 	response = requests.request("GET", live_api_url + 'representative/filter?filter={"state":"TX"}')
	# 	result = response.json()
	# 	with app.app_context():
	# 		self.assertEqual(result[0], expected)
	# 	print("\nTEST 24: Filtering API: Representative - filter by state  - data consistent")

	# def test_25(self):
	# 	self.maxDiff = None
	# 	# insert the district
	# 	expected = {
	# 	    "bills": [
	# 	      {
	# 	        "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-bill/5309", 
	# 	        "id": 4, 
	# 	        "introduced_date": "2018-03-15", 
	# 	        "latest_major_action": "Referred to the House Committee on Agriculture.", 
	# 	        "number": "H.R.5309", 
	# 	        "short_title": "To amend the Second Morrill Act to authorize the transmission to Congress of annual reports prepared by colleges endowed under such Act.", 
	# 	        "sponsor_id": "A000370"
	# 	      }, 
	# 	      {
	# 	        "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-resolution/746", 
	# 	        "id": 5, 
	# 	        "introduced_date": "2018-02-23", 
	# 	        "latest_major_action": "Referred to the Committee on Science, Space, and Technology, and in addition to the Committee on Education and the Workforce, for a period to be subsequently determined by the Speaker, in each case for consideration of such provisions as fall within the jurisdiction of the committee concerned.", 
	# 	        "number": "H.RES.746", 
	# 	        "short_title": "Supporting the goal and ideal of increasing the number of African American women and girls in the engineering profession.", 
	# 	        "sponsor_id": "A000370"
	# 	      }, 
	# 	      {
	# 	        "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-bill/4984", 
	# 	        "id": 6, 
	# 	        "introduced_date": "2018-02-08", 
	# 	        "latest_major_action": "Referred to the Subcommittee on Biotechnology, Horticulture, and Research.", 
	# 	        "number": "H.R.4984", 
	# 	        "short_title": "Carryover Equity Act", 
	# 	        "sponsor_id": "A000370"
	# 	      }
	# 	    ], 
	# 	    "bioguide": "A000370", 
	# 	    "district": "12", 
	# 	    "firstname": "Alma", 
	# 	    "image_uri": "https://theunitedstates.io/images/congress/225x275/A000370.jpg", 
	# 	    "lastname": "Adams", 
	# 	    "office": "222 Cannon House Office Building", 
	# 	    "party_id": 1, 
	# 	    "state": "NC", 
	# 	    "twitter": "RepAdams", 
	# 	    "url": "https://adams.house.gov", 
	# 	    "votes_with_party_pct": 95.74, 
	# 	    "youtube": None
	# 	}
	# 	response = requests.request("GET", live_api_url + 'representative/filter?filter={"party_id":"1"}')
	# 	result = response.json()
	# 	with app.app_context():
	# 		self.assertEqual(result[0], expected)
	# 	print("\nTEST 25: Filtering API: Representative - filter by party  - data consistent")

	# def test_26(self):
	# 	self.maxDiff = None
	# 	# insert the district
	# 	expected = {
	# 		"bills": [
	# 	      {
	# 	        "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-bill/5037", 
	# 	        "id": 744, 
	# 	        "introduced_date": "2018-02-15", 
	# 	        "latest_major_action": "Referred to the House Committee on Financial Services.", 
	# 	        "number": "H.R.5037", 
	# 	        "short_title": "Securities Fraud Act of 2018", 
	# 	        "sponsor_id": "M001193"
	# 	      }, 
	# 	      {
	# 	        "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-bill/4780", 
	# 	        "id": 745, 
	# 	        "introduced_date": "2018-01-11", 
	# 	        "latest_major_action": "Referred to the House Committee on Ways and Means.", 
	# 	        "number": "H.R.4780", 
	# 	        "short_title": "Transparency for Taxpayers Act", 
	# 	        "sponsor_id": "M001193"
	# 	      }, 
	# 	      {
	# 	        "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-bill/4597", 
	# 	        "id": 746, 
	# 	        "introduced_date": "2017-12-07", 
	# 	        "latest_major_action": "Referred to the House Committee on Education and the Workforce.", 
	# 	        "number": "H.R.4597", 
	# 	        "short_title": "College Loan Deferment for Recovery Act", 
	# 	        "sponsor_id": "M001193"
	# 	      }
	# 	    ], 
	# 	    "bioguide": "M001193", 
	# 	    "district": "3", 
	# 	    "firstname": "Tom", 
	# 	    "image_uri": "https://theunitedstates.io/images/congress/225x275/M001193.jpg", 
	# 	    "lastname": "MacArthur", 
	# 	    "office": "506 Cannon House Office Building", 
	# 	    "party_id": 2, 
	# 	    "state": "NJ", 
	# 	    "twitter": "RepTomMacArthur", 
	# 	    "url": "https://macarthur.house.gov", 
	# 	    "votes_with_party_pct": 89.16, 
	# 	    "youtube": None    
	# 	}
	# 	response = requests.request("GET", live_api_url + 'representative/filter?filter={"last_name":"M-Z"}')
	# 	result = response.json()
	# 	with app.app_context():
	# 		self.assertEqual(result[0], expected)
	# 	print("\nTEST 26: Filtering API: Representative - filter by last name  - data consistent")


	# def test_27(self):
	# 	self.maxDiff = None
	# 	# insert the district
	# 	expected = {
	# 	    "bills": [
	# 	      {
	# 	        "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-bill/5065", 
	# 	        "id": 1284, 
	# 	        "introduced_date": "2018-02-15", 
	# 	        "latest_major_action": "Referred to the Subcommittee on Immigration and Border Security.", 
	# 	        "number": "H.R.5065", 
	# 	        "short_title": "Protecting Our Communities from Gang Violence Act of 2018", 
	# 	        "sponsor_id": "Z000017"
	# 	      }, 
	# 	      {
	# 	        "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-bill/4996", 
	# 	        "id": 1285, 
	# 	        "introduced_date": "2018-02-08", 
	# 	        "latest_major_action": "Referred to the House Committee on the Judiciary.", 
	# 	        "number": "H.R.4996", 
	# 	        "short_title": "Protecting Our Communities from Gang Violence Act of 2018", 
	# 	        "sponsor_id": "Z000017"
	# 	      }, 
	# 	      {
	# 	        "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-resolution/718", 
	# 	        "id": 1286, 
	# 	        "introduced_date": "2018-01-29", 
	# 	        "latest_major_action": "Referred to the House Committee on Foreign Affairs.", 
	# 	        "number": "H.RES.718", 
	# 	        "short_title": "Condemning the actions taken by the Government of the Republic of Cameroon against Patrice Nganang and others, and for other purposes.", 
	# 	        "sponsor_id": "Z000017"
	# 	      }
	# 	    ], 
	# 	    "bioguide": "Z000017", 
	# 	    "district": "1", 
	# 	    "firstname": "Lee", 
	# 	    "image_uri": "https://theunitedstates.io/images/congress/225x275/Z000017.jpg", 
	# 	    "lastname": "Zeldin", 
	# 	    "office": "1517 Longworth House Office Building", 
	# 	    "party_id": 2, 
	# 	    "state": "NY", 
	# 	    "twitter": "RepLeeZeldin", 
	# 	    "url": "https://zeldin.house.gov", 
	# 	    "votes_with_party_pct": 93.65, 
	# 	    "youtube": None
	#   	}
	# 	response = requests.request("GET", live_api_url + 'representative/filter?filter={"order_by":"last_desc"}')
	# 	result = response.json()
	# 	with app.app_context():
	# 		self.assertEqual(result[0], expected)
	# 	print("\nTEST 27: Filtering API: Representative - sort by last name  - data consistent")

	# def test_28(self):
	# 	self.maxDiff = None
	# 	# insert the district
	# 	expected = {
 #  			"Error": "Filter Query Invalid"
	# 	}
	  	
	# 	response = requests.request("GET", live_api_url + 'representative/filter?filter')
	# 	result = response.json()
	# 	with app.app_context():
	# 		self.assertEqual(result, expected)
	# 	print("\nTEST 28: Filtering API: Representative - Bad Filter Query  - Response OK")

	# def test_29(self):
	# 	self.maxDiff = None
	# 	# insert the district
	# 	expected = [
	# 		{
	# 		    "chair": "Frank Fluckiger", 
	# 		    "colors": [
	# 		      {
	# 		        "color": "Red", 
	# 		        "id": 6, 
	# 		        "party_id": 14
	# 		      }, 
	# 		      {
	# 		        "color": "White", 
	# 		        "id": 7, 
	# 		        "party_id": 14
	# 		      }, 
	# 		      {
	# 		        "color": "Blue", 
	# 		        "id": 8, 
	# 		        "party_id": 14
	# 		      }, 
	# 		      {
	# 		        "color": "Purple", 
	# 		        "id": 9, 
	# 		        "party_id": 14
	# 		      }
	# 		    ], 
	# 		    "formation_date": "1991", 
	# 		    "id": 14, 
	# 		    "name": "Constitution Party", 
	# 		    "office": "Lancaster, Pennsylvania 17608", 
	# 		    "path": "constitution_party", 
	# 		    "representatives": [], 
	# 		    "twitter_handle": "cnstitutionprty", 
	# 		    "website": "constitutionparty.com", 
	# 		    "youtube": "ConstitutionParty"
	# 		  }, 
	# 		  {
	# 		    "chair": "", 
	# 		    "colors": [
	# 		      {
	# 		        "color": "Red", 
	# 		        "id": 19, 
	# 		        "party_id": 17
	# 		      }, 
	# 		      {
	# 		        "color": "White", 
	# 		        "id": 20, 
	# 		        "party_id": 17
	# 		      }, 
	# 		      {
	# 		        "color": "Blue", 
	# 		        "id": 21, 
	# 		        "party_id": 17
	# 		      }
	# 		    ], 
	# 		    "formation_date": "2009", 
	# 		    "id": 17, 
	# 		    "name": "Humane Party", 
	# 		    "office": "PO Box 83, Gilbertsville, Pennsylvania 19525-8500", 
	# 		    "path": "humane_party", 
	# 		    "representatives": [], 
	# 		    "twitter_handle": "humaneparty", 
	# 		    "website": "humaneparty.org", 
	# 		    "youtube": "Humane Party"
	# 		  }, 
	# 		  {
	# 		    "chair": "Bill C. Merrell", 
	# 		    "colors": [
	# 		      {
	# 		        "color": "Red", 
	# 		        "id": 61, 
	# 		        "party_id": 28
	# 		      }, 
	# 		      {
	# 		        "color": "White", 
	# 		        "id": 62, 
	# 		        "party_id": 28
	# 		      }, 
	# 		      {
	# 		        "color": "Blue", 
	# 		        "id": 63, 
	# 		        "party_id": 28
	# 		      }
	# 		    ], 
	# 		    "formation_date": "1995", 
	# 		    "id": 28, 
	# 		    "name": "Reform Party", 
	# 		    "office": "PO Box 660675 #3995 Dallas, Texas 75266-0675", 
	# 		    "path": "reform_party", 
	# 		    "representatives": [], 
	# 		    "twitter_handle": "ReformParty", 
	# 		    "website": "reformparty.org", 
	# 		    "youtube": "ReformPartyUSA"
	# 		  }, 
	# 		  {
	# 		    "chair": "Jeff Mackler", 
	# 		    "colors": [
	# 		      {
	# 		        "color": "Red", 
	# 		        "id": 36, 
	# 		        "party_id": 29
	# 		      }, 
	# 		      {
	# 		        "color": "White", 
	# 		        "id": 37, 
	# 		        "party_id": 29
	# 		      }, 
	# 		      {
	# 		        "color": "Black", 
	# 		        "id": 38, 
	# 		        "party_id": 29
	# 		      }
	# 		    ], 
	# 		    "formation_date": "1983", 
	# 		    "id": 29, 
	# 		    "name": "Socialist Action Party", 
	# 		    "office": "", 
	# 		    "path": "socialist_action_party", 
	# 		    "representatives": [], 
	# 		    "twitter_handle": "SocialistActUS", 
	# 		    "website": "socialistaction.org", 
	# 		    "youtube": "SocialistActionCT"
 #  			}
	# 	]
	# 	response = requests.request("GET", live_api_url + 'party/filter?filter={"social":"Y","color":"white","date":"1700-2018","name":"A-Z"}')
	# 	result = response.json()
	# 	with app.app_context():
	# 		self.assertEqual(result, expected)
	# 	print("\nTEST 29: Filtering API: Party - filter by social media, party color, formation date, party name - data consistent")

	# def test_30(self):
	# 	self.maxDiff = None
	# 	# insert the district
	# 	expected = {
	# 	    "chair": "William Daniel Johnson", 
	# 	    "colors": [], 
	# 	    "formation_date": "January 5, 2010", 
	# 	    "id": 4, 
	# 	    "name": "American Freedom Party", 
	# 	    "office": "2753 Broadway Ste 245, New York City, New York 10025", 
	# 	    "path": "american_freedom_party", 
	# 	    "representatives": [], 
	# 	    "twitter_handle": "AmFreedoms", 
	# 	    "website": "theamericanfreedomparty.us", 
	# 	    "youtube": "American3P"
 #  		}
	# 	response = requests.request("GET", live_api_url + 'party/filter?filter={"order_by":"chair_name_desc"}')
	# 	result = response.json()
	# 	with app.app_context():
	# 		self.assertEqual(result[0], expected)
	# 	print("\nTEST 30: Filtering API: Party - sort by chair name - data consistent")

	# def test_31(self):
	# 	self.maxDiff = None
	# 	# insert the district
	# 	expected = {
 #  			"Error": "Filter Query Invalid"
	# 	}
	# 	response = requests.request("GET", live_api_url + 'party/filter?filter')
	# 	result = response.json()
	# 	with app.app_context():
	# 		self.assertEqual(result, expected)
	# 	print("\nTEST 31: Filtering API: Party - Bad Filter Query  - Response OK")

	def test_32(self):
		self.maxDiff = None
		# insert the district
		expected = {
		    "alpha_num": "TX-1", 
		    "id": "1", 
		    "median_age": 36.8, 
		    "median_age_female": 38.8, 
		    "median_age_male": 35.6, 
		    "population": 717735, 
		    "population_american_indian_and_alaska_native": None, 
		    "population_asian": None, 
		    "population_black_or_african_american": 129794, 
		    "population_male": 350089, 
		    "population_native_hawaiian_and_other_pacific_islander": None, 
		    "population_some_other_race": 16021, 
		    "population_two_or_more_races": 11047, 
		    "population_white": 548138, 
		    "representative_id": "G000552", 
		    "state": "TX"
		}
		response = requests.request("GET", live_api_url + 'district/filter?filter={"state":"TX","population":"1-750000","median_age":"1-100"}')
		result = response.json()
		with app.app_context():
			self.assertEqual(result[0], expected)
		print("\nTEST 32: Filtering API: District - filter by state, population, and median age - data consistent")

	def test_33(self):
		self.maxDiff = None
		# insert the district
		expected = {
			"alpha_num": "MT-At-Large", 
		    "id": "At-Large", 
		    "median_age": 40.1, 
		    "median_age_female": 41.3, 
		    "median_age_male": 38.9, 
		    "population": 1042520, 
		    "population_american_indian_and_alaska_native": 66231, 
		    "population_asian": 8432, 
		    "population_black_or_african_american": None, 
		    "population_male": 526023, 
		    "population_native_hawaiian_and_other_pacific_islander": None, 
		    "population_some_other_race": None, 
		    "population_two_or_more_races": 32218, 
		    "population_white": 927374, 
		    "representative_id": "G000584", 
		    "state": "MT"
		}
		response = requests.request("GET", live_api_url + 'district/filter?filter={"order_by":"population_desc"}')
		result = response.json()
		with app.app_context():
			self.assertEqual(result[0], expected)
		print("\nTEST 33: Filtering API: District - sort by population - data consistent")

	def test_34(self):
		self.maxDiff = None
		# insert the district
		expected = {
  			"Error": "Filter Query Invalid"
		}
		response = requests.request("GET", live_api_url + 'district/filter?filter')
		result = response.json()
		with app.app_context():
			self.assertEqual(result, expected)
		print("\nTEST 34: Filtering API: District - Bad Filter Query  - Response OK")

	def test_35(self):
		self.maxDiff = None
		# insert the district
		expected = {
		  "districts": [], 
		  "parties": [], 
		  "rank": 0, 
		  "reps": []
		}
		response = requests.request("GET", live_api_url + 'search/?query=random')
		result = response.json()
		with app.app_context():
			self.assertEqual(result, expected)
		print("\nTEST 35: Searching API: searching 'random' keyword  - search results consistent")

	# def test_35(self):
	# 	self.maxDiff = None
	# 	# insert the district
	# 	expected = {
	# 	  "districts": [], 
	# 	  "parties": [], 
	# 	  "rank": 0, 
	# 	  "reps": []
	# 	}
	# 	response = requests.request("GET", live_api_url + 'search/?query=random')
	# 	result = response.json()
	# 	with app.app_context():
	# 		self.assertEqual(result, expected)
	# 	print("\nTEST 35: Searching API: searching 'paul' keyword  - search results consistent")






if __name__ == '__main__':
	print("\n\n\n##########\tBEGINNING BACKEND UNIT TESTS\t##########\n")
	unittest.main()
