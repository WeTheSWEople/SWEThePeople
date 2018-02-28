/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {GridList} from 'material-ui/GridList'
import {Timeline} from 'react-twitter-widgets'
import RepresentativeInstance from '../Representatives/RepresentativeInstance'
/* eslint-enable no-unused-vars */

import '../../assets/css/App.css'
import '../../assets/css/PoliticalPartyDetails.css'
import '../../assets/css/District.css'

import allParties from '../../assets/parties.json'
import repsInfo from '../../assets/all-reps-endpoint.json'

export default class PoliticalPartyDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ready: false,
      error: false,
      party: {},
      num_reps: 0,
      reps: {},
      districts: []
    }
  }

  componentWillMount () {
    this.setState({ready: false})

    let thisParty = {}
    const keys = Object.keys(allParties)
    for (const partyName of keys) {
      if (allParties[partyName]['path'].toUpperCase().startsWith(
        this.props.match.params.path.toUpperCase())) {
        thisParty = allParties[partyName]
        break
      }
    }
    this.setState({party: thisParty})

    let censusJSON = require('../../assets/data/census_data.json')
    let repsMap = {}
    let districtsArr = []
    let repCount = 0
    Object.keys(repsInfo).forEach(function (key) {
      if (thisParty['name'].startsWith(repsInfo[key]['party'])) {
        let result = repsInfo[key]
        repsMap[key] = result
        repCount += 1

        let districtName = 'District ' + result['district']
        let censusDistrict = censusJSON[result['state']][result['district']]
        let population = censusDistrict['population']['total']
        let repName = result['firstName'] + ' ' + result['lastName']
        let party = thisParty['name']
        let cssColor = 'light-blue'
        if (result['party'] === 'Republican') {
          party = 'Republican'
          cssColor = 'light-red'
        } else if (result['party'] === 'Libertarian') {
          party = 'Libertarian'
          cssColor = 'light-yellow'
        }

        districtsArr.push({'district': result['district'],
          'state': result['state'],
          'districtName': districtName,
          'population': population,
          'party': party,
          'cssColor': cssColor,
          'rep': repName,
          'rep_id': result['bioguide']})
      }
    })

    districtsArr.sort(function (a, b) {
      return parseInt(a.district, 10) - parseInt(b.district, 10)
    })
    this.setState({num_reps: repCount,
      reps: repsMap,
      districts: districtsArr,
      ready: true})
  }

  render () {
    let colors = []
    for (let i = 0; i < this.state.party['color'].length; i++) {
      if (i !== 0) {
        colors.push(', ')
      }

      colors.push(<span style={{color: this.state.party['color'][i]}} key={i}>
        {this.state.party['color'][i]}
      </span>)
    }

    const styles = {
      partyColor: {
        color: this.state.party['color']
      },
      progressStyle: {
        width: ((this.state.num_reps / 4) * 100) + '%',
        backgroundImage: 'none',
        backgroundColor: this.state.party['color']
      }
    }

    let controlText = ''
    if (this.state.num_reps > 0) {
      controlText = this.state.num_reps + '/4'
    }

    let repsGrid = Object.keys(this.state.reps).map((key) =>
      <div className='col-sm-3 party-rep-card'>
        <RepresentativeInstance key={key} rep={this.state.reps[key]} />
      </div>
    )

    let districtsGrid = this.state.districts.map((district) =>
      <Link to={`/districts/${district['state']}/${district['district']}`}>
        <div className='col-sm-3 party-rep-card'>
          <div className={'district-card ' + district.cssColor}>
            <h3><b>{district.districtName}</b></h3>
            <h5><b>Population: </b>{district.population}</h5>
            <br />
            <h4><b>Representative:</b></h4>
            <h4>{district.rep}</h4>
            <img src={'https://theunitedstates.io/images/congress/225x275/' +
              district['rep_id'] + '.jpg'}
            alt={district.name}
            className='rep_img' />
            <br />
            <br />
            <h4>Party: {district.party}</h4>
          </div>
        </div>
      </Link>
    )

    let twitter = 'No twitter handle'
    if (this.state.party['twitter_handle'] !== '') {
      twitter = <div>
        <Timeline dataSource={{sourceType: 'profile',
          screenName: this.state.party['twitter_handle']}}
        options={{username: this.state.party['twitter_handle'],
          height: '500'}} />
      </div>
    }

    let youtube = 'No youtube channel'
    if (this.state.party['youtube'] !== '') {
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
    if (this.state.party['office'] !== '') {
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
              {this.state.party['chair']}
            </p>
            <p>
              <span className='party-info-header'>Formation date:</span>
              {this.state.party['formation_date']}
            </p>
            <p>
              <span className='party-info-header'>Party colors:</span>
              {colors}
            </p>
            <p>
              <span className='party-info-header'>Website:</span>
              <a href={this.state.party['website']}>
                {this.state.party['website']}
              </a>
            </p>
            <p className='party-info-header'>House Control:</p>
            <div className='progress'>
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
              {office}
            </div>

            <div className='col-md-6'>
              {twitter}
            </div>
          </div>
        </div>

        <div>
          <h3 className='rep-header'>Representatives</h3>
          <div className='row'>
            {repsGrid}
          </div>
        </div>

        <div>
          <h3 className='rep-header'>Districts</h3>
          <div className='row'>
            {districtsGrid}
          </div>
        </div>
      </div>
    )
  }
}
