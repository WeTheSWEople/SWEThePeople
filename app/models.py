from app import db

class Representative(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	bioguide = db.Column(db.String(50), index=True, nullable=False)
	firstname = db.Column(db.String(255))
	lastname = db.Column(db.String(255))
	party = db.Column(db.String(50))
	state = db.Column(db.String(50))
	district = db.Column(db.Integer)
	image_uri = db.Column(db.String(255))


	def format(self):
	    return {
	        "id": self.id,
	        "bioguide": self.bioguide,
	        "firstname": self.firstname,
	        "lastname": self.lastname,
	        "party": self.party,
	        "state": self.state,
	        "district": self.district,
	        "imageUri": self.image_uri
	    }

	def __repr__(self):
		return '<Representative {}: {!r} {}>'.format(self.id, self.lastname, self.bioguide)









