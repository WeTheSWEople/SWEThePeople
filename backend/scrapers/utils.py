import os
import sys
sys.path.insert(1, os.path.join(sys.path[0], '..'))
from models import Article, Bill, Representative

IMAGE_URL = 'https://theunitedstates.io/images/congress/225x275/'


def build_representative(info, district=None, party_id=None):
    """
    Builds a Representative given the info for that Representative.

    info -- the dict of representative information

    Returns the Representative
    """

    if district is None:
        district = str(info['district'])
    if party_id is None:
        party_id = 2 if info['party'] == 'R' else 1

    return Representative(
        bioguide=info['id'],
        firstname=info['first_name'],
        lastname=info['last_name'],
        party_id=party_id,
        state=info['state'],
        district=district,
        twitter=info['twitter_account'],
        youtube=info['youtube_account'],
        facebook=info['facebook_account'],
        office=info['office'],
        votes_with_party_pct=info['votes_with_party_pct'],
        url=info['url'],
        image_uri=IMAGE_URL + info['id'] + '.jpg'
    )


def build_bill(info):
    """
    Builds a Bill given the info for that Bill.

    info -- the dict of bill information

    Returns the Bill
    """

    return Bill(
        number=info['number'],
        short_title=info['short_title'],
        sponsor_id=info['sponsor_id'],
        congressdotgov_url=info['congressdotgov_url'],
        introduced_date=info['introduced_date'],
        latest_major_action=info['latest_major_action']
    )


def build_article(rep, info):
    """
    Builds an Article given the info and Representative it belongs to.

    rep  -- the Representative the Article belongs to
    info -- the dict of Article information

    Returns the Article
    """

    return Article(
        title=info['title'],
        url=info['url'],
        author=info['author'],
        text=info['text'],
        date=info['published'],
        site=info['thread']['site'],
        representative_id=rep.bioguide,
    )
