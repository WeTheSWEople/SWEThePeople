import requests
import json
import os

data = json.load(open('state.json'))
count = 1
for i in data:
	count+=1
	url = "https://api.propublica.org/congress/v1/members/senate/" + i + "/current.json"

	headers = {
		'x-api-key': "bOdIbL6MItwDYrU3ISRxtTi2ttT0B8I5o4eycB7X",
		}

	response = requests.request("GET", url, headers=headers)
	with open(os.path.join('./idb/src/assets/data/senate_data',str(i) + ".json"), "w") as file1:
		file1.write(response.text.encode('utf-8'))
