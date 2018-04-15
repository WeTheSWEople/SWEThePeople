/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {RingLoader} from 'react-spinners'
import {a} from 'react-router-dom'
import Members from './Members'
/* eslint-enable no-unused-vars */
import url from '../../assets/resource.json'
import '../../assets/css/App.css'
import '../../assets/css/About.css'

let request = require('request')

export default class About extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      totalCommits: 0,
      error: false,
      total_issues: 0,
      swe_member_data: {},
      totalTests: 0
    }
  }

  componentWillMount () {

    this.setState({ready: false})

    let options = {method: 'GET',
      url: 'https://api.github.com/repos/WeTheSWEople/SWEThePeople/stats/contributors'}
    request(options, function (error, response, body) {
      if (error) {
        this.setState({error: true, ready: true})
      }
      let sweMembers = {}
      sweMembers['MTirtowidjojo'] = ['Michael Tirtowidjojo', 0, 0, 0,
        'Michael is a third-year CS student who trains in Taekwondo and ' +
        'enjoys reading World War II stories.', 'Michael.png',
        'Parties front-end and chief of chief naming', 'Mojo Jojo']
      sweMembers['copperstick6'] = ['William Han', 0, 0, 68,
        'William is a sophomore CS student who enjoys the subtle art of ' +
        'memes and hackathons.', 'William.jpg',
        'Districts front-end and backend-unit tests ' +
        'deployment', 'Bill']
      sweMembers['raulcodes'] = ['Raul Camacho', 0, 0, 19,
        'Raul is a senior CS major who will be graduating this semester. ' +
        'Also he\'s tall. Probably too tall.', 'Raul.png',
        'Front-end, css, front-end unittests and acceptance tests',
        'Camacho Style Sheets']
      sweMembers['minwoo0jo'] = ['Minwoo Jo', 0, 0, 0,
        'Minwoo is a fourth year student currently pursuing a BSA in CS. He ' +
        'enjoys studying foreign languages and competing in video game ' +
        'tournaments in his free time.', 'Minwoo.jpg',
        'District front-end and back-end, API designer', 'MJ']
      sweMembers['bzsinger'] = ['Benjamin Singer', 0, 0, 0,
        'Benny is a third-year CS student who enjoys iOS development, ' +
        'reading, and following current events.', 'Benny.jpg',
        'Representatives front-end, District back-end, Documentation', 'Benny']
      sweMembers['palakhirpara'] = ['Palak Hirpara', 0, 0, 34,

        'Palak is a senior who will be graduating this semester with BSCS ' +
        'and likes watching cricket.', 'Palak.png',
        'Representatives front-end and back-end, Districts back-end, back-end unittests',
        'The Decider']

      let commitJSON = JSON.parse(body)
      let totalCommits = 0
      for (let i = 0; i < commitJSON.length; i++) {
        let curUserCount = commitJSON[i]['total']
        sweMembers[String(commitJSON[i]['author']['login'])][1] = curUserCount
        totalCommits += commitJSON[i]['total']
      }

      let totalTests = 0
      Object.keys(sweMembers).forEach(function (key) {
        totalTests += sweMembers[key][3]
      })

      this.setState({totalCommits: totalCommits, totalTests: totalTests})
      var eof = false;
      var page = 1;
      var JSON_total_length = 0;
      while(!eof) {
        var options = { method: 'GET',
        url: 'https://api.github.com/repos/WeTheSWEople/SWEThePeople/issues?state=all&per_page=100&page=' + String(page),
        qs: { state: 'all' },
        };
        page++;
        //hardcoded value because I don't know how to force this loop to be asynchronous
        if (page == 5) {
          break;
        }

        request(options, function (error, response, body) {
          if (error) {
            eof = true;
            this.setState({error: true, ready: true})
          }
          let issueJSON = JSON.parse(body)
          for (let i = 0; i < issueJSON.length; i++) {
            if(String(issueJSON[i]['user']['login']) in sweMembers){
              sweMembers[String(issueJSON[i]['user']['login'])][2] += 1
            }
            if (issueJSON[i]['number'] == 1) {
              eof = true;
            }
          }
         JSON_total_length += issueJSON.length;
          this.setState({swe_member_data: sweMembers,
            total_issues: JSON_total_length})
        }.bind(this))
      }

      this.setState({ready: true})
    }.bind(this))
  }

  render () {
    let members = null
    if (this.state.ready) {
      members = <Members swe_data = {this.state.swe_member_data} />
    }

    return (
      <div className='App container about-content'>
        <h1 className="about-title">swethepeople.me</h1>
        <h3>Brought to you by WeTheSWEople</h3>
        <div className='row about-info'>
          <div className='col-sm-4 col-sm-offset-2'>
            <h4>
              SWEThePeople provides information and resources for
              anyone interested in the members of United States House
              of Representatives. This site provides information about
              representatives, their districts, and parties.
            </h4>
          </div>

          <div className='col-sm-4'>
            <h4>
              The site combines information about legislators with
              U.S. Census data, providing visitors with a better
              understanding of the intersection between party, state,
              and demographics.
            </h4>
          </div>
        </div>

        <div className='interesting-result'>
          <h4>
            Our website, by combining district party control and demographic
            and age information, displays an interesting corrolation between the
            two. Thus, SWEThePeople is a valuable resource for anyone interested
            in studying party and demographics in modern American politics.
          </h4>
        </div>

        <center>
          <RingLoader color={'#123abc'} loading={!this.state.ready} />
        </center>
        <div className='github-info'>
          <div className='row'>
            <div className='col-sm-4 col-sm-offset-4'>
              <div className='github-counts'>
                <h4>
                  Total Commits:
                  <span className='right-info'>
                    {this.state.totalCommits}
                  </span>
                </h4>
                <h4>
                  Total Issues:
                  <span className='right-info'>
                    {this.state.total_issues}
                  </span>
                </h4>
                <h4>
                  Total Unit Tests:
                  <span className='right-info'>{this.state.totalTests}</span>
                </h4>
              </div>
            </div>
          </div>
          <p>
            <a href = 'https://github.com/WeTheSWEople/SWEThePeople/' target="_blank" rel="noopener noreferrer" >
              GitHub Repository
            </a>
          </p>
          <p>
            <a href = 'https://wethesweople.gitbooks.io/report/' target="_blank" rel="noopener noreferrer">
              Technical Report
            </a>
          </p>
          <p>
            <a href = 'https://wethesweople.gitbooks.io/api/' target="_blank" rel="noopener noreferrer">
              API Documentation
            </a>
          </p>
          <p>
            <a href = {url.api_url} target="_blank">
              API
            </a>
          </p>
          <p>
            <a href='https://travis-ci.org/WeTheSWEople/SWEThePeople/builds' target="_blank" rel="noopener noreferrer">
              Travis CI
            </a>
          </p>
        </div>

        <div className='about-header'>
          <h1>Your Representatives</h1>
        </div>
        {members}

        <div className='tools-div container'>
          <div className='tools-header'>
            <h2>Tools</h2>
          </div>
          <div className='row'>
            <a href='https://github.com/WeTheSWEople/SWEThePeople/' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/github.png')}
                    className='img-responsive' alt='GitHub logo'/>
                  <h5>GitHub</h5>
                  <p>
                    Used to manage versions betwen different branches of the
                    project.
                  </p>
                </div>
              </div>
            </a>
            <a href='https://www.gitbook.com/@wethesweople' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/gitbook.png')}
                    className='img-responsive' alt='Gitbook logo' />
                  <h5>Gitbook</h5>
                  <p>Used to document the project and its API.</p>
                </div>
              </div>
            </a>
            <a href='https://reactjs.org/' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/reactjs.png')}
                    className='img-responsive' alt='ReactJS logo'/>
                  <h5>ReactJS</h5>
                  <p>The JavaScript library the site is built on.</p>
                </div>
              </div>
            </a>
            <a href='https://aws.amazon.com/ec2/' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/ec2.jpg')}
                    className='img-responsive' alt='EC2 logo'/>
                  <h5>Amazon EC2</h5>
                  <p>Container being used to host the production site.</p>
                </div>
              </div>
            </a>
            <a href='https://getbootstrap.com/' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/bootstrap.png')}
                    className='img-responsive' alt='Bootstrap logo'/>
                  <h5>Bootstrap</h5>
                  <p>CSS and JavaScript toolkit used to beautify pages.</p>
                </div>
              </div>
            </a>
            <a href='http://flask.pocoo.org/' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/flask.png')}
                    className='img-responsive' alt='Flask logo'/>
                  <h5>Python Flask</h5>
                  <p>Web framework used for the production site.</p>
                </div>
              </div>
            </a>
            <a href='https://www.nginx.com/' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/nginx.png')}
                    className='img-responsive' alt='NGINX logo'/>
                  <h5>NGINX</h5>
                  <p>Webserver to serve the production site.</p>
                </div>
              </div>
            </a>
            <a href='https://www.slack.com/' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/slack.png')}
                    className='img-responsive' alt='Slack logo'/>
                  <h5>Slack</h5>
                  <p>
                    Used to communicate between members to organize meetings and
                    work.
                  </p>
                </div>
              </div>
            </a>
            <a href='https://aws.amazon.com/rds/' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require(
                    '../../assets/images/about/Amazon-RDS1.png')}
                  className='img-responsive' alt='Slack logo'/>
                  <h5>Amazon RDS</h5>
                  <p>
                    Used to host our backend database.
                  </p>
                </div>
              </div>
            </a>
            <a href='https://www.postgresql.org/' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/post.png')}
                    className='img-responsive' alt='Slack logo'/>
                  <h5>PostgresSQL</h5>
                  <p>
                    Database management system used for our backend database
                  </p>
                </div>
              </div>
            </a>
            <a href='https://www.sqlalchemy.org/' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/sqla.png')}
                    className='img-responsive' alt='Slack logo'/>
                  <h5>SQLAlchemy</h5>
                  <p>
                    Python SQL toolkit used to access our database
                  </p>
                </div>
              </div>
            </a>
            <a href='https://mochajs.org/' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/mochajs.png')}
                    className='img-responsive' alt='Slack logo'/>
                  <h5>Mocha</h5>
                  <p>
                    JavaScript test framework.
                  </p>
                </div>
              </div>
            </a>
            <a href='https://www.seleniumhq.org/' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/selenium.png')}
                    className='img-responsive' alt='Slack logo'/>
                  <h5>Selenium</h5>
                  <p>
                    Used to test our front-end routes.
                  </p>
                </div>
              </div>
            </a>
            <a href='https://www.travis-ci.com/' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/travisci.png')}
                    className='img-responsive' alt='Slack logo'/>
                  <h5>Travis CI</h5>
                  <p>
                    Used for continuous integration of our project.
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className='tools-div container'>
          <div className='tools-header'>
            <h2>Data Sources</h2>
          </div>
          <div className='row'>
            <a href='https://projects.propublica.org/api-docs/congress-api/' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='data-card'>
                  <img src={require('../../assets/images/about/propubica.jpg')}
                    className='img-responsive' alt='ProPublica logo'/>
                  <h3>ProPublica</h3>
                  <p>
                    Used to get information about all of the recent bills sponsored by each
                    representatives and their current status.
                  </p>
                  <p>
                     <b> How it was scraped:</b> <br/> We got the API Key from the propublica website.
                     And we used the key to scrape the data about recent Bills. We
                     received the data in a json format and converted that into our Bills model
                    and uploaded it to the PostgresSQL database. All of this is done by a scraper script.
                  </p>
                </div>
              </div>
            </a>

            <a href='https://www.govtrack.us/developers' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='data-card'>
                  <img src={require('../../assets/images/about/govtrack.png')}
                    className='img-responsive' alt='GovTrack logo'/>
                  <h3>GovTrack</h3>
                  <p>
                    Used to get information about all of the U.S. representatives,
                    their party, and corresponding districts.
                  </p>
                  <b> How it was scraped:</b> <br/> We used GovTrack to scrape the data about House Representatives.
                      We did not have to get an API key for this. We received all the data in a json format
                      and extracted the information about the representatives. The information then was converted
                      into our Representatives model and uploaded to the PostgresSQL database. All of this is done by a
                      scraper script.
                </div>
              </div>
            </a>
            <a href='https://www.census.gov/data/developers/data-sets/decennial-census.html' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='data-card'>
                  <img src={require('../../assets/images/about/census.png')}
                    className='img-responsive' alt='US Census logo'/>
                  <h3>US Census Bureau</h3>
                  <p>
                    Used to get socioeconomics information based on either
                    states or districts from the census.
                  </p>
                  <b> How it was scraped:</b> <br/> The district data scraper pulls information from the
                      United State Census Bureau’s 2016 American Community Survey by targeting a
                      specific list of thirteen data endpoints. For each district in each state,
                      we pulled data for each of the endpoints and  stored those data points for
                      the districts. After collecting and storing the data for a district locally,
                      the scraper converts the data into a District and State model and commits the
                      models to the database.
                </div>
              </div>
            </a>
            <a href='https://theunitedstates.io/images/' target="_blank" rel="noopener noreferrer">
              <div className='col-sm-3'>
                <div className='data-card'>
                  <img src={
                    require('../../assets/images/about/unitedstatesio.png')}
                  className='img-responsive' alt='theunitedstates.io logo'/>
                  <h3>TheUnitedStates.io</h3>
                  <p>
                    Used to get images of representatives based on their
                    bioguide id.
                  </p>
                  <b> How it was scraped:</b> <br/> We used the links to the images of representatives using their
                  bioguide id.
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    )
  }
}
