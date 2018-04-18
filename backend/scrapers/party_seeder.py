import json
import sys
import os

sys.path.insert(1, os.path.join(sys.path[0], '..'))
from app import create_app, db
from models import PoliticalParty, PartyColor


def delete_parties():
    """
    Deletes the political parties and party colors from the database.
    """

    PoliticalParty.query.delete()
    db.session.commit()
    PartyColor.query.delete()
    db.session.commit()


def build_party(info):
    """
    Builds the PoliticalParty given the information for the party.

    info -- the information for the party

    Returns the PoliticalParty
    """

    party = PoliticalParty(
        id=int(info["id"]),
        name=info["name"],
        path=info["path"],
        chair=info["chair"],
        formation_date=info["formation_date"],
        twitter_handle=info["twitter_handle"],
        youtube=info["youtube"],
        office=info["office"],
        website=info["website"]
    )
    db.session.add(party)
    db.session.commit()

    return party


def build_colors(party, colors, color_id):
    """
    Builds the PartyColor instances for the given party

    party    -- the party to create colors for
    colors   -- the list of names of colors
    color_id -- the ID of the first color to create

    Returns the ID for the next color to create
    """

    for c in colors:
        color = PartyColor(
            id=color_id,
            party_id=party.id,
            color=c
        )
        db.session.add(color)
        db.session.commit()
        party.colors.append(color)
        color_id += 1

    return color_id


def main():
    """
    Seeds the database with the information on political parties from the
    parties JSON file
    """

    app = create_app()
    app.app_context().push()

    # Delete the parties already seeded
    delete_parties()

    parties = json.load(open("backend/scrapers/src/parties.json"))
    color_id = len(PartyColor.query.all()) + 1
    for name, p in parties.items():
        # Build the PoliticalParty
        party = build_party(p)

        # Build the PartyColors
        color_id = build_colors(party, p["color"], color_id)

        print("Seeded " + p["name"])
