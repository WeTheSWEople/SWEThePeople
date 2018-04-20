/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {RingLoader} from 'react-spinners'
import {a} from 'react-router-dom'
import Members from './Members'
import {Row, Col} from 'react-bootstrap'
/* eslint-enable no-unused-vars */
import '../../assets/css/App.css'
import '../../assets/css/About.css'
import {getMembers} from './memberData'
import GithubTools from './GithubTools.jsx'
import AboutInfo from './AboutInfo.jsx'
import Tools from './Tools.jsx'
import Api from './Api.jsx'
let request = require('request')

/*
 * The parent component for the about page.
 * Calls on the Github API to get commit and issue data for each member.
 * Renders the page using the child components for tools, data sources,
 * member data, and site information.
 */
export default class About extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      totalCommits: 0,
      error: false,
      total_issues: 0,
      swe_member_data: {},
      totalTests: 0,
      ended: false
    }
  }
  
  /*
   * Calls on the Github API and stores the commit and issue data into a
   * dictionary. Always completes before rendering and writes the data into
   * the component state.
   */
  componentWillMount () {
    this.setState({ready: false})
    let options = {method: 'GET', url: 'https://api.github.com/repos/' +
      + 'WeTheSWEople/SWEThePeople/stats/contributors'}
    request(options, function (error, response, body) {
      if (error) {
        this.setState({error: true, ready: true})
      }
      let sweMembers = getMembers();
      let commitJSON = JSON.parse(body)
      let totalCommits = 0
      let totalTests = 0
      for (let i = 0; i < commitJSON.length; i++) {
        let curUserCount = commitJSON[i]['total']
        sweMembers[String(commitJSON[i]['author']['login'])][1] = curUserCount
        totalCommits += commitJSON[i]['total']
      }
      Object.keys(sweMembers).forEach(function (key) {
        totalTests += sweMembers[key][3]
      })
      this.setState({totalCommits: totalCommits, totalTests: totalTests})


      var eof = false;
      var page = 1;
      while(!eof) {
        var options = { method: 'GET',
            url: 'https://api.github.com/repos/WeTheSWEople/SWEThePeople/' +
              + 'issues?state=all&per_page=100&page=' + String(page),
            qs: { state: 'all' },
        };
        // eslint-disable-next-line
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
            if (issueJSON[i]['number'] === 1) {
              eof = true;
            }
          }
          this.setState({swe_member_data: sweMembers,
            total_issues: this.state.total_issues + issueJSON.length})
        }.bind(this))

        page++;
        if (page === 10) {
          break;
        }
      }
      this.setState({ready: true})
    }.bind(this))
  }
  
  /*
   * Renders the AboutInfo, GithubTools, Tools
   * and API components for the about page.
   */
  render () {
    let members = null
    if (this.state.ready) {
      members = <Members swe_data = {this.state.swe_member_data} />
    }

    return (
      <div className='App container about-content'>
        <AboutInfo />
        <center>
          <RingLoader color={'#123abc'} loading={!this.state.ready} />
        </center>
        <GithubTools total_issues={this.state.total_issues}
          totalTests={this.state.totalTests}
          totalCommits={this.state.totalCommits} />
        {members}
        <Tools />
        <Api />
      </div>
    )
  }
}
