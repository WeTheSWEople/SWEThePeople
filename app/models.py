from app import db

class Representative(db.Model):
    __tablename__ = 'representative'
    bioguide = db.Column(db.String(50), index=True, nullable=False, \
        primary_key=True)
    firstname = db.Column(db.String(255))
    lastname = db.Column(db.String(255))
    party = db.Column(db.Integer, \
        db.ForeignKey('political_party.id', nullable = False)
    state = db.Column(db.String(50))
    district = db.Column(db.Integer)
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
            "bills" : [x.format() for x in self.bills]
        }

    def __repr__(self):
        return '<Representative {}: {} {}>'.format(self.bioguide, \
            self.lastname, self.bioguide)

class Bill(db.Model):
    __tablename__ = 'Bill'
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(255))
    short_title = db.Column(db.Text)
    sponsor_id = db.Column(db.String(255), \
        db.ForeignKey('representative.bioguide'), nullable=False)
    congressdotgov_url = db.Column(db.String(255))
    introduced_date = db.Column(db.String(100))
    latest_major_action = db.Column(db.Text)

    def format(self):
        return {
            "number": self.number,
            "short_title": self.short_title,
            "sponsor_id": self.sponsor_id,
            "congressdotgov_url": self.congressdotgov_url,
            "introduced_date": self.introduced_date,
            "latest_major_action" : self.latest_major_action
        }

    def __repr__(self):
        return '<Bill {}: {}>'.format(self.id, self.number)

class PoliticalParty(db.Model):
    __tablename__ = 'political_party'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(255))
    chair = db.Column(db.String(255))
    formation_date = db.Column(db.String(255))
    twitter_handle = db.Column(db.String(255))
    youtube = db.Column(db.String(255))
    office = db.Column(db.String(255))
    website = db.Column(db.String(255))
    colors = db.relationship('PartyColor', lazy = True)
    representatives = db.relationship('representative', lazy = True)

    def format(self):
        return {
            "id": self.id,
            "name": self.name,
            "chair": self.chair,
            "formation_date": self.formation_date,
            "twitter_handle": self.twitter_handle,
            "youtube": self.youtube,
            "office": self.office,
            "website": self.website,
            "colors": [c.format() for c in self.colors]
            "representatives": [r.format() for r in self.representatives]
        }

    def __repr__(self):
        return '<PoliticalParty {}: {}>'.format(self.id, self.name)

class PartyColor(db.Model):
    __tablename__ = 'party_color'
    id = db.Column(db.Integer, primary_key = True)
    party_id = db.Column(db.Integer, \
        db.ForeignKey('political_party.id', nullable = False))
    color = db.Column(db.String(255))

    def format(self):
        return {
            "id": self.id,
            "party_id": self.party_id,
            "color": self.color
        }

    def __repr__(self):
        return '<PartyColor {}: {}>'.format(self.id, self.color)
