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
	        "bills": [x.format() for x in self.bills],
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
	title = db.Column(db.String(255))
	url = db.Column(db.String(255), index=True, nullable=False, primary_key=True)
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
	representative_id = \
		db.Column(db.String(255), db.ForeignKey('representative.bioguide'))

	population = db.Column(db.Integer)
	population_male = db.Column(db.Integer)

	median_age = db.Column(db.Float)
	median_age_male = db.Column(db.Float)
	median_age_female = db.Column(db.Float)

	population_white = db.Column(db.Integer)
	population_black_or_african_american = db.Column(db.Integer)
	population_american_indian_and_alaska_native = db.Column(db.Integer)
	population_asian = db.Column(db.Integer)
	population_native_hawaiian_and_other_pacific_islander = \
		db.Column(db.Integer)
	population_some_other_race = db.Column(db.Integer)
	population_two_or_more_races = db.Column(db.Integer)

	ethnicity_not_hispanic_or_latino = db.Column(db.Integer)
	ethnicity_not_hispanic_or_latino = db.Column(db.Integer)

	ethnicity_hispanic_or_latino = db.Column(db.Integer)
	citizenship_us_citizen_born_in_us = db.Column(db.Integer)
	citizenship_us_citizen_born_in_pr_or_us_island_areas = db.Column(db.Integer)
	citizenship_us_citizen_born_abroad_of_american_parents = \
		db.Column(db.Integer)
	citizenship_us_citizen_by_naturalization = db.Column(db.Integer)
	citizenship_not_a_us_citizen = db.Column(db.Integer)

	language_speak_only_english = db.Column(db.Integer)
	language_speak_spanish = db.Column(db.Integer)
	language_speak_other_languages = db.Column(db.Integer)

	marriage_never_married = db.Column(db.Integer)
	marriage_now_married = db.Column(db.Integer)
	marriage_divorced = db.Column(db.Integer)
	marriage_separated = db.Column(db.Integer)
	marriage_widowed = db.Column(db.Integer)

	education_less_than_hs = db.Column(db.Integer)
	education_hs_grad = db.Column(db.Integer)
	education_some_college = db.Column(db.Integer)
	education_bachelors = db.Column(db.Integer)
	education_grad_prof = db.Column(db.Integer)

	income_none = db.Column(db.Integer)
	income_9999_less = db.Column(db.Integer)
	income_10000_14999 = db.Column(db.Integer)
	income_15000_24999 = db.Column(db.Integer)
	income_20000_24999 = db.Column(db.Integer)
	income_25000_29999 = db.Column(db.Integer)
	income_30000_34999 = db.Column(db.Integer)
	income_35000_39999 = db.Column(db.Integer)
	income_40000_44999 = db.Column(db.Integer)
	income_45000_49999 = db.Column(db.Integer)
	income_50000_59999 = db.Column(db.Integer)
	income_60000_74999 = db.Column(db.Integer)
	income_75000_99999 = db.Column(db.Integer)
	income_100000_124999 = db.Column(db.Integer)
	income_125000_149999 = db.Column(db.Integer)
	income_150000_199999 = db.Column(db.Integer)
	income_200000_more = db.Column(db.Integer)

	veteran = db.Column(db.Integer)

	computers_has_one_or_more = db.Column(db.Integer)
	computers_has_desktop_laptop = db.Column(db.Integer)
	computers_has_smartphone = db.Column(db.Integer)
	computers_has_tablet = db.Column(db.Integer)
	computers_has_other = db.Column(db.Integer)
	computers_none = db.Column(db.Integer)

	internet_has = db.Column(db.Integer)
	internet_has_dialup = db.Column(db.Integer)
	internet_has_broadband = db.Column(db.Integer)
	internet_has_cellular_data = db.Column(db.Integer)
	internet_has_satellite = db.Column(db.Integer)
	internet_none = db.Column(db.Integer)

	def format(self):
	    return {
	        "alpha_num": self.alpha_num,
	        "state": self.state,
			"id": self.id,
			"representative_id": self.representative_id,
	        "population": self.population,
			"population_male": self.population_male,

	        "median_age": self.median_age,
	        "median_age_male": self.median_age_male,
			"median_age_female": self.median_age_female,

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

			"ethnicity_not_hispanic_or_latino":
				self.ethnicity_not_hispanic_or_latino,
			"ethnicity_hispanic_or_latino": self.ethnicity_hispanic_or_latino,

			"citizenship_us_citizen_born_in_us":
				self.citizenship_us_citizen_born_in_us,
			"citizenship_us_citizen_born_in_pr_or_us_island_areas":
				self.citizenship_us_citizen_born_in_pr_or_us_island_areas,
			"citizenship_us_citizen_born_abroad_of_american_parents":
				self.citizenship_us_citizen_born_abroad_of_american_parents,
			"citizenship_us_citizen_by_naturalization":
				self.citizenship_us_citizen_by_naturalization,
			"citizenship_not_a_us_citizen": self.citizenship_not_a_us_citizen,

			"language_speak_only_english": self.language_speak_only_english,
			"language_speak_spanish": self.language_speak_spanish,
			"language_speak_other_languages":
				self.language_speak_other_languages,
			"marriage_never_married": self.marriage_never_married,
			"marriage_now_married": self.marriage_now_married,
			"marriage_divorced": self.marriage_divorced,
			"marriage_separated": self.marriage_separated,
			"marriage_widowed": self.marriage_widowed,

			"education_less_than_hs": self.education_less_than_hs,
			"education_hs_grad": self.education_hs_grad,
			"education_some_college": self.education_some_college,
			"education_bachelors": self.education_bachelors,
			"education_grad_prof": self.education_grad_prof,

			"income_none": self.income_none,
			"income_9999_less": self.income_9999_less,
			"income_10000_14999": self.income_10000_14999,
			"income_15000_19999": self.income_15000_19999,
			"income_20000_24999": self.income_20000_24999,
			"income_25000_29999": self.income_25000_29999,
			"income_30000_34999": self.income_30000_34999,
			"income_35000_39999": self.income_35000_39999,
			"income_40000_44999": self.income_40000_44999,
			"income_45000_49999": self.income_45000_49999,
			"income_50000_59999": self.income_50000_59999,
			"income_60000_74999": self.income_60000_74999,
			"income_75000_99999": self.income_75000_99999,
			"income_100000_124999": self.income_100000_124999,
			"income_125000_149999": self.income_125000_149999,
			"income_150000_199999": self.income_150000_199999,
			"income_200000_more": self.income_200000_more,

			"veteran": self.veteran,

			"computers_has_one_or_more": self.computers_has_one_or_more,
			"computers_has_desktop_laptop": self.computers_has_desktop_laptop,
			"computers_has_smartphone": self.computers_has_smartphone,
			"computers_has_tablet": self.computers_has_tablet,
			"computers_has_other": self.computers_has_other,
			"computers_none": self.computers_none,

			"internet_has": self.internet_has,
			"internet_has_dialup": self.internet_has_dialup,
			"internet_has_broadband": self.internet_has_broadband,
			"internet_has_cellular_data": self.internet_has_cellular_data,
			"internet_has_satellite": self.internet_has_satellite,
			"internet_none": self.internet_none
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
