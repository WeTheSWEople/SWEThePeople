import unittest
import requests
import unicodedata
import collections
from app import create_app, db
app = create_app()
app.app_context().push()
from models import *
from flask import jsonify
url = "http://localhost:5000/"
api_url = "http://0.0.0.0:4040/"
live_url = "http://swethepeople.me/"
live_api_url = "http://api.swethepeople.me/"


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
	def test1(self):
		print("**** API Backend Tests ****")
		response = requests.request("GET", url)
		self.assertEqual(response.ok, True)
		print("\nTEST 1: Site is up: Status code response is OK")

	def test2(self):
		response = requests.request("GET", api_url)
		self.assertEqual(response.ok, True)
		print("\nTEST 2: API is up: Status code response is OK")

	def test3(self):
		response = requests.request("GET", api_url + "representative/")
		self.assertEqual(response.ok, True)
		print("\nTEST 3: API is up: Representative response is OK")

	def test4(self):
		response = requests.request("GET", api_url + "representative/A000374")
		self.assertEqual(response.ok, True)
		print("\nTEST 4: API is up: Bioguide Representative response OK")

	def test5(self):
		response = requests.request("GET", api_url + "representative/page/1")
		self.assertEqual(response.ok, True)
		print("\nTEST 5: API is up: Representative Pagination response OK")

	def test6(self):
		response = requests.request("GET", api_url + "representative/")
		result = response.json()
		with app.app_context():
			self.assertEqual(result, [getResponse(rep) for rep in Representative.query.order_by(Representative.bioguide).limit(500).all()])
		print("\nTEST 6: API is up: Representative data consistent with DB data. Response OK")

	def test7(self):
		response = requests.request("GET", api_url + "representative/A000374")
		result = response.json()
		with app.app_context():
			self.assertEqual(result, getResponse(Representative.query.filter(Representative.bioguide == "A000374").first()))
		print("\nTEST 7: API is up: Representative Bioguide data consistent with DB data. Response OK")

	def test8(self):
		response = requests.request("GET", api_url + "representative/page/1")
		result = response.json()
		with app.app_context():
			self.assertEqual(result, [getResponse(rep) for rep in Representative.query.order_by(Representative.bioguide).offset(25).limit(25).all()])
		print("\nTEST 8: API is up: Representative Pagination consistent with DB data. Response OK")

	def test9(self):
		response = requests.request("GET", live_url)
		self.assertEqual(response.ok, True)
		print("\nTEST 9: Live Site is up: Status code response is OK")

	def test_10(self):
		response = requests.request("GET", live_api_url)
		self.assertEqual(response.ok, True)
		print("\nTEST 10: Live API is up: Status code response is OK")

	def test_11(self):
		response = requests.request("GET", live_api_url + "representative/")
		self.assertEqual(response.ok, True)
		print("\nTEST 11: Live API is up: Representative response is OK")

	def test_12(self):
		response = requests.request("GET", live_api_url + "representative/A000374")
		self.assertEqual(response.ok, True)
		print("\nTEST 12: Live API is up: Bioguide Representative response OK")

	def test_13(self):
		response = requests.request("GET", live_api_url + "representative/page/1")
		self.assertEqual(response.ok, True)
		print("\nTEST 13: Live API is up: Representative Pagination response OK")

	def test_14(self):
		response = requests.request("GET", live_api_url + "representative/")
		result = response.json()
		with app.app_context():
			self.assertEqual(result, [getResponse(rep) for rep in Representative.query.order_by(Representative.bioguide).limit(500).all()])
		print("\nTEST 14: Live API is up: Representative data consistent with DB data. Response OK")

	def test_15(self):
		response = requests.request("GET", live_api_url + "representative/A000374")
		result = response.json()
		with app.app_context():
			self.assertEqual(result, getResponse(Representative.query.filter(Representative.bioguide == "A000374").first()))
		print("\nTEST 15: Live API is up: Representative Bioguide data consistent with DB data. Response OK")

	def test_16(self):
		response = requests.request("GET", live_api_url + "representative/page/1")
		result = response.json()
		with app.app_context():
			self.assertEqual(result, [getResponse(rep) for rep in Representative.query.order_by(Representative.bioguide).offset(25).limit(25).all()])
		print("\nTEST 16: Live API is up: Representative Pagination consistent with DB data. Response OK")

	def test_17(self):
		print("\n**** Database Backend Tests ****")
		self.maxDiff = None
		# insert the rep
		Representative.query.filter(Representative.bioguide == "ABC123").delete()
		Bill.query.filter(Bill.number == "A.B.2018").delete()
		db.session.commit()
		rep = Representative(
			bioguide = "ABC123",
			firstname = "Steven",
			lastname = "Austin",
			party_id = 1,
			state = 'TX',
			district = "1",
			twitter = "RepSteven",
			youtube = "StevenChannel",
			office = "111 Congress",
			votes_with_party_pct = 50.0,
			url = "https://test.house.gov",
			image_uri = 'https://rep/john/photo.jpg'
			)
		bill = Bill(
			number = 'A.B.2018',
			short_title = 'Test Bill',
			sponsor_id = "ABC123",
			congressdotgov_url = 'https://test.gov/bill1',
			introduced_date = "2018-06-20",
			latest_major_action = "Move to Senate"
			)
		rep.bills.append(bill)
		db.session.add(rep)
		db.session.commit()

		expected = {
		  "bills": [
		    {
		      "congressdotgov_url": "https://test.gov/bill1", 
		      "introduced_date": "2018-06-20", 
		      "latest_major_action": "Move to Senate", 
		      "number": "A.B.2018", 
		      "short_title": "Test Bill", 
		      "sponsor_id": "ABC123"
		    }
		  ], 
		  "bioguide": "ABC123", 
		  "district": "1", 
		  "firstname": "Steven", 
		  "image_uri": "https://rep/john/photo.jpg", 
		  "lastname": "Austin", 
		  "office": "111 Congress", 
		  "party_id": 1, 
		  "state": "TX", 
		  "twitter": "RepSteven", 
		  "url": "https://test.house.gov", 
		  "votes_with_party_pct": 50.0, 
		  "youtube": "StevenChannel"
		}

		# query the rep
		response = convert(getResponse(Representative.query.filter(Representative.bioguide == "ABC123").first()))
		# autoincremented primary key
		del response['bills'][0]['id']
		self.assertEqual(expected, response)
		
		# delete the rep
		Representative.query.filter(Representative.bioguide == "ABC123").delete()
		Bill.query.filter(Bill.number == "A.B.2018").delete()
		db.session.commit()
		print("\nTEST 17: Representative successfully inserted, queried, and removed from the database")

	def test_18(self):
		self.maxDiff = None
		# insert the rep
		PoliticalParty.query.filter(PoliticalParty.id == 100).delete()
		#PartyColor.query.filter(PartyColor.party_id == 100).delete()
		db.session.commit()
		party = PoliticalParty(
			id = 100,
	        name = "Random Party",
	        path = "random_party",
	        chair = "Steven Austin",
	        formation_date = "January 8, 1828",
	        twitter_handle = "randomparty",
	        youtube = "randomchannel",
	        office = "123 Main St, Austin, TX 12345",
	        website = "https://randomparty.com"
			)
		
		db.session.add(party)
		db.session.commit()

		expected = {
		 "chair": "Steven Austin", 
		 "colors": [], 
		 "formation_date": "January 8, 1828", 
		 "id": 100, 
		 "name": "Random Party", 
		 "office": "123 Main St, Austin, TX 12345", 
		 "path": "random_party", 
		 "representatives": [], 
		 "twitter_handle": "randomparty", 
		 "website": "https://randomparty.com", 
		 "youtube": "randomchannel"
		}

		# query the rep
		response = convert(getResponse(PoliticalParty.query.filter(PoliticalParty.id == 100).first()))
		self.assertEqual(expected, response)
		
		# delete the rep
		PoliticalParty.query.filter(PoliticalParty.id == 100).delete()
		db.session.commit()
		print("\nTEST 18: Political Party successfully inserted, queried, and removed from the database")


	def test_19(self):
		self.maxDiff = None
		# insert the rep
		PartyColor.query.filter(PartyColor.id == 100).delete()
		db.session.commit()
		party_color = PartyColor(
			id = 100,
            party_id = 1,
            color = "Orange"
			)
		
		db.session.add(party_color)
		db.session.commit()

		expected = {
		  "color": "Orange", 
	      "id": 100, 
	      "party_id": 1
		}

		# query the rep
		response = convert(getResponse(PartyColor.query.filter(PartyColor.id == 100).first()))
		self.assertEqual(expected, response)
		
		# delete the rep
		PartyColor.query.filter(PartyColor.id == 100).delete()
		db.session.commit()
		print("\nTEST 19: Party Color successfully inserted, queried, and removed from the database")

	def test_20(self):
		self.maxDiff = None
		# insert the rep
		State.query.filter(State.usps_abbreviation == "XY").delete()
		db.session.commit()
		state = State(
			usps_abbreviation = "XY",
	        number = 55,
	        name = "New State"
		)
		
		db.session.add(state)
		db.session.commit()

		expected = {
		  "usps_abbreviation": "XY",
	      "number": 55,
	      "name": "New State",
	      "districts" : []
		}

		# query the rep
		response = convert(getResponse(State.query.filter(State.usps_abbreviation == "XY").first()))
		self.assertEqual(expected, response)
		
		# delete the rep
		State.query.filter(State.usps_abbreviation == "XY").delete()
		db.session.commit()
		print("\nTEST 20: State successfully inserted, queried, and removed from the database")

# class TestDatabase(unittest.TestCase):
	

if __name__ == '__main__':
	print("\n\n\n##########\tBEGINNING BACKEND UNIT TESTS\t##########\n")
	unittest.main()
