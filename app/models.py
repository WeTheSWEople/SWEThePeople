from app import db

class Representative(db.Model):
	__tablename__ = 'representative'
	bioguide = db.Column(db.String(50), index=True, nullable=False, primary_key=True)
	firstname = db.Column(db.String(255))
	lastname = db.Column(db.String(255))
	party = db.Column(db.String(50))
	state = db.Column(db.String(50))
	district = db.Column(db.String(50))
	twitter = db.Column(db.String(75))
	youtube = db.Column(db.String(255))
	office = db.Column(db.String(255))
	votes_with_party_pct = db.Column(db.Float)
	url = db.Column(db.String(255))
	image_uri = db.Column(db.String(255))
	bills = db.relationship('Bill', lazy=True)


	def format(self):
	    return {
	        "bioguide": self.bioguide,
	        "firstname": self.firstname,
	        "lastname": self.lastname,
	        "party": self.party,
	        "state": self.state,
	        "district": self.district,
	        "twitter" : self.twitter,
			"youtube" : self.youtube,
			"office" : self.office,
			"votes_with_party_pct" : self.votes_with_party_pct,
			"url" : self.url,
	        "image_uri": self.image_uri,
	        "bills" : [x for x in self.bills]
	    }

	def __repr__(self):
		return '<Representatives {}: {!r} {}>'.format(self.bioguide, self.firstname, self.lastname, self.party, self.state, self.district, self.twitter, self.youtube, self.office, self.votes_with_party_pct, self.url, self.image_uri)

class Bill(db.Model):
	__tablename__ = 'Bill'
	id = db.Column(db.Integer, primary_key=True)
	number = db.Column(db.String(255))
	short_title = db.Column(db.Text)
	sponsor_id = db.Column(db.String(255), db.ForeignKey('representative.bioguide'), nullable=False)
	congressdotgov_url = db.Column(db.String(255))
	introduced_date = db.Column(db.String(100))
	latest_major_action = db.Column(db.Text)

	def format(self):
	    return {
	        "id": self.id,
	        "number": self.number,
	        "short_title": self.short_title,
	        "sponsor_id": self.sponsor_id,
	        "congressdotgov_url": self.congressdotgov_url,
	        "introducted_date": self.introducted_date,
	        "latest_major_action" : self.latest_major_action
	    }

	def __repr__(self):
		return '<Bills {}: {!r} {}>'.format(self.id, self.number)

class District(db.Model):
	__tablename__ = 'District'
	alpha_num = db.Column(db.String(10), index=True, nullable=False, primary_key=True)
	state = db.Column(db.Integer, db.ForeignKey('state.number'), nullable=False)
	number = db.Column(db.Integer)
	representative_id = db.Column(db.String(255), db.ForeignKey('representative.bioguide'), nullable=False)
	population = db.Column(db.Integer)
	median_age = db.Column(db.Integer)
	median_age_men = db.Column(db.Integer)
	median_age_women = db.Column(db.Integer)
	population_male = db.Column(db.Integer)
	population_white = db.Column(db.Integer)
	population_black_or_african_american = db.Column(db.Integer)
	population_american_indian_and_alaska_native = db.Column(db.Integer)
	population_asian = db.Column(db.Integer)
	population_native_hawaiian_and_other_pacific_islander =
		db.Column(db.Integer)
	population_some_other_race = db.Column(db.Integer)
	population_two_or_more_races = db.Column(db.Integer)

	def format(self):
	    return {
	        "alpha_num": self.alpha_num,
	        "state": self.state,
			"number": self.number,
			"representative_id": self.representative_id,
	        "population": self.population,
	        "median_age": self.median_age,
	        "median_age_men": self.median_age_men,
			"median_age_women": self.median_age_women,
			"population_male": self.population_male,
			"population_white": self.population_white,
			"population_black_or_african_american":
				self.population_black_or_african_american,
			"population_american_indian_and_alaska_native":
				self.population_american_indian_and_alaska_native,
			"population_asian": self.population_asian,
			"population_native_hawaiian_and_other_pacific_islander":
				self.population_native_hawaiian_and_other_pacific_islander,
			"population_some_other_race": self.population_some_other_race,
			"population_two_or_more_races": self.population_two_or_more_races,
	    }

	def __repr__(self):
		return '<Districts {}: {!r} {}>'.format(self.id,
			self.state, self.number)

class State(db.Model):
	__tablename__ = 'State'
	number = db.Column(db.Integer, index=True, nullable=False, primary_key=True)
	name = db.String(255)
	usps_abbreviation = db.Column(db.String(2))
	districts = db.relationship('District', lazy=True)

	def format(self):
	    return {
	        "number": self.number,
	        "name": self.name,
			"usps_abbreviation": self.usps_abbreviation
	    }

	def __repr__(self):
		return '<States {}: {!r} {}>'.format(self.number, self.name)
