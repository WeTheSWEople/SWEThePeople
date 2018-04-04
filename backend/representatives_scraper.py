import requests
import json
import os
#import apikeys
from app import create_app, db
from models import Representative, Bill

CURRENT_CONGRESS = 115
API_KEY = 'icU6XnQ63Mu9qDhEg1QCz0Emb7wt5n9GoLEAEnmI'

RepURL = 'https://api.propublica.org/congress/v1/' + str(CURRENT_CONGRESS) + '/house/members.json'
BillURL = 'https://api.propublica.org/congress/v1/members/{member-id}/bills/{type}.json'

headers = {
	'x-api-key': API_KEY,
}

app = create_app()
app.app_context().push()
#rep = Representative(bioguide='C001111', firstname='Charlie', lastname='Crist', party='Republican', state='FL', district=13, twitter='', youtube='', office='', votes_with_party_pct = 89.45, url = "", image_uri = '')


response = requests.request('GET', RepURL, headers=headers)
members = response.json()
count = 0
for mem in members['results'][0]['members']:
	print(count)
	count = count + 1
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
			office = mem['office'],
			votes_with_party_pct = mem['votes_with_party_pct'],
			url = mem['url'],
			image_uri = 'https://theunitedstates.io/images/congress/225x275/' + mem['id'] +'.jpg'
			)
		BillURL = 'https://api.propublica.org/congress/v1/members/' + rep.bioguide +'/bills/introduced.json'
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

		rep2 = Representative.query.filter(Representative.bioguide == rep.bioguide).first()
		if rep2 == None:
			db.session.add(rep)
			db.session.commit()
		else:
			rep2.firstname = rep.firstname
			rep2.lastname = rep.lastname
			rep2.party = rep.party
			rep2.state = rep.state
			rep2.district = rep.district
			rep2.twitter = rep.twitter
			rep2.youtube = rep.youtube
			rep2.votes_with_party_pct = rep.votes_with_party_pct
			rep2.url = rep.url
			rep2.image_uri = rep.image_uri
			rep2.bills = rep.bills
			db.session.commit()
