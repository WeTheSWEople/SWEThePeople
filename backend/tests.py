import unittest
import requests
import unicodedata
import collections
import os
#from app import create_app, db
#app = create_app()
#app.app_context().push()
#from models import *
from flask import jsonify
live_url = "http://swethepeople.me/"
live_api_url = "http://api.swethepeople.me/"


# def getResponse(data):
# 	if data is None:
# 		return None
# 	else:
# 		return data.format()

# def convert(data):
# 	if isinstance(data, basestring):
# 		return str(data)
# 	elif isinstance(data, collections.Mapping):
# 		return dict(map(convert, data.iteritems()))
# 	elif isinstance(data, collections.Iterable):
# 		return type(data)(map(convert, data))
# 	else:
# 		return data

# class TestStringMethods(unittest.TestCase):
# 	def test1(self):
# 		response = requests.request("GET", live_url)
# 		self.assertEqual(response.ok, True)
# 		print("\nTEST 1: Live Site is up: Status code response is OK")

# 	def test2(self):
# 		response = requests.request("GET", live_api_url)
# 		self.assertEqual(response.ok, True)
# 		print("\nTEST 2: Live API is up: Status code response is OK")

# 	def test3(self):
# 		response = requests.request("GET", live_api_url + "representative/")
# 		self.assertEqual(response.ok, True)
# 		print("\nTEST 3: Live API is up: Representative response is OK")

# 	def test4(self):
# 		response = requests.request("GET", live_api_url + "representative/A000374")
# 		self.assertEqual(response.ok, True)
# 		print("\nTEST 4: Live API is up: Bioguide Representative response OK")

# 	def test5(self):
# 		response = requests.request("GET", live_api_url + "representative/page/1")
# 		self.assertEqual(response.ok, True)
# 		print("\nTEST 5: Live API is up: Representative Pagination response OK")

# 	def test6(self):
# 		response = requests.request("GET", live_api_url + "representative/")
# 		result = response.json()
# 		with app.app_context():
# 			self.assertEqual(result, [getResponse(rep) for rep in Representative.query.order_by(Representative.bioguide).limit(500).all()])
# 		print("\nTEST 6: Live API is up: Representative data consistent with DB data. Response OK")

# 	def test7(self):
# 		response = requests.request("GET", live_api_url + "representative/A000374")
# 		result = response.json()
# 		with app.app_context():
# 			self.assertEqual(result, getResponse(Representative.query.filter(Representative.bioguide == "A000374").first()))
# 		print("\nTEST 7: Live API is up: Representative Bioguide data consistent with DB data. Response OK")

# 	def test8(self):
# 		response = requests.request("GET", live_api_url + "party/democratic_party")
# 		result = response.json()
# 		with app.app_context():
# 			self.assertEqual(result, getResponse(PoliticalParty.query.filter(PoliticalParty.id == 1).first()))
# 		print("\nTEST 8: Live API is up: Political Party data consistent with DB data. Response OK")

# 	def test9(self):
# 		response = requests.request("GET", live_api_url + "state/AL")
# 		result = response.json()
# 		with app.app_context():
# 			self.assertEqual(result, getResponse(State.query.filter(State.usps_abbreviation == "AL").first()))
# 		print("\nTEST 9: Live API is up: State data consistent with DB data. Response OK")

# 	def test_10(self):
# 		self.maxDiff = None
# 		response = requests.request("GET", live_api_url + "district/AL")
# 		result = response.json()
# 		with app.app_context():
# 			self.assertEqual(result, [getResponse(district) for district in District.query.filter(District.state == "AL").all()])
# 		print("\nTEST 10: Live API is up: District and state data consistent with DB data. Response OK")

# 	def test_11(self):
# 		response = requests.request("GET", live_api_url + "district/AL/1")
# 		result = response.json()
# 		with app.app_context():
# 			self.assertEqual(result, getResponse(District.query.filter(District.state == "AL").filter(District.id == "1").first()))
# 		print("\nTEST 11: Live API is up: Specific District data consistent with DB data. Response OK")

# 	def test_12(self):
# 		response = requests.request("GET", live_api_url + "representative/A0003745")
# 		error_msg = convert(response.json())
# 		self.assertTrue('Error' in error_msg)
# 		self.assertEqual(response.status_code, 404)
# 		print("\nTEST 12: Representative Endpoint: Bad bioguide parameter returns correct error response")

# 	def test_13(self):
# 		response = requests.request("GET", live_api_url + "party/bennys_party_for_heroin")
# 		error_msg = convert(response.json())
# 		self.assertTrue('Error' in error_msg)
# 		self.assertEqual(response.status_code, 404)
# 		print("\nTEST 13: Party Endpoint: Bad party id parameter returns correct error response")

