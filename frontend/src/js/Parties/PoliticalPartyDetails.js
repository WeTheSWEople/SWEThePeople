/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {GridList} from 'material-ui/GridList'
import {Timeline} from 'react-twitter-widgets'
import RepresentativeInstance from '../Representatives/RepresentativeInstance'
import DistrictInstance from '../Districts/DistrictInstance.js'
import {RingLoader} from 'react-spinners'
import axios from 'axios'
import Slider from 'react-slick'
/* eslint-enable no-unused-vars */

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '../../assets/css/App.css'
import '../../assets/css/PoliticalPartyDetails.css'
import '../../assets/css/District.css'
import url from '../../assets/resource.json'

export default class PoliticalPartyDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      error: false,
      num_reps: 0,
      totalReps: 435,
      party: null,
      reps: null,
      districts: null,
      color: null,
      partyFlag: false,
      districtFlag: false
    }

    this.compareReps = this.compareReps.bind(this)
  }

  componentDidMount () {
    this.setState({ready: false})

    axios.get(url.api_url + 'district/').then((response) => {
      let disMap = {}
      for (let i = 0; i < response.data.length; i++) {
        const district = response.data[i]
        disMap[district['representative_id']] = district
      }

      this.setState({districts: disMap, districtFlag: true})
    })

    axios.get(url.api_url + 'party/' +
      this.props.match.params.path).then((response) => {
      let repsMap = {}
      response.data['representatives'].forEach(function (rep) {
        repsMap[rep['bioguide']] = rep
      })

      if (response.data['chair'] === '') {
        response.data['chair'] = 'None'
      }

      let p = {
        name: response.data['name'],
        path: response.data['path'],
        chair: response.data['chair'],
        formation_date: response.data['formation_date'],
        twitter_handle: response.data['twitter_handle'],
        youtube: response.data['youtube'],
        office: response.data['office'],
        website: response.data['website'],
        color: response.data['colors'].map((c) => { return c['color'] })
      }

      this.setState({
        party: p,
        num_reps: response.data['representatives'].length,
        reps: repsMap,
        totalReps: 435,
        partyFlag: true,
        ready: true})
    })
  }

  compareReps (lhs, rhs) {
    return this.state.reps[lhs].lastname.localeCompare(
      this.state.reps[rhs].lastname)
  }

  render () {
    if (!(this.state.districtFlag && this.state.partyFlag)) {
        return(
        <div style={{display: 'flex',
                    flexWrap: 'wrap',
                    paddingTop: '25%',
                    paddingLeft: '50px',
                    paddingRight: '50px',
                    justifyContent: 'space-around'}}>
        <RingLoader color={'#123abc'} loading={true} />
         </div>)
    }

    const oldDis = this.state.districts
    let districts = {}
    Object.keys(this.state.reps).forEach(function (repID) {
      if (oldDis[repID] !== undefined) {
        districts[repID] = oldDis[repID]
      }
    })

    let colors = []
    for (let i = 0; i < this.state.party['color'].length; i++) {
      if (i !== 0) {
        colors.push(', ')
      }

      const c = this.state.party['color'][i]
      let cssColor = c
      if (c === 'White' || c === 'Azure') {
        cssColor = 'Black'
      }
      colors.push(<span style={{color: cssColor}} key={i}>{c}</span>)
    }

    let styles = {
      partyColor: {},
      progressStyle: {}
    }

    styles.partyColor = {
      color: this.state.party['color']
    }
    styles.progressStyle = {
      width: ((this.state.num_reps / this.state.totalReps) * 100) + '%',
      backgroundImage: 'none',
      backgroundColor: this.state.party['color']
    }

    let controlText = ''
    let noControl = ''
    let repsInfo = ''
    let districtsInfo = ''
    if (this.state.num_reps > 0) {
      controlText = this.state.num_reps + '/' + this.state.totalReps

      let repsGrid = Object.keys(this.state.reps).sort(this.compareReps)
        .map((key) =>
        <div className='party-rep-card'>
          <RepresentativeInstance key={key} rep={this.state.reps[key]}
            columns={"false"} />
        </div>
      )

      let districtsGrid = Object.keys(districts).map((key) =>
        <Link to={`/districts/${districts[key].state}/${districts[key].id}`}>
          <div className='party-rep-card party-district'>
            <div className='district-card '>
              <h3><b>{districts[key].alpha_num}</b></h3>
              <h5><b>Population: </b>{districts[key].population}</h5>
              <h5><b>Median Age: </b>{districts[key].median_age}</h5>
              <br />
              <img src={
                require('../../assets/images/districts/' +
                districts[key].alpha_num + '.png')}
                alt='District Map'
                className='img-responsive district-img'/>
            </div>
          </div>
        </Link>
      )

      const settings = {
        dots: false,
        infinite: true,
        arrows: true,
        slidesToShow: 5,
        slidesToScroll: 5,
        autoplay: false,
        centerMode: false
      }

      repsInfo = <div className='reps-grid'>
        <h2>Representatives</h2>
        <Slider {...settings} className='carousel'>
          {repsGrid}
        </Slider>
      </div>

      districtsInfo = <div className='districts-grid'>
        <h2>Districts</h2>
        <Slider {...settings} className='carousel'>
          {districtsGrid}
        </Slider>
      </div>
    } else {
      noControl = '0/' + this.state.totalReps
    }

    let twitter = <h4><b>No Twitter handle</b></h4>
    if (this.state.party != null && this.state.party['twitter_handle'] !== '') {
      twitter = <div>
        <Timeline dataSource={{sourceType: 'profile',
          screenName: this.state.party['twitter_handle']}}
        options={{username: this.state.party['twitter_handle'],
          height: '500'}} />
      </div>
    }

    let youtube = <h4><b>No YouTube channel</b></h4>
    if (this.state.party != null && this.state.party['youtube'] !== '') {
      youtube = <div className='youtube-div'>
        <h4><b>YouTube Channel</b></h4>
        <h4>{this.state.party['youtube']}</h4>
        <iframe width='353' height='200'
          src={'http://www.youtube.com/embed?max-results=1&controls=0&' +
            'showinfo=0&rel=0&listType=user_uploads&list=' +
            this.state.party['youtube']}
          frameBorder='10' allowFullScreen
          title={this.props.match.params.name + ' YouTube Channel'}
        >
        </iframe>
      </div>
    }

    let office = <h4><b>No office location</b></h4>
    if (this.state.party != null && this.state.party['office'] !== '') {
      office = <div>
        <h4><b>Office Location:</b></h4>
        <h4>{this.state.party['office']}</h4>
        <iframe width='353' height='200'
          frameBorder='0' style={{border: '0'}}
          src={'https://www.google.com/maps/embed/v1/place?key=AIzaSyDO' +
            'CxZVfWFVpzzAC8tEIi3ulzNzXbOdsyY&q=' +
            this.state.party['office']}
          allowFullScreen
          title={this.props.match.params.name + ' Google Maps Location'}>
        </iframe>
      </div>
    }

    let website = this.state.party.website
    if (!website.startsWith('http')) {
      website = 'http://' + website
    }

    return (
      <div className='App party-content container'>
        <div className='row party-card top-info'>
          <div className='party-header col-sm-6'>
            <img src={require('../../assets/images/parties/full/' +
              this.state.party['path'] + '.png')}
            className='img-responsive'
            alt={this.state.party['path']} />
            <h1>{this.state.party['name']}</h1>
          </div>

          <div className='col-sm-6 quick-facts'>
            <h3>Quick Facts</h3>
            <p>
              <span className='party-info-header'>Party chair:</span>
              <span className='party-info-info'>
                {this.state.party['chair']}
              </span>
            </p>
            <p>
              <span className='party-info-header'>Formation date:</span>
              <span className='party-info-info'>
                {this.state.party['formation_date']}
              </span>
            </p>
            <p>
              <span className='party-info-header'>Party colors:</span>
              <span className='party-info-info'>
                {colors}
              </span>
            </p>
            <p>
              <span className='party-info-header'>Website:</span>
              <span className='party-info-info'>
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {this.state.party['website']}
                </a>
              </span>
            </p>
            <p className='party-info-header'>House Control:</p>
            <div className='progress'>
              {noControl}
              <div className='progress-bar' role='progressbar'
                style={styles.progressStyle}
                aria-valuenow='50' aria-valuemin='0'
                aria-valuemax='435'>
                {controlText}
              </div>
            </div>
          </div>
        </div>

        <div className='media party-card row'>
          <h2>Media</h2>
          <div className='row'>
            <div className='col-md-6'>
              {youtube}
              <br />
              {office}
            </div>

            <div className='col-md-6'>
              {twitter}
            </div>
          </div>
        </div>

        {repsInfo}
        {districtsInfo}
      </div>
    )
  }
}
