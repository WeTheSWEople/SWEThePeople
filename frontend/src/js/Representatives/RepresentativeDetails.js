/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Grid, Row, Col, ProgressBar, Tabs, Tab} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {Timeline} from 'react-twitter-widgets'
import RepBills from './Bills.js'
import RepArticles from './Articles.js'
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
        rep_data : null,
        party_name : null,
    }
  }

  componentWillMount () {
    axios.get(url.api_url + `representative/${this.props.match.params.bioguideid}`)
    .then((response)=>{
      this.setState({
        rep_data:response.data
      })
      axios.get(url.api_url + `party?party_name=True`)
      .then((response)=>{
        this.setState({
          party_name:response.data
        })
      })
      .catch((error)=>{
        this.setState({
            rep_data: -1,
            party_name : -1
        })
      })
    })
    .catch((error)=>{
        this.setState({
            rep_data: -1,
            party_name : -1
      })
    })
  }

  render () {
    if (this.state.rep_data === null || this.state.party_name === null){
      return(
      <div style={styles.center}>
      <RingLoader color={'#123abc'} loading={true} />
       </div>)
    }
    else if (this.state.rep_data === -1 || this.state.party_name === -1){
      return (
          <div style={styles.root}>
           <p> Data Not Found </p>
          </div>)
    }
    else{

      let twitter = ''
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
      }
      else{
        twitter = <div style={{paddingTop:'20vh'}}> <h3>No Twitter Handle</h3></div>
      }

      let youtube = ''
      if(this.state.rep_data['youtube'] !== null){
        youtube = <iframe
              width='350'
              height='200'
              title ='YouTube Channel'
              src={'http://www.youtube.com/embed?max-results=1&controls=0' +
                '&showinfo=0&rel=0&listType=user_uploads&list=' +
                this.state.rep_data['youtube']}
              frameborder='10' allowfullscreen >
        </iframe>
      }

      let facebook = ''
      if(this.state.rep_data['facebook'] !== null) {
        facebook = <iframe
          src={'https://www.facebook.com/plugins/page.php' +
            '?href=https%3A%2F%2Fwww.facebook.com%2F' +
            this.state.rep_data['facebook'] + '&tabs=timeline&width=340&height=500' +
            '&small_header=false&adapt_container_width=true' +
            '&hide_cover=false&show_facepile=true&appId'}
          width="340"
          height="500"
          style={{border:'none', overflow:'hidden'}}
          scrolling="no"
          frameborder="0"
          allowTransparency="true"
          allow="encrypted-media">
        </iframe>
      }

      return (
      <div className='App container'>
        <header className='Rep-Details-header'> </header>
        <Row>
        {//<Col sm={0} md={1}></ Col>
        }
          <Col sm={12} md={3}>
            <div style={styles.box} className='shadow rep-height'>
              <img src={'https://theunitedstates.io/images/congress/225x275/' +
                this.state.rep_data.bioguide + '.jpg'} alt='' style={styles.rep_pic}
                width={"175px"}
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
                    <Link to={`/party/${this.state.party_name[this.state.rep_data['party_id']][1]}`}>
                      {this.state.party_name[this.state.rep_data['party_id']][0]} </Link>
                  </p>
                  <p> <b> State: </b> {this.state.rep_data['state']}</p>
                  <p> <b> District: </b>
                    <Link
                      to={`/districts/${this.state.rep_data['state']}/` +
                      `${this.state.rep_data['district']}`}>
                      {this.state.rep_data['district']}
                    </Link>
                  </p>
                  <p>
                    <b>
                      <a href={this.state.rep_data['url']} target="_blank">
                        Website
                      </a>
                    </b>
                  </p>
                  <p>
                    <b>Votes with Party (%): </b>
                    <div style={styles.progress}>
                      <ProgressBar bsStyle='success'
                        now={this.state.rep_data['votes_with_party_pct']}
                        label={`${this.state.rep_data['votes_with_party_pct']}%`}
                      />
                    </div>
                  </p>
                </div>
              </font>
            </div>
          </Col>
          <Col sm={12} md={9}>
            <div style={styles.box} className='shadow rep-height'>
              <div style={styles.tabBox}>
                <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                  <Tab eventKey={1} title="Social Media">
                    <Row>
                      <Col md={6}>
                        {twitter}
                      </ Col>
                      <Col md={6}>
                        {youtube}
                      </Col>
                      <Col md={6}>
                        {facebook}
                      </Col>
                    </ Row>
                  </Tab>
                  <Tab eventKey={2} title="News">
                    <h3 class='bills-header'>Recent Bills Sponsored</h3>
                    <Row style={{paddingLeft: '5px'}}>
                      <RepBills data = {this.state.rep_data.bills} />
                    </Row>
                    <h3 class='bills-header'>Recent Articles</h3>
                    <Row style={{paddingLeft: '5px'}}>
                      <RepArticles data = {this.state.rep_data.articles} />
                    </Row>
                  </Tab>
                  <Tab eventKey={3} title="Office Location">
                    <h3><b>Office Location</b></h3>
                    <h4>{this.state.rep_data['office']}</h4>
                    <iframe
                      width='600'
                      height='450'
                      frameborder='0' style={{border: '0'}}
                      title = 'Office Location'
                      src={'https://www.google.com/maps/embed/v1/place?' +
                      'key=AIzaSyDOCxZVfWFVpzzAC8tEIi3ulzNzXbOdsyY' +
                      '&q=' + this.state.rep_data.office} allowfullscreen>
                    </iframe>
                  </Tab>
                </Tabs>
              </div>
            </div>

          </Col>
        </Row>

      </div>
    )

    }


  }
}
