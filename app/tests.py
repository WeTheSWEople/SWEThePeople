import unittest
import requests
from app import create_app
app = create_app()
app.app_context().push()
from models import Representative
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


class TestStringMethods(unittest.TestCase):
	def test1(self):
		response = requests.request("GET", url)
		self.assertEqual(response.ok, True)
		print("TEST 1: Site is up: Status code response is OK")

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


if __name__ == '__main__':
	print("\n\n\n##########\tBEGINNING BACKEND UNIT TESTS\t##########\n")
	unittest.main()
