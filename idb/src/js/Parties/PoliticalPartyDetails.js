/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {GridList} from 'material-ui/GridList'
import {Timeline} from 'react-twitter-widgets'
import RepresentativeInstance from '../Representatives/RepresentativeInstance'
/* eslint-enable no-unused-vars */

import axios from 'axios'

import '../../assets/css/App.css'
import '../../assets/css/PoliticalPartyDetails.css'
import '../../assets/css/District.css'

export default class PoliticalPartyDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      error: false,
      party: null,
      num_reps: 0,
      totalReps: 435,
      reps: null,
      districts: null,
      color: null,
      partyFlag: false,
      districtFlag: false
    }
  }

  componentDidMount () {
    this.setState({ready: false})

    // axios.get('http://api.swethepeople.me/district').then((response) => {
    axios.get('http://0.0.0.0:4040/district').then((response) => {
      console.log('districts get')
      let disMap = {}
      for (let i = 0; i < response.data.length; i++) {
        const district = response.data[i]
        disMap[district['representative_id']] = district
      }

      this.setState({districts: disMap, districtFlag: true})
    })

    axios.get('http://api.swethepeople.me/party/' +
      this.props.match.params.path).then((response) => {
      console.log('party get')
      let repsMap = {}
      response.data['representatives'].forEach(function (rep) {
        repsMap[rep['bioguide']] = rep
      })

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

      console.log('rep get: ' + Object.keys(repsMap).length)

      this.setState({
        party: p,
        num_reps: response.data['representatives'].length,
        reps: repsMap,
        totalReps: 435,
        partyFlag: true,
        ready: true})
    })

    // axios.get('http://api.swethepeople.me/district/' + rep['state'] +
    //   '/' + rep['district']).then((response) => {
    //   let districtName = 'District ' + rep['district']
    //   let population = response.data['population']
    //   let repName = rep['firstName'] + ' ' + rep['lastName']
    //   let party = response.data['name']
    //   let cssColor = 'light-blue'
    //   if (rep['party'] === 'Republican') {
    //     party = 'Republican'
    //     cssColor = 'light-red'
    //   } else if (rep['party'] === 'Libertarian') {
    //     party = 'Libertarian'
    //     cssColor = 'light-yellow'
    //   }

    //   districtsArr.push({
    //     'district': rep['district'],
    //     'state': rep['state'],
    //     'districtName': districtName,
    //     'population': population,
    //     'party': party,
    //     'cssColor': cssColor,
    //     'rep': repName,
    //     'rep_id': rep['bioguide']})
    // })
    // })

    // districtsArr.sort(function (a, b) {
    //   return parseInt(a.district, 10) - parseInt(b.district, 10)
    // })
  }

  render () {
    if (!(this.state.districtFlag && this.state.partyFlag)) {
      console.log('not ready')
      console.log('dis: ' + this.state.districtFlag)
      console.log('party: ' + this.state.partyFlag)
      return (
        <div className='App party-content container'></div>
      )
    }

    console.log('ready')
    console.log('reps: ' + Object.keys(this.state.reps).length)
    console.log('dis:  ' + Object.keys(this.state.districts).length)

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

      let repsGrid = Object.keys(this.state.reps).map((key) =>
        <div className='col-sm-3 party-rep-card'>
          <RepresentativeInstance key={key} rep={this.state.reps[key]} />
        </div>
      )

      repsInfo = <div className='reps-grid'>
        <h2>Representatives</h2>
        <div className='row'>
          {repsGrid}
        </div>
      </div>

      let districtsGrid = Object.keys(districts).map((key) =>
        <div className='col-sm-3 party-rep-card'>
          <div className='district-card '>
            <h3><b>{districts[key].alpha_num}</b></h3>
            <h5><b>Population: </b>{districts[key].population}</h5>
            <br />
            <h4><b>Representative:</b></h4>
            <h4>{this.state.reps[key].firstName + ' ' +
              this.state.reps[key].lastName}</h4>
            <img src={'https://theunitedstates.io/images/congress/225x275/' +
              key + '.jpg'}
            alt={districts[key].name}
            className='rep_img' />
            <br />
            <br />
          </div>
        </div>
      )

      districtsInfo = <div className='districts-grid'>
        <h2>Districts</h2>
        <div className='row'>
          {districtsGrid}
        </div>
      </div>
    } else {
      noControl = '0/' + this.state.totalReps
    }

    // let districtsInfo = ''

    // let districtsGrid = this.state.districts.map((district) =>
    //   <Link to={`/districts/${district['state']}/${district['district']}`}>
    //     <div className='col-sm-3 party-rep-card'>
    //       <div className={'district-card ' + district.cssColor}>
    //         <h3><b>{district.districtName}</b></h3>
    //         <h5><b>Population: </b>{district.population}</h5>
    //         <br />
    //         <h4><b>Representative:</b></h4>
    //         <h4>{district.rep}</h4>
    //         <img src={'https://theunitedstates.io/images/congress/225x275/' +
    //           district['rep_id'] + '.jpg'}
    //         alt={district.name}
    //         className='rep_img' />
    //         <br />
    //         <br />
    //         <h4>Party: {district.party}</h4>
    //       </div>
    //     </div>
    //   </Link>
    // )

    // districtsInfo = <div className='districts-grid'>
    //   <h2>Districts</h2>
    //   <div className='row'>
    //     {districtsGrid}
    //   </div>
    // </div>

    let twitter = 'No twitter handle'
    if (this.state.party != null && this.state.party['twitter_handle'] !== '') {
      twitter = <div>
        <Timeline dataSource={{sourceType: 'profile',
          screenName: this.state.party['twitter_handle']}}
        options={{username: this.state.party['twitter_handle'],
          height: '500'}} />
      </div>
    }

    let youtube = 'No youtube channel'
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

    let office = 'No office location'
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
                <a href={this.state.party['website']}>
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
