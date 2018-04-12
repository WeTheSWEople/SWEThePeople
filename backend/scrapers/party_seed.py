import json
import sys
import os
from apikeys import API
sys.path.insert(1, os.path.join(sys.path[0], '..'))
from app import create_app, db
from models import PoliticalParty, PartyColor

app = create_app()
app.app_context().push()

print(PoliticalParty.query.delete())
db.session.commit()
print(PartyColor.query.delete())
db.session.commit()
print os.getcwd()
parties = json.load(open("backend/scrapers/src/parties.json"))
color_id = len(PartyColor.query.all()) + 1
for name, p in parties.items():
    party = PoliticalParty(
        id = int(p["id"]),
        name = p["name"],
        path = p["path"],
        chair = p["chair"],
        formation_date = p["formation_date"],
        twitter_handle = p["twitter_handle"],
        youtube = p["youtube"],
        office = p["office"],
        website = p["website"]
    )

    db.session.add(party)
    db.session.commit()

    for c in p["color"]:
        color = PartyColor(
            id = color_id,
            party_id = p["id"],
            color = c
        )
        db.session.add(color)
        db.session.commit()
        party.colors.append(color)
        color_id += 1

    print("Seeded " + p["name"])
