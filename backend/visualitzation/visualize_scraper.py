import requests
import os
import json
import time

# developer group api
api_url = "http://www.hikingadventures.me/api/"


def get_trail_length():
	"""
	- function to get the data for trails and their length
	- saves the data into a tab-seperated-value (.tsv) file
	"""
	f = open("trail-length.tsv", 'w')
	f.write('trail\tlength\tspecies\n')
	last_page = False
	page_num = 1
	count = 1
	length_list = []
	while not last_page:
		response = requests.request("GET", api_url+'trails?page=' + 
			str(page_num))
		if response.ok:
			response = response.json()
			for obj in response['objects']:
				length = obj['length']
				length_list.append(float(length))
				count += 1
			page_num += 1
			last_page = response['page'] >= response['total_pages']
	cur_div = 1
	length_list.sort()
	count = 0
	for num in length_list:
		if num > cur_div:
			f.write(str(cur_div - 1)+ '-' + str(cur_div) + '\t' + str(count) + 
				'\ttrail-length\n')
			cur_div += 1
			count = 1
		else:
			count += 1
	f.write(str(cur_div - 1)+ '-' + str(cur_div) + '\t' + str(count) + 
		'\ttrail-length\n')		
	f.close()

def get_num_photos():
	"""
	- function to get the data for resorts and num of photos associated with 
	each resort
	- saves the data into a tab-seperated-value (.tsv) file
	"""
	f = open("resort-to-photos.tsv", 'w')
	f.write('resort\tphotos\tspecies\n')
	last_page = False
	page_num = 1
	count = 1
	while not last_page:
		response = requests.request("GET", api_url+'resorts?page=' + 
			str(page_num))
		if response.ok:
			response = response.json()
			for obj in response['objects']:
				resort_name = obj['name']
				resort_id = obj['id']
				count += 1
				photo_response = requests.request("GET", api_url+'resorts/'+ 
					str(resort_id) + '/photos')
				if photo_response.ok:
					photo_response = photo_response.json()
					if 'num_results' in photo_response:
						total_photos = photo_response['num_results']
						f.write(str(resort_name) + '\t' + str(total_photos) + 
							'\tresort-photos\n')
			page_num += 1
			last_page = response['page'] >= response['total_pages']
	f.close()



def get_bestnumtrails():
	"""
	- function to get the data for resorts and number of five star trails each 
	resort has
	- saves the data into a tab-seperated-value (.tsv) file
	"""
	f = open("resort-to-fivestartrail.tsv", 'w')
	f.write('resort\tfivestartrail\tspecies\n')
	last_page = False
	page_num = 1
	while not last_page:
		response = requests.request("GET", api_url+'resorts?page=' + 
			str(page_num))
		if response.ok:
			response = response.json()
			for obj in response['objects']:
				resort_id = obj['id']
				trail_last_page = False
				trail_page_num = 1
				total_stars = 0
				total_trails = 0
				avg_stars = 0
				star_trails = 0
				while not trail_last_page:
					trail_response = requests.request("GET", api_url+ 
						'resorts/'+ str(resort_id) + '/trails?page=' + 
						str(trail_page_num))
					if trail_response.ok:
						trail_response = trail_response.json()
						total_trails = trail_response['num_results']
						for trail_obj in trail_response['objects']:
							if trail_obj['stars'] > 4:
								star_trails += 1
						trail_last_page = trail_response['page'] >= \
						trail_response['total_pages']
						trail_page_num += 1
				f.write(str(obj['name']) + '\t' + str(star_trails) + 
					'\tresort-fivestartrail\n')
			page_num += 1
			last_page = response['page'] >= response['total_pages']
	f.close()


def get_difficulty_data():
	"""
	- function to get the data for difficulty and number of trails associated 
	with each difficulty
	- saves the data into a tab-seperated-value (.tsv) file
	"""
	f = open("difficulty.tsv", 'w')
	f.write('difficulty\tnumtrails\tspecies\n')
	last_page = False
	page_num = 1
	count = 0
	diff_dict = {}
	while not last_page:
		response = requests.request("GET", api_url+'trails?page=' + 
			str(page_num))
		if response.ok:
			response = response.json()
			for obj in response['objects']:
				difficulty = obj['difficulty']
				if difficulty not in diff_dict:
					diff_dict[difficulty] = 1
				else:
					diff_dict[difficulty] += 1
				count += 1
			page_num += 1
			last_page = response['page'] >= response['total_pages']
	for item in diff_dict:
		f.write(str(item) + '\t' + str(diff_dict[item]) + 
			'\tdifficulty-trails\n')
	f.close()


def get_difficulty_and_ascent():
	"""
	- function to get the data for difficulty and average ascent associated 
	with each difficulty group to see if they have any correalation
	- saves the data into a tab-seperated-value (.tsv) file
	"""
	f = open("difficulty_ascent.tsv", 'w')
	f.write('difficulty\tascent\tspecies\n')
	last_page = False
	page_num = 1
	count = 0
	diff_dict = {}
	ascent_sum = {}
	while not last_page:
		response = requests.request("GET", api_url+'trails?page=' + 
			str(page_num)+'&results_per_page=100')
		if response.ok:
			response = response.json()
			for obj in response['objects']:
				difficulty = obj['difficulty']
				ascent = obj['ascent']
				if difficulty not in diff_dict:
					diff_dict[difficulty] = (ascent, 1)
					
				else:
					diff_dict[difficulty] = (diff_dict[difficulty][0] + 
						ascent, diff_dict[difficulty][1] + 1)
				count += 1
			page_num += 1
			last_page = response['page'] >= response['total_pages']
		else:
			time.sleep(2)
	del(diff_dict['missing'])
	for item in diff_dict:
		f.write(str(item) + '\t' + 
			str((1.0 * diff_dict[item][0])/diff_dict[item][1]) + 
			'\tdifficulty-ascent\n')
	f.close()

def get_difficulty_and_descent():
	"""
	- function to get the data for difficulty and average descent associated 
	with each difficulty group to see if they have any correalation
	- saves the data into a tab-seperated-value (.tsv) file
	"""
	f = open("difficulty_descent.tsv", 'w')
	f.write('difficulty\tdescent\tspecies\n')
	last_page = False
	page_num = 1
	count = 0
	diff_dict = {}
	while not last_page:
		response = requests.request("GET", api_url+'trails?page=' + 
			str(page_num)+'&results_per_page=100')
		if response.ok:
			response = response.json()
			for obj in response['objects']:
				difficulty = obj['difficulty']
				descent = obj['descent'] * -1
				if difficulty not in diff_dict:
					diff_dict[difficulty] = (descent, 1)
					
				else:
					diff_dict[difficulty] = (diff_dict[difficulty][0] + 
						descent, diff_dict[difficulty][1] + 1)
				count += 1
			page_num += 1
			last_page = response['page'] >= response['total_pages']
		else:
			time.sleep(2)
	del(diff_dict['missing'])
	for item in diff_dict:
		f.write(str(item) + '\t' + 
			str((1.0 * diff_dict[item][0])/diff_dict[item][1]) + 
			'\tdifficulty-descent\n')
	f.close()


def main():
	"""
	main function to call the sub functions to get each type of data
	"""
	#get_trail_length() # USING IT
	#get_num_photos() # USING IT
	#get_bestnumtrails() # USING IT
	#get_difficulty_data() # USING IT
	#get_difficulty_and_ascent() # USING IT
 	get_difficulty_and_descent() # USING IT

if __name__ == "__main__":
    main()



