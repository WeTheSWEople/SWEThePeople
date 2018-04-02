from app import db

class Representative(db.Model):
	__tablename__ = 'representative'
	bioguide = db.Column(db.String(50), index=True, nullable=False, primary_key=True)
	firstname = db.Column(db.String(255))
	lastname = db.Column(db.String(255))
	party_id = db.Column(db.Integer, db.ForeignKey('political_party.id'), nullable = False)
	state = db.Column(db.String(50))
	district = db.Column(db.String(50))
	twitter = db.Column(db.String(75))
	youtube = db.Column(db.String(255))
	facebook = db.Column(db.String(255))
	office = db.Column(db.String(255))
	votes_with_party_pct = db.Column(db.Float)
	url = db.Column(db.String(255))
	image_uri = db.Column(db.String(255))
	bills = db.relationship('Bill', lazy=True)
	articles = db.relationship('Article', lazy=True)

	def format(self):
	    return {
	        "bioguide": self.bioguide,
	        "firstname": self.firstname,
	        "lastname": self.lastname,
	        "party_id": self.party_id,
	        "state": self.state,
	        "district": self.district,
	        "twitter" : self.twitter,
			"youtube" : self.youtube,
			"facebook": self.facebook,
			"office" : self.office,
			"votes_with_party_pct" : self.votes_with_party_pct,
			"url" : self.url,
	        "image_uri": self.image_uri,
	        "bills": [x.format() for x in self.bills]
			"articles": [x.format() for x in self.articles]
	    }

	def __repr__(self):
		return '<Representatives {}: {!r} {}>'.format(self.bioguide, self.firstname, self.lastname, self.party_id, self.state, self.district, self.twitter, self.youtube, self.facebook, self.office, self.votes_with_party_pct, self.url, self.image_uri)

class Bill(db.Model):
	__tablename__ = 'bill'
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
	        "introduced_date": self.introduced_date,
	        "latest_major_action" : self.latest_major_action
	    }

	def __repr__(self):
		return '<Bills {}: {}>'.format(self.id, self.number)

class Article(db.Model):
	__tablename__ = 'article'
	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String(255))
	url = db.Column(db.String(255))
	author = db.Column(db.String(255))
	text = db.Column(db.String(255))
	date = db.Column(db.String(255))
	site = db.Column(db.String(255))
	representative_id = db.Column(db.String(255), db.ForeignKey('representative.bioguide'), nullable=False)

	def format(self):
	    return {
	        "id": self.id,
	        "title": self.title,
	        "url": self.url,
	        "author": self.author,
			"text": self.author,
			"date": self.date,
			"site": self.site,
	        "representative_id" : self.representative_id
	    }

	def __repr__(self):
		return '<Articles {}: {}>'.format(self.id, self.title, self.site, self.date, self.representative_id)

class State(db.Model):
	__tablename__ = 'state'
	usps_abbreviation = db.Column(db.String(2), primary_key=True, nullable=False, index=True)
	number = db.Column(db.Integer, nullable=False)
	name = db.Column(db.String(255), unique=True, nullable=False)
	districts = db.relationship('District', lazy=True)

	def format(self):
	    return {
	        "usps_abbreviation": self.usps_abbreviation,
	        "number": self.number,
	        "name": self.name,
			"districts" : [x.format() for x in self.districts]
	    }

	def __repr__(self):
		return '<States {}: {}>'.format(self.number, self.name)

class District(db.Model):
	__tablename__ = 'district'
	alpha_num = db.Column(db.String(11), index=True, nullable=False, primary_key=True)
	state = db.Column(db.String(2), db.ForeignKey('state.usps_abbreviation'))
	id = db.Column(db.String(8))
	representative_id = db.Column(db.String(255), db.ForeignKey('representative.bioguide'))
	population = db.Column(db.Integer)
	median_age = db.Column(db.Float)
	median_age_male = db.Column(db.Float)
	median_age_female = db.Column(db.Float)
	population_male = db.Column(db.Integer)
	population_white = db.Column(db.Integer)
	population_black_or_african_american = db.Column(db.Integer)
	population_american_indian_and_alaska_native = db.Column(db.Integer)
	population_asian = db.Column(db.Integer)
	population_native_hawaiian_and_other_pacific_islander = \
		db.Column(db.Integer)
	population_some_other_race = db.Column(db.Integer)
	population_two_or_more_races = db.Column(db.Integer)

	def format(self):
	    return {
	        "alpha_num": self.alpha_num,
	        "state": self.state,
			"id": self.id,
			"representative_id": self.representative_id,
	        "population": self.population,
	        "median_age": self.median_age,
	        "median_age_male": self.median_age_male,
			"median_age_female": self.median_age_female,
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
		return '<Districts {}: {} {}>'.format(self.alpha_num,
			self.state, self.id)

class PoliticalParty(db.Model):
    __tablename__ = 'political_party'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(255))
    path = db.Column(db.String(255))
    chair = db.Column(db.String(255))
    formation_date = db.Column(db.String(255))
    twitter_handle = db.Column(db.String(255))
    youtube = db.Column(db.String(255))
    office = db.Column(db.String(255))
    website = db.Column(db.String(255))
    colors = db.relationship('PartyColor', lazy = True)
    representatives = db.relationship('Representative', lazy = True)

    def format(self):
        return {
            "id": self.id,
            "name": self.name,
            "path": self.path,
            "chair": self.chair,
            "formation_date": self.formation_date,
            "twitter_handle": self.twitter_handle,
            "youtube": self.youtube,
            "office": self.office,
            "website": self.website,
            "colors": [c.format() for c in self.colors],
            "representatives": [r.format() for r in self.representatives]
        }

    def __repr__(self):
        return '<PoliticalParty {}: {}>'.format(self.id, self.name)

class PartyColor(db.Model):
    __tablename__ = 'party_color'
    id = db.Column(db.Integer, primary_key = True)
    party_id = db.Column(db.Integer,
        db.ForeignKey('political_party.id'), nullable = False)
    color = db.Column(db.String(255))

    def format(self):
        return {
            "id": self.id,
            "party_id": self.party_id,
            "color": self.color
        }

    def __repr__(self):
        return '<PartyColor {}: {}>'.format(self.id, self.color)
