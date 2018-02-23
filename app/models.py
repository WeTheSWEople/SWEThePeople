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
		return '<Representative {}: {!r} {}>'.format(self.bioguide, self.firstname, self.lastname, self.party, self.state, self.district, self.twitter, self.youtube, self.office, self.votes_with_party_pct, self.url, self.image_uri)

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









