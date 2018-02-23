import requests
import json
import os
#import apikeys

CURRENT_CONGRESS = 115
API_KEY = 'icU6XnQ63Mu9qDhEg1QCz0Emb7wt5n9GoLEAEnmI'

url = 'https://api.propublica.org/congress/v1/' + str(CURRENT_CONGRESS) + '/house/members.json'

headers = {
	'x-api-key': API_KEY,
}

response = requests.request('GET', url, headers=headers)
with open(os.path.join('./idb/src/assets/data/representatives.json'), 'w') as file1:
	file1.write(response.text)
