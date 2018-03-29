/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Grid, Row, Col, ProgressBar} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {Timeline} from 'react-twitter-widgets'
import RepBills from './Bills.js'
import {RingLoader} from 'react-spinners'

/* eslint-enable no-unused-vars */
import '../../assets/css/App.css'
import '../../assets/css/Bills.css'
import axios from 'axios'

const styles = {
  hyperlink: {
    textDecoration: 'none',
    color: 'black'
  },
  center:{
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: '25%',
    paddingLeft: '50px',
    paddingRight: '50px',
    justifyContent: 'space-around'
  },
  roundcorner: {
    borderRadius: '13%'
  }
}

export default class RepresentativeDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
        rep_data : null,
        party_name : null
    }
  }

  componentWillMount () {
    axios.get(`http://api.swethepeople.me/representative/${this.props.match.params.bioguideid}`)
    .then((response)=>{
      this.setState({
        rep_data:response.data
      })
      axios.get(`http://api.swethepeople.me/party?party_name=True`)
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
                height: '400',
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
              width='600'
              height='340'
              title ='YouTube Channel'
              src={'http://www.youtube.com/embed?max-results=1&controls=0' +
                '&showinfo=0&rel=0&listType=user_uploads&list=' +
                this.state.rep_data['youtube']}
              frameborder='10' allowfullscreen >
        </iframe>
      }
      else{
          youtube = <div> <h4>No Youtube Channel</h4></div>
      }

      let facebook = '{this.state.firstname} {this.state.lastname} YouTube Channel'
      if(this.state.rep_data['facebook'] !== null) {
        facebook = <iframe
          title='Facebook Page'
          src={"https://www.facebook.com/plugins/page.php?" +
            "href=https%3A%2F%2Fwww.facebook.com%2F" +
            this.state.rep_data['facebook'] + "&tabs=timeline&width=340" +
            "&height=500&small_header=false&adapt_container_width=true" +
            "&hide_cover=false&show_facepile=true&appId"}
          width="340"
          height="500"
          scrolling="no"
          frameborder="0"
          allowTransparency="true">
        </iframe>
      }
      else {
          facebook = <div> <h4>No Facebook Page</h4></div>
      }


      return (
      <div className='App'>
        <header className='Rep-Details-header'> </header>
        <Row>
          <Col sm={12} md={4}>
            <img src={'https://theunitedstates.io/images/congress/225x275/' +
              this.state.rep_data.bioguide + '.jpg'} alt='' style={styles.roundcorner}
            />
          </Col>
          <Col sm={12} md={4}>
            <font size='5'>
              <div style={{textAlign: 'left'}}>
                <p style={{paddingTop: '10px'}}>
                  <font size='8'>
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
                  <b> Site: </b>
                  <a href={this.state.rep_data['url']}>Website</a>
                </p>
                <p>
                  <b>Votes with Party (%): </b>
                  <ProgressBar bsStyle='success'
                    now={this.state.rep_data['votes_with_party_pct']}
                    label={`${this.state.rep_data['votes_with_party_pct']}%`}
                  />
                </p>
              </div>
            </font>
          </Col>
          <Col sm={12} md={4}>
            {twitter}
          </Col>
        </Row>

        <h3 class='bills-header'>Recent Bills Sponsored</h3>
        <Row style={{paddingLeft: '160px'}}>
          <RepBills data = {this.state.rep_data.bills} />
        </Row>

        <Row>
          <Col>
            <h3><b>YouTube Channel</b></h3>
            {youtube}
          </Col>
          <Col>
            <h3><b>Facebook Page</b></h3>
            {facebook}
          </Col>
          <Col>
            <h3><b>Office Location</b></h3>
            <h4>{this.state.rep_data['office']}</h4>
            <iframe
              width='600'
              height='450'
              frameborder='0' style={{border: '0'}}
              title = '{this.state.firstname} {this.state.lastname} Office Location'
              src={'https://www.google.com/maps/embed/v1/place?' +
              'key=AIzaSyDOCxZVfWFVpzzAC8tEIi3ulzNzXbOdsyY' +
              '&q=' + this.state.rep_data.office} allowfullscreen>
            </iframe>
          </Col>
        </Row>
      </div>
    )

    }


  }
}
