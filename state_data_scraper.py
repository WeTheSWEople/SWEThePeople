import requests
import json
import os
import apikeys

data = json.load(open('state.json'))
count = 1
for i in data:
	print(i)
	url = "http://openstates.org/api/v1/metadata/" + i

	headers = {
		'x-api-key': apikeys.state_key()
		}

	response = requests.request("GET", url, headers=headers)

	with open(os.path.join('./idb/src/assets/data/state_data',str(i) + ".json"), "w") as file1:
		file1.write(response.text.encode('utf-8'))
