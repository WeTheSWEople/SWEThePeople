import requests
import json
import os
#import apikeys
from app.app import create_app, db
from app.models import Representative, Bill

CURRENT_CONGRESS = 115
API_KEY = 'icU6XnQ63Mu9qDhEg1QCz0Emb7wt5n9GoLEAEnmI'

url = 'https://api.propublica.org/congress/v1/' + str(CURRENT_CONGRESS) + '/house/members.json'

headers = {
	'x-api-key': API_KEY,
}

app = create_app()
app.app_context().push()
#rep = Representative(bioguide='C001111', firstname='Charlie', lastname='Crist', party='Republican', state='FL', district=13, twitter='', youtube='', office='', votes_with_party_pct = 89.45, url = "", image_uri = '')

response = requests.request('GET', url, headers=headers)
members = response.json()
for mem in members['results'][0]['members']:
	if mem['title'] == 'Representative' and mem['in_office']:
		rep = Representative(
			bioguide = mem['id'],
			firstname = mem['first_name'],
			lastname = mem['last_name'],
			party = 'Republican' if mem['party'] == 'R' else 'Democrat',
			state = mem['state'],
			district = str(mem['district']),
			twitter = mem['twitter_account'],
			youtube = mem['youtube_account'],
			votes_with_party_pct = mem['votes_with_party_pct'],
			url = mem['url'],
			image_uri = 'https://theunitedstates.io/images/congress/225x275/' + mem['id'] +'.jpg'
			)
		rep2 = Representative.query.filter(Representative.bioguide == rep.bioguide+"dsdf").first()
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
			db.session.commit()
		

with open(os.path.join('./idb/src/assets/data/representatives.json'), 'w') as file1:
	file1.write(response.text.encode('utf-8'))
#db.session.add(rep)
#db.session.commit()
