/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Grid, Row, Col, ProgressBar, Tabs, Tab} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {Timeline} from 'react-twitter-widgets'
import RepBills from './Bills.js'
import {RingLoader} from 'react-spinners'
/* eslint-enable no-unused-vars */

import '../../assets/css/App.css'
import '../../assets/css/Bills.css'
import '../../assets/css/Search.css'
import '../../assets/css/RepresentativeInstance.css'
import axios from 'axios'
import url from '../../assets/resource.json'

const styles = {
  hyperlink: {
    textDecoration: 'none',
    color: 'black'
  },
  center: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: '25%',
    paddingLeft: '50px',
    paddingRight: '50px',
    justifyContent: 'space-around'
  },
  rep_pic: {
    borderRadius: '5%',
    marginTop: '40px'
  },
  box: {
    background: 'white',
    margin: '5px',
    fontFamily: 'EB Garamond'
  },
  tabBox: {
    paddingTop: '5px',
    fontFamily: 'EB Garamond'
  },
  progress: {
    maxWidth: '60%',
    margin: 'auto',
    paddingBottom: '30px'
  }
}

export default class RepresentativeDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rep_data: null,
      party_name: null
    }
  }

  componentWillMount () {
    axios.get(url.api_url +
      `representative/${this.props.match.params.bioguideid}`)
      .then((response) => {
        this.setState({
          rep_data: response.data
        })
        axios.get(url.api_url + `party?party_name=True`)
          .then((response) => {
            this.setState({
              party_name: response.data
            })
          })
          .catch((error) => {
            if (error) {
              this.setState({
                rep_data: -1,
                party_name: -1
              })
            }
          })
      })
      .catch((error) => {
        if (error) {
          this.setState({
            rep_data: -1,
            party_name: -1
          })
        }
      })
  }

  render () {
    if (this.state.rep_data === null || this.state.party_name === null) {
      return (
        <div style={styles.center}>
          <RingLoader color={'#123abc'} loading={true} />
        </div>
      )
    } else if (this.state.rep_data === -1 || this.state.party_name === -1) {
      return (
        <div style={styles.root}>
          <p> Data Not Found </p>
        </div>
      )
    } else {
      let twitter = '' // eslint-disable-line
      if (this.state.rep_data['twitter'] !== null) {
        twitter = <div><Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: this.state.rep_data['twitter']
          }}
          options={{
            username: this.state.rep_data['twitter'],
            height: '550',
            width: '400'
          }}
        /></div>
      } else {
        twitter = <div style={{paddingTop: '20vh'}}>
          <h3>No Twitter Handle</h3></div>
      }

      let youtube = '' // eslint-disable-line
      if (this.state.rep_data['youtube'] !== null) {
        youtube = <iframe
          width='350'
          height='200'
          title = '{this.state.firstname} {this.state.lastname} YouTube Channel'
          src={'http://www.youtube.com/embed?max-results=1&controls=0' +
                '&showinfo=0&rel=0&listType=user_uploads&list=' +
                this.state.rep_data['youtube']}
          frameborder='10' allowfullscreen >
        </iframe>
      } else {
        youtube = <div> <h4>No Youtube Channel</h4></div>
      }

      return (
        <div className='App container'>
          <header className='Rep-Details-header'> </header>
          <Row>
            <Col sm={12} md={3}>
              <div style={styles.box} className='shadow rep-height'>
                <img
                  src={'https://theunitedstates.io/images/congress/225x275/' +
                    this.state.rep_data.bioguide + '.jpg'}
                  alt=''
                  style={styles.rep_pic}
                  width={'175px'}
                />
                <font size='5'>
                  <div style={{textAlign: 'center'}}>
                    <p style={{paddingTop: '10px'}}>
                      <font size='6'>
                        <b>
                          {this.state.rep_data['firstname']}
                          {` `}
                          {this.state.rep_data['lastname']}
                        </b>
                      </font>
                    </p>
                    <p> <b>Party: </b>
                      <Link to=
                        {`/party/${this.state.party_name[this.state.rep_data['party_id']][1]}`} // eslint-disable-line
                      >
                        {
                          this.state.party_name[this.state.rep_data['party_id']][0] //eslint-disable-line
                        }
                      </Link>
                    </p>
                    <p> <b> State: </b> {this.state.rep_data['state']}</p>
                    <p> <b> District: </b>
                      <Link to=
                        {`/districts/${this.state.rep_data['state']}/` +
                          `${this.state.rep_data['district']}`}>
                        {this.state.rep_data['district']}
                      </Link>
                    </p>
                    <p>
                      <b> Site: </b>
                      <a href={this.state.rep_data['url']}
                        target='_blank'> Website </a>
                    </p>
                    <p>
                      <b>Votes with Party (%): </b>
                      <div style={styles.progress}>
                        <ProgressBar bsStyle='success'
                          now={this.state.rep_data['votes_with_party_pct']}
                          label={
                            `${this.state.rep_data['votes_with_party_pct']}%`
                          }
                        />
                      </div>
                    </p>
                  </div>
                </font>
              </div>
            </Col>
          </Row>
        </div>
      )
    }
  }
}
