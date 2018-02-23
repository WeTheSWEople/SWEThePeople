import requests
import json
import os
#import apikeys
from app.models import Representative, Bill
from app.app import create_app

CURRENT_CONGRESS = 115
API_KEY = 'icU6XnQ63Mu9qDhEg1QCz0Emb7wt5n9GoLEAEnmI'

url = 'https://api.propublica.org/congress/v1/' + str(CURRENT_CONGRESS) + '/house/members.json'

headers = {
	'x-api-key': API_KEY,
}

app = create_app()
app.app_context().push()
#rep = Representative(bioguide=‘R000570’, firstname=‘Paul’, lastname=‘Ryan’, party=‘Republican’, state=‘WI’, district=1, twitter=‘speakerryan’, youtube=“reppaulryan”, office=“1233 Longhorn”, votes_with_party_pct = 85.71, url=“”,  image_uri=’www.google.com')

response = requests.request('GET', url, headers=headers)
members = response["members"]
print(members)


with open(os.path.join('./idb/src/assets/data/representatives.json'), 'w') as file1:
	file1.write(response.text)
db.session.add(rep)
db.session.commit()
