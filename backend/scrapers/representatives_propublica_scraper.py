import requests
import os
import sys
from apikeys import API

from utils import build_representative, build_bill, build_article

sys.path.insert(1, os.path.join(sys.path[0], '..'))
from app import create_app, db
from models import Representative


CURRENT_CONGRESS = 115
PROPUBLICA_API_KEY = API['PROPUBLICA_API_KEY']
WEBHOSE_API_KEY = API['WEBHOSE_API_KEY']

REP_URL = 'https://api.propublica.org/congress/v1/' + str(CURRENT_CONGRESS) + \
          '/house/members.json'

headers = {'x-api-key': PROPUBLICA_API_KEY}


def get_bills(rep):
    """
    Gets the Bills for the given Representative.

    rep -- the Representative to get bills for
    """

    bill_url = 'https://api.propublica.org/congress/v1/members/' + \
               rep.bioguide + '/bills/introduced.json'
    bills_response = requests.request('GET', bill_url, headers=headers)
    bills = bills_response.json()
    for i in range(0, 3):
        if len(bills['results'][0]['bills']) == i:
            break
        rep.bills.append(build_bill(bills['results'][0]['bills'][i]))


def get_articles(rep):
    """
    Gets the Articles for the given Representative

    rep -- the Representative to get Articles for
    """

    article_url = 'http://webhose.io/filterWebContent?token=' + \
                  WEBHOSE_API_KEY + \
                  '&format=json&sort=crawled&q=%22' + rep.firstname + \
                  '%20' + rep.lastname + \
                  '%22%20language%3Aenglish%20site_type' + \
                  '%3Anews%20thread.country%3AUS'
    articles_response = requests.request('GET', article_url,
                                         headers=headers)
    articles = articles_response.json()['posts']

    for i in range(0, 3):
        if len(articles) == i:
            break

        curArticle = articles[i]
        if len(curArticle['text']) > 200:
            curArticle['text'] = curArticle['text'][:200] + '...'
        rep.articles.append(build_article(rep, curArticle))


def main():
    """
    Scrapes Representative information from propublica
    """

    app = create_app()
    app.app_context().push()

    response = requests.request('GET', REP_URL, headers=headers)
    members = response.json()
    for mem in members['results'][0]['members']:
        if mem['title'] == 'Representative' and mem['in_office']:
            # Build the Representative
            rep = build_representative(mem)

            # Get the Bills
            get_bills(rep)

            # Get the Articles
            get_articles(rep)

            oldrep = Representative.query.filter(
                Representative.bioguide == rep.bioguide).first()
            if oldrep is None:
                db.session.add(rep)
                db.session.commit()
            else:
                oldrep.firstname = rep.firstname
                oldrep.lastname = rep.lastname
                oldrep.party_id = rep.party_id
                oldrep.state = rep.state
                oldrep.district = rep.district
                oldrep.twitter = rep.twitter
                oldrep.youtube = rep.youtube
                oldrep.facebook = rep.facebook
                oldrep.votes_with_party_pct = rep.votes_with_party_pct
                oldrep.url = rep.url
                oldrep.image_uri = rep.image_uri
                oldrep.bills = rep.bills
                oldrep.articles = rep.articles
                db.session.commit()


if __name__ == "main":
    main()
