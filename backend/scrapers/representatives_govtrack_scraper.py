import requests
import os
import sys

sys.path.insert(1, os.path.join(sys.path[0], '..'))
from app import create_app, db
from models import Representative


CURRENT_CONGRESS = 115
API_URL = 'https://www.govtrack.us/api/v2/role?current=true&limit=600'
IMG_URL = 'https://theunitedstates.io/images/congress/225x275/'


def main():
    """
    Scrapes information on members of the House of Representatives from
    govtrack.us.
    """

    app = create_app()
    app.app_context().push()
    response = requests.request('GET', API_URL)
    members = response.json()
    for mem in members['objects']:
        if mem['district'] is not None and \
           mem['title_long'] == 'Representative' and \
           mem['congress_numbers'][len(mem['congress_numbers']) - 1] == \
           CURRENT_CONGRESS:

            district = "At-Large"
            if mem['district'] > 0:
                district = str(mem['district'])
            party_id = 1
            if mem['party'] == 'Republican':
                party_id = 2

            rep = Representative(
                bioguide=mem['person']['bioguideid'],
                firstname=mem['person']['firstname'],
                lastname=mem['person']['lastname'],
                party_id=party_id,
                state=mem['state'],
                district=district,
                twitter=mem['person']['twitterid'],
                youtube=mem['person']['youtubeid'],
                office=mem['extra']['office'],
                url=mem['website'],
                cspanid=mem['person']['cspanid'],
                osid=mem['person']['osid'],
                birthday=mem['person']['birthday'],
                gender=mem['person']['gender'],
                image_uri=IMG_URL + mem['person']['bioguideid'] + '.jpg'
            )

            rep2 = Representative.query.filter(
                Representative.bioguide == rep.bioguide).first()
            if rep2 is not None:
                db.session.add(rep)
                db.session.commit()
            else:
                rep2.firstname = rep.firstname
                rep2.lastname = rep.lastname
                rep2.party_id = rep.party_id
                rep2.state = rep.state
                rep2.district = rep.district
                rep2.twitter = rep.twitter
                rep2.youtube = rep.youtube
                rep2.office = rep.office
                rep2.url = rep.url
                rep2.cspanid = rep.cspanid
                rep2.osid = rep.osid
                rep2.bithday = rep.birthday
                rep2.gender = rep.gender
                rep2.image_uri = rep.image_uri
                db.session.commit()


if __name__ == "main":
    main()
