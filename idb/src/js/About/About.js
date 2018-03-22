/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {RingLoader} from 'react-spinners'
import {a} from 'react-router-dom'
import Members from './Members'
/* eslint-enable no-unused-vars */

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
      swe_member_data: {}
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
        'Parties front-end and back-end', 'Mojo Jojo']
      sweMembers['copperstick6'] = ['William Han', 0, 0, 0,
        'William is a sophomore CS student who enjoys the subtle art of ' +
        'memes and hackathons.', 'William.jpg',
        'Districts front-end and backend-unit tests ' +
        'deployment', 'Bill']
      sweMembers['raulcodes'] = ['Raul Camacho', 0, 0, 0,
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
      sweMembers['palakhirpara'] = ['Palak Hirpara', 0, 0, 0,
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

      this.setState({totalCommits: totalCommits})
      // let eof = false
      //let page = 1
      // loop doesn't work for some reason
      // while(!eof){
      var options = { method: 'GET',
      url: 'https://api.github.com/repos/WeTheSWEople/SWEThePeople/issues?state=all&per_page=100&page=' + String(1),
      qs: { state: 'all' },
      };

      request(options, function (error, response, body) {
        if (error) {
          this.setState({error: true, ready: true})
        }
        let issueJSON = JSON.parse(body)
        for (let i = 0; i < issueJSON.length; i++) {
          sweMembers[String(issueJSON[i]['user']['login'])][2] += 1
        }

        // if (issueJSON[issueJSON.length - 1]['number'] === 1) {
        //   eof = true
        // }

        // page += 1
        this.setState({swe_member_data: sweMembers,
          total_issues: issueJSON.length})
      }.bind(this))
      // }

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
                  <span className='right-info'>0</span>
                </h4>
              </div>
            </div>
          </div>
          <p>
            <a href = 'https://github.com/WeTheSWEople/SWEThePeople/'>
              GitHub Repository
            </a>
          </p>
          <p>
            <a href = 'https://wethesweople.gitbooks.io/report/'>
              IDB 1 Technical Report
            </a>
          </p>
          <p>
            <a href = 'https://wethesweople.gitbooks.io/api/'>
              API Documentation
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
            <a href='https://github.com/WeTheSWEople/SWEThePeople/'>
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
            <a href='https://www.gitbook.com/@wethesweople'>
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/gitbook.png')}
                    className='img-responsive' alt='Gitbook logo' />
                  <h5>Gitbook</h5>
                  <p>Used to document the project and its API.</p>
                </div>
              </div>
            </a>
            <a href='https://reactjs.org/'>
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/reactjs.png')}
                    className='img-responsive' alt='ReactJS logo'/>
                  <h5>ReactJS</h5>
                  <p>The JavaScript library the site is built on.</p>
                </div>
              </div>
            </a>
            <a href='https://aws.amazon.com/ec2/'>
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/ec2.jpg')}
                    className='img-responsive' alt='EC2 logo'/>
                  <h5>Amazon EC2</h5>
                  <p>Container being used to host the production site.</p>
                </div>
              </div>
            </a>
            <a href='https://getbootstrap.com/'>
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/bootstrap.png')}
                    className='img-responsive' alt='Bootstrap logo'/>
                  <h5>Bootstrap</h5>
                  <p>CSS and JavaScript toolkit used to beautify pages.</p>
                </div>
              </div>
            </a>
            <a href='http://flask.pocoo.org/'>
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/flask.png')}
                    className='img-responsive' alt='Flask logo'/>
                  <h5>Python Flask</h5>
                  <p>Web framework used for the production site.</p>
                </div>
              </div>
            </a>
            <a href='https://www.nginx.com/'>
              <div className='col-sm-3'>
                <div className='tools-card'>
                  <img src={require('../../assets/images/about/nginx.png')}
                    className='img-responsive' alt='NGINX logo'/>
                  <h5>NGINX</h5>
                  <p>Webserver to serve the production site.</p>
                </div>
              </div>
            </a>
            <a href='https://www.slack.com/'>
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
          </div>
        </div>

        <div className='tools-div container'>
          <div className='tools-header'>
            <h2>Data Sources</h2>
          </div>
          <div className='row'>
            <a href='https://projects.propublica.org/api-docs/congress-api/'>
              <div className='col-sm-3'>
                <div className='data-card'>
                  <img src={require('../../assets/images/about/propubica.jpg')}
                    className='img-responsive' alt='ProPublica logo'/>
                  <h3>ProPublica</h3>
                  <p>
                    Used to get information about all of U.S. representatives,
                    their party, and corresponding districts.
                  </p>
                </div>
              </div>
            </a>
            <a href='https://www.govtrack.us/developers/api'>
              <div className='col-sm-3'>
                <div className='data-card'>
                  <img src={require('../../assets/images/about/govtrack.png')}
                    className='img-responsive' alt='GovTrack logo'/>
                  <h3>GovTrack</h3>
                  <p>
                    Used to get information about recent bills sponsored by each
                    representatives and their current status.
                  </p>
                </div>
              </div>
            </a>
            <a href='https://www.census.gov/data/developers/data-sets/decennial-census.html'>
              <div className='col-sm-3'>
                <div className='data-card'>
                  <img src={require('../../assets/images/about/census.png')}
                    className='img-responsive' alt='US Census logo'/>
                  <h3>US Census Bureau</h3>
                  <p>
                    Used to get socioeconomics information based on either
                    states or districts from the census.
                  </p>
                </div>
              </div>
            </a>

            <a href='https://theunitedstates.io/images/congress/'>
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
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    )
  }
}
