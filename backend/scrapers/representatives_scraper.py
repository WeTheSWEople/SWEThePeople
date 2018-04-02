import requests
import json
import os
import datetime

#import apikeys
from app.app import create_app, db
from app.models import Representative, Bill

CURRENT_CONGRESS = 115
PROPUBLICA_API_KEY = 'icU6XnQ63Mu9qDhEg1QCz0Emb7wt5n9GoLEAEnmI'
WEBHOSE_API_KEY = '8e4f2b2d-f5a9-4bcc-b505-c73941228b74'

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

		ArticleURL = 'http://webhose.io/filterWebContent?token=' +
			WEBHOSE_API_KEY + '&format=json&ts=1520976327081&sort=relevancy&q='
			+ '%22' + rep.firstname + '%20' + rep.lastname + '%22%20' +
			'language%3Aenglish%20site_type%3Anews%20thread.country%3AUS'

		response3 = requests.request('GET', ArticleURL)
		articles = response3.json()
		for i in range(0, 3):
			if len(articles['posts']) == i:
				break
			article = articles['posts'][i]
			recentArticle = Article(
				title = article['title']
				url = article['url']
				author = article['author']
				text = article['text']
				date = article['published']
				site = article['thread']['site']
				representative_id = rep.bioguide
			)

			rep.articles.append(recentArticle)

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
			rep2.articles = rep.articles
			db.session.commit()