# 	def test_14(self):
# 		response = requests.request("GET", live_api_url + "state/XY")
# 		error_msg = convert(response.json())
# 		self.assertTrue('Error' in error_msg)
# 		self.assertEqual(response.status_code, 404)
# 		print("\nTEST 14: State Endpoint: Bad state abbreviation parameter returns correct error response")

# 	def test_15(self):
# 		response = requests.request("GET", live_api_url + "district/XY")
# 		error_msg = convert(response.json())
# 		self.assertTrue('Error' in error_msg)
# 		self.assertEqual(response.status_code, 404)
# 		print("\nTEST 15: District Endpoint: Bad state abbreviation parameter returns correct error response")

# 	def test_16(self):
# 		response = requests.request("GET", live_api_url + "district/AL/100")
# 		error_msg = convert(response.json())
# 		self.assertTrue('Error' in error_msg)
# 		self.assertEqual(response.status_code, 404)
# 		print("\nTEST 16: District Endpoint: Bad district id parameter returns correct error response")

# 	def test_17(self):
# 		response = requests.request("GET", live_api_url + "district/XY/100")
# 		error_msg = convert(response.json())
# 		self.assertTrue('Error' in error_msg)
# 		self.assertEqual(response.status_code, 404)
# 		print("\nTEST 17: District Endpoint: Bad state abbreviation and district id and parameters returns correct error response")

# 	def test_18(self):
# 		print("\n**** Database Backend Tests ****")
# 		self.maxDiff = None
# 		# insert the rep
# 		Representative.query.filter(Representative.bioguide == "ABC123").delete()
# 		Bill.query.filter(Bill.number == "A.B.2018").delete()
# 		db.session.commit()
# 		rep = Representative(
# 			bioguide = "ABC123",
# 			firstname = "Steven",
# 			lastname = "Austin",
# 			party_id = 1,
# 			state = 'TX',
# 			district = "1",
# 			twitter = "RepSteven",
# 			youtube = "StevenChannel",
# 			office = "111 Congress",
# 			votes_with_party_pct = 50.0,
# 			url = "https://test.house.gov",
# 			image_uri = 'https://rep/john/photo.jpg'
# 			)
# 		bill = Bill(
# 			number = 'A.B.2018',
# 			short_title = 'Test Bill',
# 			sponsor_id = "ABC123",
# 			congressdotgov_url = 'https://test.gov/bill1',
# 			introduced_date = "2018-06-20",
# 			latest_major_action = "Move to Senate"
# 			)
# 		rep.bills.append(bill)
# 		db.session.add(rep)
# 		db.session.commit()

# 		expected = {
# 		  "bills": [
# 			{
# 			  "congressdotgov_url": "https://test.gov/bill1",
# 			  "introduced_date": "2018-06-20",
# 			  "latest_major_action": "Move to Senate",
# 			  "number": "A.B.2018",
# 			  "short_title": "Test Bill",
# 			  "sponsor_id": "ABC123"
# 			}
# 		  ],
# 		  "bioguide": "ABC123",
# 		  "district": "1",
# 		  "firstname": "Steven",
# 		  "image_uri": "https://rep/john/photo.jpg",
# 		  "lastname": "Austin",
# 		  "office": "111 Congress",
# 		  "party_id": 1,
# 		  "state": "TX",
# 		  "twitter": "RepSteven",
# 		  "url": "https://test.house.gov",
# 		  "votes_with_party_pct": 50.0,
# 		  "youtube": "StevenChannel"
# 		}

# 		# query the rep
# 		response = convert(getResponse(Representative.query.filter(Representative.bioguide == "ABC123").first()))
# 		# autoincremented primary key
# 		del response['bills'][0]['id']
# 		self.assertEqual(expected, response)

# 		# delete the rep
# 		Representative.query.filter(Representative.bioguide == "ABC123").delete()
# 		Bill.query.filter(Bill.number == "A.B.2018").delete()
# 		db.session.commit()
# 		print("\nTEST 18: Representative successfully inserted, queried, and removed from the database")

# 	def test_19(self):
# 		self.maxDiff = None
# 		# insert the party
# 		PoliticalParty.query.filter(PoliticalParty.id == 100).delete()
# 		db.session.commit()
# 		party = PoliticalParty(
# 			id = 100,
# 			name = "Random Party",
# 			path = "random_party",
# 			chair = "Steven Austin",
# 			formation_date = "January 8, 1828",
# 			twitter_handle = "randomparty",
# 			youtube = "randomchannel",
# 			office = "123 Main St, Austin, TX 12345",
# 			website = "https://randomparty.com"
# 			)

# 		db.session.add(party)
# 		db.session.commit()

