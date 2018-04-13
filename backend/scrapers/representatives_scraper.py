import requests
import json
import os
import sys
from apikeys import API
sys.path.insert(1, os.path.join(sys.path[0], '..'))
from app import create_app, db
from models import Representative, Bill

CURRENT_CONGRESS = 115
API_KEY = API['PROPUBLICA_API_KEY']

RepURL = 'https://api.propublica.org/congress/v1/' + str(CURRENT_CONGRESS) + '/house/members.json'
BillURL = 'https://api.propublica.org/congress/v1/members/{member-id}/bills/{type}.json'

headers = {
	'x-api-key': PROPUBLICA_API_KEY,
}

app = create_app()
app.app_context().push()

today = datetime.date.today()
two_weeks_ago = today - datetime.timedelta(days=14)

RepURL = 'https://api.propublica.org/congress/v1/' + str(CURRENT_CONGRESS) + '/house/members.json'
response = requests.request('GET', RepURL, headers=headers)
members = response.json()
for mem in members['results'][0]['members']:
	if mem['title'] == 'Representative' and mem['in_office']:
		rep = Representative(
			bioguide = mem['id'],
			firstname = mem['first_name'],
			lastname = mem['last_name'],
			party_id = 2 if mem['party'] == 'R' else 1,
			state = mem['state'],
			district = str(mem['district']),
			twitter = mem['twitter_account'],
			youtube = mem['youtube_account'],
			facebook = mem['facebook_account'],
			office = mem['office'],
			votes_with_party_pct = mem['votes_with_party_pct'],
			url = mem['url'],
			image_uri = 'https://theunitedstates.io/images/congress/225x275/' + mem['id'] +'.jpg'
			)
		BillURL = 'https://api.propublica.org/congress/v1/members/' + rep.bioguide +'/bills/introduced.json'
		print(BillURL)
		response2 = requests.request('GET', BillURL, headers=headers)
		bills = response2.json()
		for i in range(0, 3):
			if len(bills['results'][0]['bills']) == i:
				break
			billList = bills['results'][0]['bills'][i]
			recentBill = Bill(
				number = billList['number'],
				short_title = billList['short_title'],
				sponsor_id = billList['sponsor_id'],
				congressdotgov_url = billList['congressdotgov_url'],
				introduced_date = billList['introduced_date'],
				latest_major_action = billList['latest_major_action']
				)
			rep.bills.append(recentBill)

		oldrep = Representative.query.filter(Representative.bioguide == rep.bioguide).first()
		if oldrep == None:
			db.session.add(rep)
			db.session.commit()
		else:
			oldrep.firstname = rep.firstname
			oldrep.lastname = rep.lastname
			oldrep.party_id = rep.party_id
			oldrep.state = rep.state
			oldrep.district = rep.district
			oldrep.twitter = rep.twitter
			oldrep.youtube = rep.youtube
			oldrep.votes_with_party_pct = rep.votes_with_party_pct
			oldrep.url = rep.url
			oldrep.image_uri = rep.image_uri
			oldrep.bills = rep.bills
			db.session.commit()
