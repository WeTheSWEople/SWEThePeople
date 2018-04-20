/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Row, Col} from 'react-bootstrap'
import '../../assets/css/App.css'
import '../../assets/css/About.css'
/* eslint-enable no-unused-vars */

/*
 * Component that renders information about the data sources used for the site.
 */
export default class Api extends Component {
  render () {
    return (
      <div className='tools-div container'>
        <div className='tools-header'>
          <h2>Data Sources</h2>
        </div>
        <Row>
          <a
            href='https://projects.propublica.org/api-docs/congress-api/'
            target="_blank" rel="noopener noreferrer">
            <Col sm={3}>
              <div className='data-card'>
                <img
                  src={require('../../assets/images/about/propubica.jpg')}
                  className='img-responsive' alt='ProPublica logo'/>
                <h3>ProPublica</h3>
                <p>
                  Used to get information about all of the recent bills
                  sponsored by each representatives and their current
                  status.
                </p>
                <p>
                  <b> How it was scraped:</b> <br/> We got the API Key
                  from the propublica website. And we used the key to
                  scrape the data about recent Bills. We received the
                  data in a json format and converted that into our
                  Bills model and uploaded it to the PostgresSQL
                  database. All of this is done by a scraper script.
                </p>
              </div>
            </Col>
          </a>

          <a href='https://www.govtrack.us/developers' target="_blank"
            rel="noopener noreferrer">
            <Col sm={3}>
              <div className='data-card'>
                <img
                  src={require('../../assets/images/about/govtrack.png')}
                  className='img-responsive' alt='GovTrack logo'/>
                <h3>GovTrack</h3>
                <p>
                  Used to get information about all of the U.S.
                  representatives, their party, and corresponding
                  districts.
                </p>
                <b> How it was scraped:</b> <br/> We used GovTrack to
                scrape the data about House Representatives. We did not
                have to get an API key for this. We received all the data
                in a json format and extracted the information about the
                representatives. The information then was converted into
                our Representatives model and uploaded to the PostgresSQL
                database. All of this is done by a scraper script.
              </div>
            </Col>
          </a>
          <a
            href='https://www.census.gov/data/developers/data-sets/decennial-census.html'
            target="_blank" rel="noopener noreferrer">
            <Col sm={3}>
              <div className='data-card'>
                <img
                  src={require('../../assets/images/about/census.png')}
                  className='img-responsive' alt='US Census logo'/>
                <h3>US Census Bureau</h3>
                <p>
                  Used to get socioeconomics information based on either
                  states or districts from the census.
                </p>
                <b> How it was scraped:</b> <br/> The district data
                scraper pulls information from the United State Census
                Bureau’s 2016 American Community Survey by targeting a
                specific list of thirteen data endpoints. For each
                district in each state, we pulled data for each of the
                endpoints and  stored those data points for the the
                scraper converts the data into a District and State model
                and commits the models to the database.
              </div>
            </Col>
          </a>
          <a href='https://theunitedstates.io/images/' target="_blank"
            rel="noopener noreferrer">
            <Col sm={3}>
              <div className='data-card'>
                <img src={
                  require('../../assets/images/about/unitedstatesio.png')}
                className='img-responsive' alt='theunitedstates.io logo'/>
                <h3>TheUnitedStates.io</h3>
                <p>
                  Used to get images of representatives based on their
                  bioguide id.
                </p>
                <b> How it was scraped:</b> <br/> We used the links
                to the images of representatives using their bioguide id.
              </div>
            </Col>
          </a>
        </Row>
      </div>
    )
  }
}
