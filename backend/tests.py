import collections
import json
import re
import unittest
from app import create_app, db # noqa
import requests # noqa

app = create_app()
app.app_context().push()
from models import * # noqa
live_url = "http://swethepeople.me/"
live_api_url = "http://ec2-18-188-158-73.us-east-2.compute.amazonaws.com/"


def removeunicode(text):
    text = re.sub(r'\\[u]\S\S\S\S[s]', "", text)
    text = re.sub(r'\\[u]\S\S\S\S', "", text)
    return text


def get_response(data):
    if data is None:
        return None
    else:
        return data.format()


def convert(data):
    if isinstance(data, basestring):
        return data.encode('ascii', 'ignore').decode('ascii')
    elif isinstance(data, collections.Mapping):
        return dict(map(convert, data.iteritems()))
    elif isinstance(data, collections.Iterable):
        return type(data)(map(convert, data))
    else:
        return data


class TestStringMethods(unittest.TestCase):
    def test1(self):
        response = requests.request("GET", live_url)
        self.assertEqual(response.ok, True)
        print("\nTEST 1: Live Site is up: Status code response is OK")

    def test2(self):
        response = requests.request("GET", live_api_url)
        self.assertEqual(response.ok, True)
        print("\nTEST 2: Live API is up: Status code response is OK")

    def test3(self):
        response = requests.request("GET", live_api_url + "representative/")
        self.assertEqual(response.ok, True)
        print("\nTEST 3: Live API is up: Representative response is OK")

    def test4(self):
        response = requests.request("GET", live_api_url +
                                    "representative/A000374")
        self.assertEqual(response.ok, True)
        print("\nTEST 4: Live API is up: Bioguide Representative " +
              "response OK")

    def test5(self):
        response = requests.request("GET", live_api_url +
                                    "representative/page/1")
        self.assertEqual(response.ok, True)
        print("\nTEST 5: Live API is up: Representative Pagination " +
              "response OK")

    def test6(self):
        response = requests.request("GET", live_api_url + "representative/")
        result = response.json()
        with app.app_context():
            self.assertEqual(result, [get_response(rep) for rep in
                             Representative.query.order_by(
                             Representative.bioguide).limit(500).all()])
        print("\nTEST 6: Live API is up: Representative data " +
              "consistent with DB data. Response OK")

    def test7(self):
        self.maxDiff = None
        response = requests.request("GET", live_api_url +
                                    "representative/A000374")
        result = response.json()
        with app.app_context():
            self.assertEqual(result, get_response(Representative.query.filter(
                             Representative.bioguide == "A000374").first()))
        print("\nTEST 7: Live API is up: Representative Bioguide data " +
              "consistent with DB data. Response OK")

    def test8(self):
        response = requests.request("GET", live_api_url +
                                    "party/democratic_party")
        result = response.json()
        with app.app_context():
            self.assertEqual(result, get_response(PoliticalParty.query.filter(
                             PoliticalParty.id == 1).first()))
        print("\nTEST 8: Live API is up: Political Party data consistent " +
              "with DB data. Response OK")

    def test9(self):
        self.maxDiff = None
        response = requests.request("GET", live_api_url + "state/AL")
        result = response.json()
        with app.app_context():
            self.assertEqual(result, get_response(State.query.filter(
                             State.usps_abbreviation == "AL").first()))
        print("\nTEST 9: Live API is up: State data consistent with DB " +
              "data. Response OK")

    def test_10(self):
        self.maxDiff = None
        response = requests.request("GET", live_api_url + "district/AL")
        result = response.json()
        with app.app_context():
            self.assertEqual(result, [get_response(district) for district in
                             District.query.filter(
                             District.state == "AL").all()])
        print("\nTEST 10: Live API is up: District and state data " +
              "consistent with DB data. Response OK")

    def test_11(self):
        response = requests.request("GET", live_api_url + "district/AL/1")
        result = response.json()
        with app.app_context():
            self.assertEqual(result, get_response(District.query.filter(
                             District.state == "AL").filter(District.id == "1")
                                                    .first()))
        print("\nTEST 11: Live API is up: Specific District data " +
              "consistent with DB data. Response OK")

    def test_12(self):
        response = requests.request("GET", live_api_url +
                                    "representative/A0003745")
        error_msg = convert(response.json())
        self.assertTrue('Error' in error_msg)
        self.assertEqual(response.status_code, 404)
        print("\nTEST 12: Representative Endpoint: Bad bioguide parameter "
              "returns correct error response")

    def test_13(self):
        response = requests.request("GET", live_api_url +
                                    "party/bennys_party_for_heroin")
        error_msg = convert(response.json())
        self.assertTrue('Error' in error_msg)
        self.assertEqual(response.status_code, 404)
        print("\nTEST 13: Party Endpoint: Bad party id parameter returns " +
              "correct error response")

    def test_14(self):
        response = requests.request("GET", live_api_url + "state/XY")
        error_msg = convert(response.json())
        self.assertTrue('Error' in error_msg)
        self.assertEqual(response.status_code, 404)
        print("\nTEST 14: State Endpoint: Bad state abbreviation parameter " +
              "returns correct error response")

    def test_15(self):
        response = requests.request("GET", live_api_url + "district/XY")
        error_msg = convert(response.json())
        self.assertTrue('Error' in error_msg)
        self.assertEqual(response.status_code, 404)
        print("\nTEST 15: District Endpoint: Bad state abbreviation " +
              "parameter returns correct error response")

    def test_16(self):
        response = requests.request("GET", live_api_url + "district/AL/100")
        error_msg = convert(response.json())
        self.assertTrue('Error' in error_msg)
        self.assertEqual(response.status_code, 404)
        print("\nTEST 16: District Endpoint: Bad district id parameter " +
              "returns correct error response")

    def test_17(self):
        response = requests.request("GET", live_api_url + "district/XY/100")
        error_msg = convert(response.json())
        self.assertTrue('Error' in error_msg)
        self.assertEqual(response.status_code, 404)
        print("\nTEST 17: District Endpoint: Bad state abbreviation and " +
              "district id and parameters returns correct error response")

    def test_18(self):
        print("\n**** Database Backend Tests ****")
        self.maxDiff = None
        # insert the rep
        Bill.query.filter(Bill.number == "A.B.2018").delete()
        Article.query.filter(Article.title == "Steven roils Congress with " +
                             "new initiative to provide " +
                             "free cupcakes").delete()
        Representative.query.filter(Representative.bioguide ==
                                    "ABC123").delete()
        db.session.commit()
        rep = Representative(
            bioguide="ABC123",
            firstname="Steven",
            lastname="Austin",
            party_id=1,
            state='TX',
            district="1",
            twitter="RepSteven",
            youtube="StevenChannel",
            facebook="StevenFacebook",
            office="111 Congress",
            votes_with_party_pct=50.0,
            url="https://test.house.gov",
            image_uri='https://rep/john/photo.jpg'
        )
        bill = Bill(
            number='A.B.2018',
            short_title='Test Bill',
            sponsor_id="ABC123",
            congressdotgov_url='https://test.gov/bill1',
            introduced_date="2018-06-20",
            latest_major_action="Move to Senate"
        )
        rep.bills.append(bill)
        article = Article(
            title='Steven roils Congress with new initiative to provide ' +
                  'free cupcakes',
            url='http://fake.news.com/Steve',
            author='Crooked Media',
            text='First year representative Steven Austin has taken ' +
                 'Congress by storm...',
            date='2018-04-12T15:58:00.000+03:00',
            site='fake.news.com',
            representative_id='ABC123'
        )
        rep.articles.append(article)
        db.session.add(rep)
        db.session.commit()

        expected = {
            "articles": [
                {
                    "author": "Crooked Media",
                    "date": "2018-04-12T15:58:00.000+03:00",
                    "representative_id": "ABC123",
                    "site": "fake.news.com",
                    "text": "First year representative Steven Austin " +
                            "has taken Congress by storm...",
                    "title": "Steven roils Congress with new initiative to " +
                             "provide free cupcakes",
                    "url": "http://fake.news.com/Steve"
                }
            ],
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
            "facebook": "StevenFacebook",
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
        response = convert(get_response(Representative.query.filter(
                                        Representative.bioguide ==
                                        "ABC123").first()))
        # autoincremented primary key
        del response['bills'][0]['id']
        del response['articles'][0]['id']
        self.assertEqual(expected, response)

        # delete the rep
        Article.query.filter(Article.title == "Steven roils Congress with " +
                             "new initiative to provide free " +
                             "cupcakes").delete()
        Bill.query.filter(Bill.number == "A.B.2018").delete()
        Representative.query.filter(Representative.bioguide ==
                                    "ABC123").delete()
        db.session.commit()
        print("\nTEST 18: Representative successfully inserted, queried, " +
              "and removed from the database")

    def test_19(self):
        self.maxDiff = None
        # insert the party
        PoliticalParty.query.filter(PoliticalParty.id == 100).delete()
        db.session.commit()
        party = PoliticalParty(
            id=100,
            name="Random Party",
            path="random_party",
            chair="Steven Austin",
            formation_date="January 8, 1828",
            twitter_handle="randomparty",
            youtube="randomchannel",
            office="123 Main St, Austin, TX 12345",
            website="https://randomparty.com"
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

        # query the party
        response = convert(get_response(PoliticalParty.query.filter(
                           PoliticalParty.id == 100).first()))
        self.assertEqual(expected, response)

        # delete the party
        PoliticalParty.query.filter(PoliticalParty.id == 100).delete()
        db.session.commit()
        print("\nTEST 19: Political Party successfully inserted, queried, " +
              "and removed from the database")

    def test_20(self):
        self.maxDiff = None
        # insert the party color
        PartyColor.query.filter(PartyColor.id == 100).delete()
        db.session.commit()
        party_color = PartyColor(
            id=100,
            party_id=1,
            color="Orange"
        )

        db.session.add(party_color)
        db.session.commit()

        expected = {
            "color": "Orange",
            "id": 100,
            "party_id": 1
        }

        # query the party color
        response = convert(get_response(PartyColor.query.filter(
                           PartyColor.id == 100).first()))
        self.assertEqual(expected, response)

        # delete the party color
        PartyColor.query.filter(PartyColor.id == 100).delete()
        db.session.commit()
        print("\nTEST 20: Party Color successfully inserted, queried, and " +
              "removed from the database")

    def test_21(self):
        self.maxDiff = None
        # insert the state
        State.query.filter(State.usps_abbreviation == "XY").delete()
        db.session.commit()
        state = State(
            usps_abbreviation="XY",
            number=55,
            name="New State"
        )

        db.session.add(state)
        db.session.commit()

        expected = {
            "usps_abbreviation": "XY",
            "number": 55,
            "name": "New State",
            "districts": []
        }

        # query the state
        response = convert(get_response(State.query.filter(
                           State.usps_abbreviation == "XY").first()))
        self.assertEqual(expected, response)

        # delete the state
        State.query.filter(State.usps_abbreviation == "XY").delete()
        db.session.commit()
        print("\nTEST 21: State successfully inserted, queried, and removed " +
              "from the database")

    def test_22(self):
        self.maxDiff = None
        # insert the district
        District.query.filter(District.alpha_num == "TX-100").delete()
        db.session.commit()
        district = District(
            alpha_num="TX" + '-' + str(100),
            state="TX",
            id="100",
            representative_id="G000552",
            wikipedia_link="http://en.wikipedia.com/blahbityblah",
            population=12345,
            median_age=70.5,
            median_age_male=70.5,
            median_age_female=70.5,
            population_male=12345,
            population_white=12345,
            population_black_or_african_american=12345,
            population_american_indian_and_alaska_native=12345,
            population_asian=12345,
            population_native_hawaiian_and_other_pacific_islander=12345,
            population_some_other_race=12345,
            population_two_or_more_races=12345,
            ethnicity_not_hispanic_or_latino=123,
            ethnicity_hispanic_or_latino=45,
            citizenship_us_citizen_born_in_us=1,
            citizenship_us_citizen_born_in_pr_or_us_island_areas=2,
            citizenship_us_citizen_born_abroad_of_american_parents=3,
            citizenship_us_citizen_by_naturalization=4,
            citizenship_not_a_us_citizen=5,
            language_speak_only_english=6,
            language_speak_spanish=7,
            language_speak_other_languages=8,
            marriage_never_married=9,
            marriage_now_married=10,
            marriage_divorced=11,
            marriage_separated=12,
            marriage_widowed=13,
            education_less_than_hs=14,
            education_hs_grad=15,
            education_some_college=16,
            education_bachelors=17,
            education_grad_prof=18,
            income_none=19,
            income_9999_less=20,
            income_10000_14999=21,
            income_15000_19999=22,
            income_20000_24999=23,
            income_25000_29999=24,
            income_30000_34999=25,
            income_35000_39999=26,
            income_40000_44999=27,
            income_45000_49999=28,
            income_50000_59999=29,
            income_60000_74999=30,
            income_75000_99999=31,
            income_100000_124999=32,
            income_125000_149999=33,
            income_150000_199999=34,
            income_200000_more=35,
            veteran=36,
            computers_has_one_or_more=37,
            computers_has_desktop_laptop=38,
            computers_has_smartphone=39,
            computers_has_tablet=40,
            computers_has_other=41,
            computers_none=42,
            internet_has=43,
            internet_has_dialup=44,
            internet_has_broadband=45,
            internet_has_cellular_data=46,
            internet_has_satellite=47,
            internet_none=48
        )

        db.session.add(district)
        db.session.commit()

        expected = {
            "alpha_num": "TX-100",
            "citizenship_not_a_us_citizen": 5,
            "citizenship_us_citizen_born_abroad_of_american_parents": 3,
            "citizenship_us_citizen_born_in_pr_or_us_island_areas": 2,
            "citizenship_us_citizen_born_in_us": 1,
            "citizenship_us_citizen_by_naturalization": 4,
            "computers_has_desktop_laptop": 38,
            "computers_has_one_or_more": 37,
            "computers_has_other": 41,
            "computers_has_smartphone": 39,
            "computers_has_tablet": 40,
            "computers_none": 42,
            "education_bachelors": 17,
            "education_grad_prof": 18,
            "education_hs_grad": 15,
            "education_less_than_hs": 14,
            "education_some_college": 16,
            "ethnicity_hispanic_or_latino": 45,
            "ethnicity_not_hispanic_or_latino": 123,
            "id": "100",
            "income_100000_124999": 32,
            "income_10000_14999": 21,
            "income_125000_149999": 33,
            "income_150000_199999": 34,
            "income_15000_19999": 22,
            "income_200000_more": 35,
            "income_20000_24999": 23,
            "income_25000_29999": 24,
            "income_30000_34999": 25,
            "income_35000_39999": 26,
            "income_40000_44999": 27,
            "income_45000_49999": 28,
            "income_50000_59999": 29,
            "income_60000_74999": 30,
            "income_75000_99999": 31,
            "income_9999_less": 20,
            "income_none": 19,
            "internet_has": 43,
            "internet_has_broadband": 45,
            "internet_has_cellular_data": 46,
            "internet_has_dialup": 44,
            "internet_has_satellite": 47,
            "internet_none": 48,
            "language_speak_only_english": 6,
            "language_speak_other_languages": 8,
            "language_speak_spanish": 7,
            "marriage_divorced": 11,
            "marriage_never_married": 9,
            "marriage_now_married": 10,
            "marriage_separated": 12,
            "marriage_widowed": 13,
            "median_age": 70.5,
            "median_age_female": 70.5,
            "median_age_male": 70.5,
            "population": 12345,
            "population_american_indian_and_alaska_native": 12345,
            "population_asian": 12345,
            "population_black_or_african_american": 12345,
            "population_male": 12345,
            "population_native_hawaiian_and_other_pacific_islander": 12345,
            "population_some_other_race": 12345,
            "population_two_or_more_races": 12345,
            "population_white": 12345,
            "representative_id": "G000552",
            "state": "TX",
            "veteran": 36,
            "wikipedia_link": "http://en.wikipedia.com/blahbityblah",
        }

        # query the district
        response = get_response(District.query.filter(District.alpha_num ==
                                "TX-100").first())
        self.assertEqual(expected, response)

        # delete the district
        District.query.filter(District.alpha_num == "TX-100").delete()
        db.session.commit()
        print("\nTEST 22: District successfully inserted, queried, and " +
              "removed from the database")

    def test_23(self):
        self.maxDiff = None
        # insert the district
        expected = {
            "articles": [
                {
                    "author": "House Armed Services Committee Democrats",
                    "date": "2018-04-12T20:47:00.000+03:00",
                    "id": 1069,
                    "representative_id": "V000132",
                    "site": "yubanet.com",
                    "text": "By House Armed Services Committee Democrats - " +
                            "April 12, 2018, 10:47:25 AM \nWASHINGTON, DC, " +
                            "April 11, 2018  Today, seven House Democratic " +
                            "national security leaders sent a letter to " +
                            "Homeland Security K...",
                    "title": "House National Security Dems Demand Answers " +
                             "on Trump Border Troop Deployment",
                    "url": "http://omgili.com/ri/.wHSUbtEfZRifTcriWjR." +
                           "Gq8Xi4Nn.y8.7H0.x6V9Ys5jXLzgJsaygVm2Vn67ScHTpf_" +
                           "fN24.PH5FJQexmTUMe7eoqVr2fLZHt3m7F5gxu5u"
                           "vaGxCyntLsYl1_dOdOe1b11NsdlRJs8-"
                }
            ],
            "bills": [
                {
                    "congressdotgov_url": "https://www.congress.gov/bill/" +
                                          "115th-congress/house-bill/4940",
                    "id": 1196,
                    "introduced_date": "2018-02-06",
                    "latest_major_action": "Referred to the Subcommittee on " +
                                           "Biotechnology, Horticulture, " +
                                           "and Research.",
                    "number": "H.R.4940",
                    "short_title": "Border and Port Security Act",
                    "sponsor_id": "V000132"
                },
                {
                    "congressdotgov_url": "https://www.congress.gov/bill/" +
                                          "115th-congress/house-bill/4578",
                    "id": 1197,
                    "introduced_date": "2017-12-06",
                    "latest_major_action": "Received in the Senate and Read " +
                                           "twice and referred to the " +
                                           "Committee on Homeland Security " +
                                           "and Governmental Affairs.",
                    "number": "H.R.4578",
                    "short_title": "Counter Terrorist Network Act",
                    "sponsor_id": "V000132"
                },
                {
                    "congressdotgov_url": "https://www.congress.gov/bill/" +
                                          "115th-congress/house-bill/3375",
                    "id": 1198,
                    "introduced_date": "2017-07-24",
                    "latest_major_action": "Referred to the Subcommittee on " +
                                           "Economic Development, Public " +
                                           "Buildings and Emergency " +
                                           "Management.",
                    "number": "H.R.3375",
                    "short_title": "Javier Vega, Jr. Memorial Act of 2017",
                    "sponsor_id": "V000132"
                }
            ],
            "bioguide": "V000132",
            "district": "34",
            "facebook": "USCongressmanFilemonVela",
            "firstname": "Filemon",
            "image_uri": "https://theunitedstates.io/images/congress/" +
                         "225x275/V000132.jpg",
            "lastname": "Vela",
            "office": "437 Cannon House Office Building",
            "party_id": 1,
            "state": "TX",
            "twitter": "RepFilemonVela",
            "url": "https://vela.house.gov",
            "votes_with_party_pct": 89.14,
            "youtube": None
        }

        response = requests.request("GET", live_api_url + 'representative/' +
                                    'filter?filter={"state":"TX","party_id":' +
                                    '"1","last_name":"D-Z","votes_pct":' +
                                    '"30-90","order_by":"last_desc"}')
        result = convert(json.loads(removeunicode(response.text)))
        with app.app_context():
            self.assertEqual(result[0], convert(expected))
        print("\nTEST 23: Filtering API: Representative - filter by state, " +
              "party, lastname, votes_pct, order by lastname - " +
              "data consistent")

    def test_24(self):
        self.maxDiff = None
        # insert the district
        expected = {
            "articles": [
                {
                    "author": "KCBD Digital",
                    "date": "2018-04-10T22:15:00.000+03:00",
                    "id": 18,
                    "representative_id": "A000375",
                    "site": "kcbd.com",
                    "text": "All Saints senior named TABC Player of the " +
                    "Year 2018-04-10T19:15:42Z Austin Hickle (Source: " +
                    "All Saints) \nProvided by Shelly Smith - All Saints " +
                    "Episcopal School \nAn All Saints senior has been " +
                    "selected ...",
                    "title": "All Saints senior named TABC Player of the Year",
                    "url": "http://omgili.com/ri/jHIAmI4hxg9xLDezd6p" +
                    "vu16vJFOCFpdr.1UX39pZUYNp_RIgBS7d1Bu9QAqQUfLec5.j" +
                    "avd8VYuMxyXegYSbohyyMxFiUxOCRalLSltwrxMpv6QdiZhrhg--"
                },
                {
                    "author": "",
                    "date": "2018-04-13T03:00:00.000+03:00",
                    "id": 19,
                    "representative_id": "A000375",
                    "site": "fox34.com",
                    "text": "5 things to know: Friday Posted: Updated: \n" +
                    "Memorandum of Understanding authorized for SPC " +
                    "Downtown Academic Center \nLUBBOCK, Texas - " +
                    "A Memorandum of Understanding with South Plains " +
                    "College to give Cit...",
                    "title": "5 things to know: Friday",
                    "url": "http://omgili.com/ri/jHIAmI4hxg8O9bdSIjkG0a." +
                    "dyznZ4s59L0Pl4tf0saUz16AXz8u5IqBrbnIxU9I1.XuuEbQGXB_" +
                    "A0rYQm.Y.0Q--"
                }
            ],
            "bills": [
                {
                    "congressdotgov_url": "https://www.congress.gov/bill/" +
                    "115th-congress/house-bill/4178",
                    "id": 22,
                    "introduced_date": "2017-10-31",
                    "latest_major_action": "Sponsor introductory remarks on " +
                    "measure. (CR H8304)",
                    "number": "H.R.4178",
                    "short_title": "HEART Act",
                    "sponsor_id": "A000375"
                },
                {
                    "congressdotgov_url": "https://www.congress.gov/bill/" +
                    "115th-congress/house-bill/3561",
                    "id": 23,
                    "introduced_date": "2017-07-28",
                    "latest_major_action": "Ordered to be Reported in the " +
                    "Nature of a Substitute by Voice Vote.",
                    "number": "H.R.3561",
                    "short_title": "To amend title 38, United States Code, " +
                    "to permit appraisers approved by the Secretary of " +
                    "Veterans Affairs to make appraisals for purposes of " +
                    "chapter 37 of such title based on inspections " +
                    "performed by third parties.",
                    "sponsor_id": "A000375"
                },
                {
                    "congressdotgov_url": "https://www.congress.gov/bill/" +
                    "115th-congress/house-bill/3562",
                    "id": 24,
                    "introduced_date": "2017-07-28",
                    "latest_major_action": 'Received in the Senate and ' +
                    'Read twice and referred to the Committee on ' +
                    'Veterans&#39; Affairs.',
                    "number": "H.R.3562",
                    "short_title": "To amend title 38, United States Code, " +
                    "to authorize the Secretary of Veterans Affairs to " +
                    "furnish assistance for adaptations of residences of " +
                    "veterans in rehabilitation programs under chapter 31 " +
                    "of such title, and for other purposes.",
                    "sponsor_id": "A000375"
                }
            ],
            "bioguide": "A000375",
            "district": "19",
            "facebook": "JodeyArrington",
            "firstname": "Jodey",
            "image_uri": "https://theunitedstates.io/images/congress/" +
            "225x275/A000375.jpg",
            "lastname": "Arrington",
            "office": "1029 Longworth House Office Building",
            "party_id": 2,
            "state": "TX",
            "twitter": "RepArrington",
            "url": "https://arrington.house.gov",
            "votes_with_party_pct": 98.46,
            "youtube": None
        }
        response = requests.request("GET", live_api_url + 'representative/' +
                                    'filter?filter={"state":"TX"}')
        result = convert(json.loads(removeunicode(response.text)))
        with app.app_context():
            self.assertEqual(result[0], convert(expected))
        print("\nTEST 24: Filtering API: Representative - filter by state  " +
              "- data consistent")

    def test_25(self):
        self.maxDiff = None
        # insert the district
        expected = {
            "articles": [
                {
                    "author": "CarolinaWeekly",
                    "date": "2018-04-13T13:16:00.000+03:00",
                    "id": 4,
                    "representative_id": "A000370",
                    "site": "thecharlotteweekly.com",
                    "text": "  News briefs for April 13 News briefs for " +
                    "April 13 April 13, 2018 by CarolinaWeekly " +
                    "Leave a Comment Festival honors African- American " +
                    "heritage CHARLOTTE  " +
                    "The sixth annual Charlotte African American ...",
                    "title": "News briefs for April 13",
                    "url": "http://omgili.com/ri/DyQaNGXlfMoOli7k1XuiOhCZx" +
                    "QBGdYnLQ1ISX03jDKwl9n0O1sjRE5VcgLKk73Vmq8c6UFCRyXFp35Az" +
                    "nP2DIt1F7Vv2kYb."
                }
            ],
            "bills": [
                {
                    "congressdotgov_url": "https://www.congress.gov/bill/" +
                    "115th-congress/house-resolution/818",
                    "id": 4,
                    "introduced_date": "2018-04-11",
                    "latest_major_action": "Referred to the House " +
                    "Committee on Energy and Commerce.",
                    "number": "H.RES.818",
                    "short_title": "Recognizing \"Black Maternal Health " +
                    "Week\" to bring national attention to the maternal " +
                    "health care crisis in the Black community and the " +
                    "importance of reducing the rate of maternal mortality " +
                    "and morbidity among Black women.",
                    "sponsor_id": "A000370"
                },
                {
                    "congressdotgov_url": "https://www.congress.gov/bill/" +
                    "115th-congress/house-bill/5451",
                    "id": 5,
                    "introduced_date": "2018-04-10",
                    "latest_major_action": "Referred to the House " +
                    "Committee on Oversight and Government Reform.",
                    "number": "H.R.5451",
                    "short_title": "To designate the facility of the United " +
                    "States Postal Service located at 10926 Quality " +
                    "Drive in Charlotte, North Carolina, as the \"Julius " +
                    "L. Chambers Civil Rights Memorial Post " +
                    "Office Building\".",
                    "sponsor_id": "A000370"
                },
                {
                    "congressdotgov_url": "https://www.congress.gov/bill" +
                    "/115th-congress/house-bill/5416",
                    "id": 6,
                    "introduced_date": "2018-03-29",
                    "latest_major_action": "Referred to the Committee on " +
                    "Education and the Workforce, and in addition to the " +
                    "Committee on Ways and Means, for a period to be " +
                    "subsequently determined by the Speaker, in each case " +
                    "for consideration of such provisions as fall within " +
                    "the jurisdiction of the committee concerned.",
                    "number": "H.R.5416",
                    "short_title": "Women Small Business Growth Act",
                    "sponsor_id": "A000370"
                }
            ],
            "bioguide": "A000370",
            "district": "12",
            "facebook": "CongresswomanAdams",
            "firstname": "Alma",
            "image_uri": "https://theunitedstates.io/images/congress" +
            "/225x275/A000370.jpg",
            "lastname": "Adams",
            "office": "222 Cannon House Office Building",
            "party_id": 1,
            "state": "NC",
            "twitter": "RepAdams",
            "url": "https://adams.house.gov",
            "votes_with_party_pct": 95.55,
            "youtube": None
        }
        response = requests.request("GET", live_api_url + 'representative/' +
                                    'filter?filter={"party_id":"1"}')
        result = convert(json.loads(removeunicode(response.text)))
        with app.app_context():
            self.assertEqual(result[0], convert(expected))
        print("\nTEST 25: Filtering API: Representative - filter by " +
              "party  - data consistent")

    def test_26(self):
        self.maxDiff = None
        # insert the district
        expected = {
            "articles": [
                {
                    "author": "NASDAQ LIVE FEED",
                    "date": "2018-04-12T09:10:00.000+03:00",
                    "id": 660,
                    "representative_id": "M001193",
                    "site": "financialbuzz.com",
                    "text": "Tweet SAN DIEGO, April 11, 2018 (GLOBE " +
                    "NEWSWIRE) -- New Jersey provides guidance and " +
                    "funding to a large number of community-based " +
                    "associations that are dedicated to addiction " +
                    "treatment and prevention....",
                    "title": "New Jersey Gets Funding to Fight Drug " +
                    "Trafficking Reports Heroin Detox Clinics",
                    "url": "http://omgili.com/ri/jHIAmI4hxg.YuZjPcTcrfN_" +
                    "foHjROD5Z9G9dDXhPGIyQw8S3z7ZMei_nCgO2WktanRj5jGrdik48p" +
                    "0a499._pfjm_IDBNLy4Q5qtVW9Fodcafshv8s0RcKFUl_l7CZpmsjF" +
                    "LxdTygHbvscVjbJhxKFQ7K6Hmh5Yz"
                },
                {
                    "author": "NJ.com",
                    "date": "2018-04-13T04:26:00.000+03:00",
                    "id": 661,
                    "representative_id": "M001193",
                    "site": "rawstory.com",
                    "text": "Rep. Tom MacArthur (Photo: NJ.com) Don't " +
                    "miss stories. Follow Raw Story! Follow @rawstory " +
                    "WASHINGTON  After backing bills that added $2.7 " +
                    "trillion to the federal debt over a decade, Rep. " +
                    "Tom MacArthu...",
                    "title": "New Jersey Republican supported a larger " +
                    "deficit  then voted for a balanced budget amendment",
                    "url": "http://omgili.com/ri/.wHSUbtEfZSYnbK3sKActvNO" +
                    "AKU5nTG9Vmci._nWpgkP.5k.V6pcECe4mlpNOdCY0nzFEFLGsDvW" +
                    "50mxjXGxgPW1qGbQByl776Q0_b7YEW5.RFmzIfzsXnbL9q971S5aE" +
                    "45vniKbfvg2RoISVtBiUw50u9BWvSz3"
                },
                {
                    "author": "Your News",
                    "date": "2018-04-12T22:41:00.000+03:00",
                    "id": 662,
                    "representative_id": "M001193",
                    "site": "shorenewsnetwork.com",
                    "text": "tweet \nSubmitted by Evan Lukaske, \nIn the " +
                    "wake of the Facebook-Cambridge Analytica scandal , " +
                    "Washington Republicans and Representative Tom " +
                    "MacArthur have made a large show of supposedly " +
                    "fighting to pr...",
                    "title": "DCCC: MacArthur voted to allow sale of his " +
                    "constituents internet browsing data",
                    "url": "http://omgili.com/ri/7aBdisT0NOqMtSEc6sMFs" +
                    "jbXZ8HyVfZRQo6lU.rC40biEI6c3L6nns.r8xJ7xpNPJzAzOj67" +
                    "ttylQqI1uyZT.Kc80cyjGmUiPoynorSMNvO9Kt.y7ViMaGb7pg" +
                    "s_2Rog37Dt2i0SkVj5GN900ewn7aKy1803heYyr.h1UQwW_yKQf" +
                    "5Imm_kwXtA8GAKQNXFAelcUTeJrRTs-"
                }
            ],
            "bills": [
                {
                    "congressdotgov_url": "https://www.congress.gov/bill/" +
                    "115th-congress/house-bill/5037",
                    "id": 743,
                    "introduced_date": "2018-02-15",
                    "latest_major_action": "Referred to the House Committee " +
                    "on Financial Services.",
                    "number": "H.R.5037",
                    "short_title": "Securities Fraud Act of 2018",
                    "sponsor_id": "M001193"
                },
                {
                    "congressdotgov_url": "https://www.congress.gov/bill/" +
                    "115th-congress/house-bill/4780",
                    "id": 744,
                    "introduced_date": "2018-01-11",
                    "latest_major_action": "Referred to the House Committee " +
                    "on Ways and Means.",
                    "number": "H.R.4780",
                    "short_title": "Transparency for Taxpayers Act",
                    "sponsor_id": "M001193"
                },
                {
                    "congressdotgov_url": "https://www.congress.gov/bill/" +
                    "115th-congress/house-bill/4597",
                    "id": 745,
                    "introduced_date": "2017-12-07",
                    "latest_major_action": "Referred to the House " +
                    "Committee on Education and the Workforce.",
                    "number": "H.R.4597",
                    "short_title": "College Loan Deferment for Recovery Act",
                    "sponsor_id": "M001193"
                }
            ],
            "bioguide": "M001193",
            "district": "3",
            "facebook": "CongressmanTomMacArthur",
            "firstname": "Tom",
            "image_uri": "https://theunitedstates.io/images/congress/225x" +
            "275/M001193.jpg",
            "lastname": "MacArthur",
            "office": "506 Cannon House Office Building",
            "party_id": 2,
            "state": "NJ",
            "twitter": "RepTomMacArthur",
            "url": "https://macarthur.house.gov",
            "votes_with_party_pct": 89.17,
            "youtube": None
        }
        response = requests.request("GET", live_api_url + 'representative' +
                                    '/filter?filter={"last_name":"M-Z"}')
        result = convert(json.loads(removeunicode(response.text)))
        with app.app_context():
            self.assertEqual(result[0], convert(expected))
        print("\nTEST 26: Filtering API: Representative - filter by " +
              "last name  - data consistent")

    def test_27(self):
        self.maxDiff = None
        expected = {
            "articles": [
                {
                    "author": "Gregory Bullock",
                    "date": "2018-04-12T06:16:00.000+03:00",
                    "id": 1141,
                    "representative_id": "Z000017",
                    "site": "easthamptonstar.com",
                    "text": "Democrats in Showdown Over Leadership Vote for " +
                    "successor is dogged by infighting | April 11, " +
                    "2018 - 11:16pm Rona Klopman of Amagansett has " +
                    "made a bid for chairwoman of the East Hampton " +
                    "Democratic Comm...",
                    "title": "Democrats in Showdown Over Leadership",
                    "url": "http://omgili.com/ri/j.JM_ertN3KcntyUXSigYhfB" +
                    "Xq56RD7tFHgXAYVNixeBqRnFbo888D3E1ysgOUoUgd1wcMmSCMsf" +
                    "JGj9wY0Hh8eedXBm9cD7p.mC4mbIJYY-"
                },
                {
                    "author": "Gregory Bullock",
                    "date": "2018-04-12T05:59:00.000+03:00",
                    "id": 1142,
                    "representative_id": "Z000017",
                    "site": "easthamptonstar.com",
                    "text": "| April 11, 2018 - 10:59pm Elaine DiMasi, a " +
                    "former project manager at Brookhaven National " +
                    "Laboratory, is seeking the Democratic nomination to " +
                    "run in New York's First Congressional District. " +
                    "Karen Curt...",
                    "title": "Elaine DiMasi Touts Scientific Chops in "
                    "House Run",
                    "url": "http://omgili.com/ri/j.JM_ertN3KcntyUXSigYhf" +
                    "BXq56RD7tFHgXAYVNixeBqRnFbo888Aln6z27bTUz23.L.DMLfK" +
                    "BczYcYh2Bxj7ykm5MJ0Fg6SOKCYeb9sMyGdiiFMejHpQ--"
                },
                {
                    "author": "",
                    "date": "2018-04-12T18:01:00.000+03:00",
                    "id": 1143,
                    "representative_id": "Z000017",
                    "site": "longisland.com",
                    "text": "By Long Island News & PR Published: April " +
                    "12 2018 LongIsland.com Zeldin: \"Far too many aspects " +
                    "of our nation financial institutions are shrouded " +
                    "in secrecy and free from public accountability and " +
                    "ov...",
                    "title": "Rep. Zeldin Bipartisan Stress Test " +
                    "Improvement Act, to Safeguard Capital and Protect " +
                    "Consumers, Passes House",
                    "url": "http://omgili.com/ri/.wHSUbtEfZQ6m5_DJ5Wv6Ug6" +
                    "ByW6phG15YzkQRK_zygrHTLmqx86eCNTQpZgHA00bct_Xbw3Ginsz" +
                    "spoMmEg8Z9THkOsbt5ectAh8xeQ27k6NS64zGsL3zOrm314kCwOZN9" +
                    "SllHU8jsVC6Aci.ZJB2BM.CpX_UGlzYKrUKzoRxJxEBRKddjB6WxLn" +
                    "XDisOiPH0v_xrNr2s_F_Bd_ikKYOQ--"
                }
            ],
            "bills": [
                {
                    "congressdotgov_url": "https://www.congress.gov/bill/" +
                    "115th-congress/house-joint-resolution/132",
                    "id": 1283,
                    "introduced_date": "2018-04-10",
                    "latest_major_action": "Referred to the House Committee " +
                    "on Financial Services.",
                    "number": "H.J.RES.132",
                    "short_title": "Providing for congressional disapproval " +
                    "under chapter 8 of title 5, United States Code, of " +
                    "the rule submitted by the Bureau of Consumer Financial " +
                    "Protection relating to \"Indirect Auto Lending and " +
                    "Compliance with the Equal Credit Opportunity Act\".",
                    "sponsor_id": "Z000017"
                },
                {
                    "congressdotgov_url": "https://www.congress.gov/bill/" +
                    "115th-congress/house-bill/5065",
                    "id": 1284,
                    "introduced_date": "2018-02-15",
                    "latest_major_action": "Referred to the Subcommittee on " +
                    "Immigration and Border Security.",
                    "number": "H.R.5065",
                    "short_title": "Protecting Our Communities from Gang " +
                    "Violence Act of 2018",
                    "sponsor_id": "Z000017"
                },
                {
                    "congressdotgov_url": "https://www.congress.gov/bill/" +
                    "115th-congress/house-bill/4996",
                    "id": 1285,
                    "introduced_date": "2018-02-08",
                    "latest_major_action": "Referred to the House " +
                    "Committee on the Judiciary.",
                    "number": "H.R.4996",
                    "short_title": "Protecting Our Communities from " +
                    "Gang Violence Act of 2018",
                    "sponsor_id": "Z000017"
                }
            ],
            "bioguide": "Z000017",
            "district": "1",
            "facebook": "RepLeeZeldin",
            "firstname": "Lee",
            "image_uri": "https://theunitedstates.io/images/congress/" +
            "225x275/Z000017.jpg",
            "lastname": "Zeldin",
            "office": "1517 Longworth House Office Building",
            "party_id": 2,
            "state": "NY",
            "twitter": "RepLeeZeldin",
            "url": "https://zeldin.house.gov",
            "votes_with_party_pct": 93.61,
            "youtube": None
        }
        response = requests.request("GET", live_api_url + 'representative' +
                                    '/filter?filter={"order_by":"last_desc"}')
        result = response.json()
        with app.app_context():
            self.assertEqual(removeunicode(json.dumps(result[0],
                             sort_keys=True)), removeunicode(
                             json.dumps(expected, sort_keys=True)))
        print("\nTEST 27: Filtering API: Representative - sort by last " +
              "name  - data consistent")

    def test_28(self):
        self.maxDiff = None
        # insert the district
        expected = {
            "Error": "Filter Query Invalid"
        }

        response = requests.request("GET", live_api_url + 'representative' +
                                    '/filter?filter')
        result = response.json()
        with app.app_context():
            self.assertEqual(result, expected)
        print("\nTEST 28: Filtering API: Representative - Bad Filter " +
              "Query  - Response OK")

    def test_29(self):
        self.maxDiff = None
        # insert the district
        expected = [
            {
                "chair": "Frank Fluckiger",
                "colors": [
                    {
                        "color": "Red",
                        "id": 6,
                        "party_id": 14
                    },
                    {
                        "color": "White",
                        "id": 7,
                        "party_id": 14
                    },
                    {
                        "color": "Blue",
                        "id": 8,
                        "party_id": 14
                    },
                    {
                        "color": "Purple",
                        "id": 9,
                        "party_id": 14
                    }
                ],
                "formation_date": "1991",
                "id": 14,
                "name": "Constitution Party",
                "office": "Lancaster, Pennsylvania 17608",
                "path": "constitution_party",
                "representatives": [],
                "twitter_handle": "cnstitutionprty",
                "website": "constitutionparty.com",
                "youtube": "ConstitutionParty"
            },
            {
                "chair": "",
                "colors": [
                    {
                        "color": "Red",
                        "id": 19,
                        "party_id": 17
                    },
                    {
                        "color": "White",
                        "id": 20,
                        "party_id": 17
                    },
                    {
                        "color": "Blue",
                        "id": 21,
                        "party_id": 17
                    }
                ],
                "formation_date": "2009",
                "id": 17,
                "name": "Humane Party",
                "office": "PO Box 83, Gilbertsville, Pennsylvania 19525-8500",
                "path": "humane_party",
                "representatives": [],
                "twitter_handle": "humaneparty",
                "website": "humaneparty.org",
                "youtube": "Humane Party"
            },
            {
                "chair": "Bill C. Merrell",
                "colors": [
                    {
                        "color": "Red",
                        "id": 61,
                        "party_id": 28
                    },
                    {
                        "color": "White",
                        "id": 62,
                        "party_id": 28
                    },
                    {
                        "color": "Blue",
                        "id": 63,
                        "party_id": 28
                    }
                ],
                "formation_date": "1995",
                "id": 28,
                "name": "Reform Party",
                "office": "PO Box 660675 #3995 Dallas, Texas 75266-0675",
                "path": "reform_party",
                "representatives": [],
                "twitter_handle": "ReformParty",
                "website": "reformparty.org",
                "youtube": "ReformPartyUSA"
            },
            {
                "chair": "Jeff Mackler",
                "colors": [
                    {
                        "color": "Red",
                        "id": 36,
                        "party_id": 29
                    },
                    {
                        "color": "White",
                        "id": 37,
                        "party_id": 29
                    },
                    {
                        "color": "Black",
                        "id": 38,
                        "party_id": 29
                    }
                ],
                "formation_date": "1983",
                "id": 29,
                "name": "Socialist Action Party",
                "office": "",
                "path": "socialist_action_party",
                "representatives": [],
                "twitter_handle": "SocialistActUS",
                "website": "socialistaction.org",
                "youtube": "SocialistActionCT"
            }
        ]
        response = requests.request("GET", live_api_url + 'party/filter?' +
                                    'filter={"social":"Y","color":"white"'
                                    '+,"date":"1700-2018","name":"A-Z"}')
        result = response.json()
        with app.app_context():
            self.assertEqual(result, expected)
        print("\nTEST 29: Filtering API: Party - filter by social media, " +
              "party color, formation date, party name - data consistent")

    def test_30(self):
        self.maxDiff = None
        # insert the district
        expected = {
            "chair": "William Daniel Johnson",
            "colors": [],
            "formation_date": "January 5, 2010",
            "id": 4,
            "name": "American Freedom Party",
            "office": "2753 Broadway Ste 245, New York City, New York 10025",
            "path": "american_freedom_party",
            "representatives": [],
            "twitter_handle": "AmFreedoms",
            "website": "theamericanfreedomparty.us",
            "youtube": "American3P"
        }
        response = requests.request("GET", live_api_url + 'party/filter?' +
                                    'filter={"order_by":"chair_name_desc"}')
        result = response.json()
        with app.app_context():
            self.assertEqual(result[0], expected)
        print("\nTEST 30: Filtering API: Party - sort by chair name - data " +
              " consistent")

    def test_31(self):
        self.maxDiff = None
        # insert the district
        expected = {
            "Error": "Filter Query Invalid"
        }
        response = requests.request("GET", live_api_url + 'party/filter?' +
                                    'filter')
        result = response.json()
        with app.app_context():
            self.assertEqual(result, expected)
        print("\nTEST 31: Filtering API: Party - Bad Filter Query  - " +
              "Response OK")

    def test_32(self):
        self.maxDiff = None
        expected = {
            "alpha_num": "TX-1",
            "citizenship_not_a_us_citizen": 40048,
            "citizenship_us_citizen_born_abroad_of_american_parents": 2589,
            "citizenship_us_citizen_born_in_pr_or_us_island_areas": 268,
            "citizenship_us_citizen_born_in_us": 657366,
            "citizenship_us_citizen_by_naturalization": 17464,
            "computers_has_desktop_laptop": 164782,
            "computers_has_one_or_more": 212811,
            "computers_has_other": 4759,
            "computers_has_smartphone": 184954,
            "computers_has_tablet": 129210,
            "computers_none": 37736,
            "education_bachelors": 66676,
            "education_grad_prof": 30537,
            "education_hs_grad": 131291,
            "education_less_than_hs": 83757,
            "education_some_college": 153587,
            "ethnicity_hispanic_or_latino": None,
            "ethnicity_not_hispanic_or_latino": None,
            "id": "1",
            "income_100000_124999": 15875,
            "income_10000_14999": 14204,
            "income_125000_149999": 8498,
            "income_150000_199999": 7070,
            "income_15000_19999": 15839,
            "income_200000_more": 8398,
            "income_20000_24999": 20284,
            "income_25000_29999": 14245,
            "income_30000_34999": 14427,
            "income_35000_39999": 11637,
            "income_40000_44999": 12885,
            "income_45000_49999": 13461,
            "income_50000_59999": 18992,
            "income_60000_74999": 24045,
            "income_75000_99999": 29816,
            "income_9999_less": 20871,
            "income_none": 88598,
            "internet_has": 188576,
            "internet_has_broadband": 187848,
            "internet_has_cellular_data": 158573,
            "internet_has_dialup": 728,
            "internet_has_satellite": 25848,
            "internet_none": 54331,
            "language_speak_only_english": 573218,
            "language_speak_other_languages": 8717,
            "language_speak_spanish": 88099,
            "marriage_divorced": 67295,
            "marriage_never_married": 170674,
            "marriage_now_married": 279377,
            "marriage_separated": 12066,
            "marriage_widowed": 41680,
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
            "state": "TX",
            "veteran": 42665,
            "wikipedia_link": "https://en.wikipedia.org/wiki/Texas%27s_" +
            "1st_congressional_district"
        }
        response = requests.request("GET", live_api_url + 'district/filter?' +
                                    'filter={"state":"TX","population":"' +
                                    '1-750000","median_age":"1-100"}')
        result = response.json()
        with app.app_context():
            self.assertEqual(result[0], expected)
        print("\nTEST 32: Filtering API: District - filter by state, " +
              "population, and median age - data consistent")

    def test_33(self):
        self.maxDiff = None
        expected = {
            "alpha_num": "MT-At-Large",
            "citizenship_not_a_us_citizen": 10308,
            "citizenship_us_citizen_born_abroad_of_american_parents": 7923,
            "citizenship_us_citizen_born_in_pr_or_us_island_areas": 886,
            "citizenship_us_citizen_born_in_us": 1011818,
            "citizenship_us_citizen_by_naturalization": 11585,
            "computers_has_desktop_laptop": 325736,
            "computers_has_one_or_more": 365158,
            "computers_has_other": 8342,
            "computers_has_smartphone": 282247,
            "computers_has_tablet": 220613,
            "computers_none": 50967,
            "education_bachelors": 148944,
            "education_grad_prof": 71662,
            "education_hs_grad": 206415,
            "education_less_than_hs": 51238,
            "education_some_college": 234357,
            "ethnicity_hispanic_or_latino": None,
            "ethnicity_not_hispanic_or_latino": None,
            "id": "At-Large",
            "income_100000_124999": 29940,
            "income_10000_14999": 24786,
            "income_125000_149999": 18585,
            "income_150000_199999": 15669,
            "income_15000_19999": 22330,
            "income_200000_more": 15598,
            "income_20000_24999": 22193,
            "income_25000_29999": 22568,
            "income_30000_34999": 24449,
            "income_35000_39999": 22135,
            "income_40000_44999": 22241,
            "income_45000_49999": 20513,
            "income_50000_59999": 33707,
            "income_60000_74999": 43775,
            "income_75000_99999": 50902,
            "income_9999_less": 26734,
            "income_none": 73606,
            "internet_has": 331897,
            "internet_has_broadband": 328132,
            "internet_has_cellular_data": 246617,
            "internet_has_dialup": 3765,
            "internet_has_satellite": 34446,
            "internet_none": 68144,
            "language_speak_only_english": 944993,
            "language_speak_other_languages": 24693,
            "language_speak_spanish": 11691,
            "marriage_divorced": 105525,
            "marriage_never_married": 248980,
            "marriage_now_married": 440100,
            "marriage_separated": 9524,
            "marriage_widowed": 48164,
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
            "state": "MT",
            "veteran": 85461,
            "wikipedia_link": "https://en.wikipedia.org/wiki/Montana%27s_" +
            "at-large_congressional_district"
        }
        response = requests.request("GET", live_api_url + 'district/filter?' +
                                    'filter={"order_by":"population_desc"}')
        result = response.json()
        with app.app_context():
            self.assertEqual(result[0], expected)
        print("\nTEST 33: Filtering API: District - sort by population - " +
              "data consistent")

    def test_34(self):
        self.maxDiff = None
        # insert the district
        expected = {
            "Error": "Filter Query Invalid"
        }
        response = requests.request("GET", live_api_url + 'district/filter' +
                                    '?filter')
        result = response.json()
        with app.app_context():
            self.assertEqual(result, expected)
        print("\nTEST 34: Filtering API: District - Bad Filter Query  " +
              "- Response OK")

    def test_35(self):
        self.maxDiff = None
        # insert the district
        response = requests.request("GET", live_api_url + 'search/?' +
                                    'query=random')
        result = response.json()
        with app.app_context():
            self.assertEqual(result, [])
        print("\nTEST 35: Searching API: searching 'random' keyword  - " +
              "search results consistent")

    def test_36(self):
        self.maxDiff = None
        # insert the district
        expected = {
            "articles": [
                {
                    "author": "",
                    "date": "2018-04-12T15:07:00.000+03:00",
                    "id": 196,
                    "representative_id": "C001094",
                    "site": "christiantoday.com",
                    "text": "Home Society Current: Millions to be without " +
                    "electricity by 2030, report warns Millions to be " +
                    "without electricity by 2030, report warns Christian " +
                    "Today staff writer Thu 12 Apr 2018 12:03 " +
                    "BST \nDouble t...",
                    "title": "Millions to be without electricity by " +
                    "2030, report warns",
                    "url": "http://omgili.com/ri/.wHSUbtEfZQZPG8em1VYYR_" +
                    "Py8fO5VkV_hLmh.tvOmYyxYnK8R1sVlmrId9x1iE6qGv3gDqzA1n" +
                    "8liB_UZ6faaW2V1g87g7HDPNf7txj3gNvsXU2khghAYACyQUV1vqj" +
                    "Pi7JNrYvPXpSBgbCtBuDeg--"
                },
                {
                    "author": "Jessica Gonzalez For the Daily Press",
                    "date": "2018-04-12T16:42:00.000+03:00",
                    "id": 197,
                    "representative_id": "C001094",
                    "site": "vvdailypress.com",
                    "text": "A gym to call their own: Hook Junior High " +
                    "celebrates dedication of Marla J. Shackelford " +
                    "Gymnasium Thursday Apr 12, 2018 at 8:42 AM Apr 12, " +
                    "2018 at 8:42 AM By Jessica GonzalezFor the Daily " +
                    "Press \nVICTO...",
                    "title": "A gym to call their own: Hook Junior High " +
                    "celebrates dedication of Marla J. Shackelford Gymnasium",
                    "url": "http://omgili.com/ri/jHIAmI4hxg9v2EmYdt42c." +
                    "02vcKARnpfTKCWJxiclYVMXrzjT9chDXQdstKzhj0XnizJFEcd4j" +
                    "mCDXMHJWvMzTIK7bzACu0QD7FEvyKEuudGV_Pp_jL5ZK5RoB2jMzPO" +
                    "tLFFXv6gYNTRcgMkSVz3KVQgz2wqjQ62Qa.W1LeHJKbnuVu7n7FgUA--"
                },
                {
                    "author": "",
                    "date": "2018-04-12T08:18:00.000+03:00",
                    "id": 198,
                    "representative_id": "C001094",
                    "site": "grandnews24.com",
                    "text": "The Clash Paul Simonon arrested while working " +
                    "as undercover Greenpeace activist The Clash Paul " +
                    "Simonon arrested while working as undercover " +
                    "Greenpeace activist April 12, 2018 Culture Musician " +
                    "reve...",
                    "title": "The Clash's Paul Simonon arrested while " +
                    "working as undercover Greenpeace activist | Grand " +
                    "News 24",
                    "url": "http://omgili.com/ri/_DuQb1SwTFpGysR6_HueQcz2" +
                    "ETCNAd6MlAZQaGB_hVW620fZrmhp6cHd3hzgUI8Zs14gynM4Qa6M" +
                    "HjKargaW27WUGZ0fJ6xXX9Fi8vsqqDQIrdIkpfTHKp.fnJ6nSNki" +
                    "gDLkXqlOGSPL3gxTpG_DjQ--"
                }
            ],
            "bioguide": "C001094",
            "district": "8",
            "facebook": "RepPaulCook",
            "firstname": "Paul",
            "image_uri": "https://theunitedstates.io/images/congress/225x275" +
            "/C001094.jpg",
            "lastname": "Cook",
            "office": "1222 Longworth House Office Building",
            "party_id": 2,
            "rank": 1,
            "state": "CA",
            "twitter": "RepPaulCook",
            "url": "https://cook.house.gov",
            "votes_with_party_pct": 95.41,
            "youtube": "RepPaulCook"
        }

        response = requests.request("GET", live_api_url + 'search/?query=' +
                                    'paul ryan')
        result = response.json()
        with app.app_context():
            self.assertEqual(removeunicode(json.dumps(result[0],
                             sort_keys=True)), removeunicode(
                             json.dumps(expected, sort_keys=True)))
            self.assertTrue('Paul' in result[0].values())
        print("\nTEST 36: Searching API: searching 'paul ryan' keyword  - " +
              "search results consistent")

    def test_37(self):
        self.maxDiff = None
        # insert the district
        expected = {
            "chair": "Ronna Romney McDaniel",
            "formation_date": "March 20, 1854",
            "id": 2,
            "name": "Republican Party",
            "office": "430 South Capitol Street Southeast Washington, DC " +
            "20003",
            "path": "republican_party",
            "rank": 1
        }

        response = requests.request("GET", live_api_url + 'search/?' +
                                    'query=republican')
        result = response.json()
        with app.app_context():
            self.assertEqual(result[0], expected)
            self.assertEqual(len(result), 475)
        print("\nTEST 37: Searching API: searching 'republican' keyword  - " +
              "search results consistent")

    def test_38(self):
        self.maxDiff = None
        # insert the district
        response = requests.request("GET", live_api_url + 'search/?' +
                                    'query=texas')
        result = response.json()
        with app.app_context():
            self.assertEqual(len(result), 73)
        print("\nTEST 38: Searching API: searching 'texas' keyword  - search"
              " results consistent")

    def test_39(self):
        self.maxDiff = None
        # insert the district
        expected = {
            "alpha_num": "TX-36",
            "id": "36",
            "median_age": 36.5,
            "population": 732975,
            "rank": 1,
            "representative_id": "B001291",
            "state": "TX",
            "state_full": "Texas"
        }
        response = requests.request("GET", live_api_url + 'search/?' +
                                    'query=TX-36')
        result = response.json()
        with app.app_context():
            self.assertEqual(result[0], expected)
        print("\nTEST 39: Searching API: searching 'TX-36' keyword  - " +
              "search results consistent")

    def test_40(self):
        self.maxDiff = None
        # insert the district
        expected = {
            "chair": "Will Christensen",
            "formation_date": "May 16, 1998",
            "id": 18,
            "name": "American Independent Party",
            "office": "",
            "path": "american_independent_party",
            "rank": 1
        }
        response = requests.request("GET", live_api_url + 'search/?' +
                                    'query=party')
        result = response.json()
        with app.app_context():
            self.assertEqual(len(result), 900)
            self.assertEqual(result[0], expected)
        print("\nTEST 40: Searching API: searching 'party' keyword  - "
              "search results consistent")

    def test_41(self):
        self.maxDiff = None
        # insert the district
        response = requests.request("GET", live_api_url + 'search/?query=')
        result = response.json()
        with app.app_context():
            self.assertEqual(result, [])
        print("\nTEST 41: Searching API: searching empty query  - search " +
              "results consistent")

    def test_42(self):
        self.maxDiff = None
        # insert the district
        expected = {
            "Error": "Search Query Invalid"
        }
        response = requests.request("GET", live_api_url + 'search/?')
        result = response.json()
        with app.app_context():
            self.assertEqual(result, expected)
        print("\nTEST 42: Searching API: bad search query  - search results " +
              "consistent")

if __name__ == '__main__':
    print("\n\n\n##########\tBEGINNING BACKEND UNIT TESTS\t##########\n")
    unittest.main()
