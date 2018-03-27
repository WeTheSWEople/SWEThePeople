import requests
import json
import os
#import apikeys
from app.app import create_app, db
from app.models import Representative, Bill

CURRENT_CONGRESS = 115

RepURL = 'https://www.govtrack.us/api/v2/role?current=true&limit=600'


app = create_app()
app.app_context().push()
#rep = Representative(bioguide='C001111', firstname='Charlie', lastname='Crist', party='Republican', state='FL', district=13, twitter='', youtube='', office='', votes_with_party_pct = 89.45, url = "", image_uri = '')

response = requests.request('GET', RepURL)
members = response.json()
for mem in members['objects']:
	if mem['district'] != None and mem['title_long'] == 'Representative' and mem['congress_numbers'][len(mem['congress_numbers']) - 1] == CURRENT_CONGRESS:
		rep = Representative(
			bioguide = mem['person']['bioguideid'],
			firstname = mem['person']['firstname'],
			lastname = mem['person']['lastname'],
			party_id = 2 if mem['party'] == 'Republican' else 1,
			state = mem['state'],
			district = str(mem['district']) if mem['district'] > 0 else "At-Large",
			twitter = mem['person']['twitterid'],
			youtube = mem['person']['youtubeid'],
			office = mem['extra']['office'],
			url = mem['website'],
			cspanid = mem['person']['cspanid'],
			osid = mem['person']['osid'],
			birthday = mem['person']['birthday'],
			gender = mem['person']['gender'],
			image_uri = 'https://theunitedstates.io/images/congress/225x275/' + mem['person']['bioguideid'] +'.jpg'
			)
		# BillURL = 'https://api.propublica.org/congress/v1/members/' + rep.bioguide +'/bills/introduced.json'
		# response2 = requests.request('GET', BillURL, headers=headers)
		# bills = response2.json()
		# for i in range(0, 3):
		# 	if len(bills['results'][0]['bills']) == i:
		# 		break
		# 	billList = bills['results'][0]['bills'][i]
		# 	recentBill = Bill(
		# 		number = billList['number'],
		# 		short_title = billList['short_title'],
		# 		sponsor_id = billList['sponsor_id'],
		# 		congressdotgov_url = billList['congressdotgov_url'],
		# 		introduced_date = billList['introduced_date'],
		# 		latest_major_action = billList['latest_major_action']
		# 		)
		# 	rep.bills.append(recentBill)

		rep2 = Representative.query.filter(Representative.bioguide == rep.bioguide).first()
		if rep2 == None:
			db.session.add(rep)
			db.session.commit()
		else:
			rep2.firstname = rep.firstname
			rep2.lastname = rep.lastname
			rep2.party_id = rep.party_id
			rep2.state = rep.state
			rep2.district = rep.district
			rep2.twitter = rep.twitter
			rep2.youtube = rep.youtube
			rep2.office = rep.office
			rep2.url = rep.url
			rep2.cspanid = rep.cspanid
			rep2.osid = rep.osid
			rep2.bithday = rep.birthday
			rep2.gender = rep.gender
			rep2.image_uri = rep.image_uri
			db.session.commit()