# 		expected = {
# 		 "chair": "Steven Austin",
# 		 "colors": [],
# 		 "formation_date": "January 8, 1828",
# 		 "id": 100,
# 		 "name": "Random Party",
# 		 "office": "123 Main St, Austin, TX 12345",
# 		 "path": "random_party",
# 		 "representatives": [],
# 		 "twitter_handle": "randomparty",
# 		 "website": "https://randomparty.com",
# 		 "youtube": "randomchannel"
# 		}

# 		# query the party
# 		response = convert(getResponse(PoliticalParty.query.filter(PoliticalParty.id == 100).first()))
# 		self.assertEqual(expected, response)

# 		# delete the party
# 		PoliticalParty.query.filter(PoliticalParty.id == 100).delete()
# 		db.session.commit()
# 		print("\nTEST 19: Political Party successfully inserted, queried, and removed from the database")


# 	def test_20(self):
# 		self.maxDiff = None
# 		# insert the party color
# 		PartyColor.query.filter(PartyColor.id == 100).delete()
# 		db.session.commit()
# 		party_color = PartyColor(
# 			id = 100,
# 			party_id = 1,
# 			color = "Orange"
# 			)

# 		db.session.add(party_color)
# 		db.session.commit()

# 		expected = {
# 		  "color": "Orange",
# 		  "id": 100,
# 		  "party_id": 1
# 		}

# 		# query the party color
# 		response = convert(getResponse(PartyColor.query.filter(PartyColor.id == 100).first()))
# 		self.assertEqual(expected, response)

# 		# delete the party color
# 		PartyColor.query.filter(PartyColor.id == 100).delete()
# 		db.session.commit()
# 		print("\nTEST 20: Party Color successfully inserted, queried, and removed from the database")

# 	def test_21(self):
# 		self.maxDiff = None
# 		# insert the state
# 		State.query.filter(State.usps_abbreviation == "XY").delete()
# 		db.session.commit()
# 		state = State(
# 			usps_abbreviation = "XY",
# 			number = 55,
# 			name = "New State"
# 		)

# 		db.session.add(state)
# 		db.session.commit()

# 		expected = {
# 		  "usps_abbreviation": "XY",
# 		  "number": 55,
# 		  "name": "New State",
# 		  "districts" : []
# 		}

# 		# query the state
# 		response = convert(getResponse(State.query.filter(State.usps_abbreviation == "XY").first()))
# 		self.assertEqual(expected, response)

# 		# delete the state
# 		State.query.filter(State.usps_abbreviation == "XY").delete()
# 		db.session.commit()
# 		print("\nTEST 21: State successfully inserted, queried, and removed from the database")

# 	def test_22(self):
# 		self.maxDiff = None
# 		# insert the district
# 		District.query.filter(District.alpha_num == "TX-100").delete()
# 		db.session.commit()
# 		district = District(
# 			alpha_num = "TX" + '-' + str(100),
# 			state = "TX",
# 			id = "100",
# 			representative_id = "G000552",
# 			population = 12345,
# 			median_age = 70.5,
# 			median_age_male = 70.5,
# 			median_age_female = 70.5,
# 			population_male = 12345,
# 			population_white = 12345,
# 			population_black_or_african_american = 12345,
# 			population_american_indian_and_alaska_native = 12345,
# 			population_asian = 12345,
# 			population_native_hawaiian_and_other_pacific_islander = 12345,
# 			population_some_other_race = 12345,
# 			population_two_or_more_races = 12345
# 		)

# 		db.session.add(district)
# 		db.session.commit()

# 		expected = {
# 		  "alpha_num": "TX-100",
# 		  "id": "100",
# 		  "median_age": 70.5,
# 		  "median_age_female": 70.5,
# 		  "median_age_male": 70.5,
# 		  "population": 12345,
# 		  "population_american_indian_and_alaska_native": 12345,
# 		  "population_asian": 12345,
# 		  "population_black_or_african_american": 12345,
# 		  "population_male": 12345,
# 		  "population_native_hawaiian_and_other_pacific_islander": 12345,
# 		  "population_some_other_race": 12345,
# 		  "population_two_or_more_races": 12345,
# 		  "population_white": 12345,
# 		  "representative_id": "G000552",
# 		  "state": "TX"
# 		}

# 		# query the district
# 		response = convert(getResponse(District.query.filter(District.alpha_num == "TX-100").first()))
# 		self.assertEqual(expected, response)

# 		# delete the district
# 		District.query.filter(District.alpha_num == "TX-100").delete()
# 		db.session.commit()
# 		print("\nTEST 22: District successfully inserted, queried, and removed from the database")




if __name__ == '__main__':
	print("ENV VAR: ", os.environ['DB_PASS'])
	print("ENV VAR 2: ", os.environ['HOME'])
	print("ENV VAR 3: ", os.environ['HEELO'])
	print("\n\n\n##########\tBEGINNING BACKEND UNIT TESTS\t##########\n")
	#unittest.main()
