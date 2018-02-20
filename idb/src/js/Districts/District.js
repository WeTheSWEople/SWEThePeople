/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
/* eslint-enable no-unused-vars */
import '../../assets/css/App.css'
import '../../assets/css/District.css'

let stateJSON = require('../../assets/data/state.json')
export default class Districts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      districts: 0,
      senator_count: 0,
      total_reps: 0,
      district_arr: [],
      state_data: []
    }
  }
  componentWillMount () {
    let censusJSON = require('../../assets/data/census_data.json')
    let repJSON = require('../../assets/data/rep_data/' +
        this.props.match.params.districtid + '.json')
    // let senatorJSON = require('../../assets/data/senate_data/' +
    //   this.props.match.params.districtid + '.json')
    let reps = this.state.total_reps
    let districtsList = []
    if (repJSON['status'] === 'OK') {
      reps += repJSON['results'].length
      for (let i = 0; i < repJSON.results.length; i++) {
        let result = repJSON.results[i]
        let party = 'Democratic'
        let cssColor = 'light-blue'
        if (result['party'] === 'R') {
          party = 'Republican'
          cssColor = 'light-red'
        } else if (result['party'] === 'L') {
          party = 'Libertarian'
          cssColor = 'light-yellow'
        }

        let name = 'District ' + result['district']
        // Re-add for At-Large Districts
        // if (repJSON.results.length === 1) {
        //   name = result['district'] + ' District'
        // }

        console.log(censusJSON)
        console.log('2 ' + this.props.match.params.districtid)
        console.log(result['district'])
        let state = censusJSON[this.props.match.params.districtid]
        let population = state[result['district']]['population']['total']

        districtsList.push({'district': result['district'],
          'name': name,
          'population': population,
          'party': party,
          'rep': result['name'],
          'id': result['id'],
          'cssColor': cssColor,
          'rep_id': result['id']})
      }

      districtsList.sort(function (a, b) {
        return parseInt(a.district) - parseInt(b.district)
      })
      this.setState({districts: repJSON['results'].length,
        total_reps: reps,
        districts_arr: districtsList})
    }
  }
  render () {
    let styles = {
      head: {
        paddingTop: '70px'
      },
      imgStyle: {
        width: '50%'
      }
    }

    let districtsGrid = this.state.districts_arr.map((district) =>
      <div className='col-sm-3 district-grid' key={district.district}>
        <Link to={`/districts/${this.props.match.params.districtid}/` +
          `${district.district}`}>
          <div className={'district-card ' + district.cssColor}>
            <h3><b>{district.name}</b></h3>
            <h5><b>Population: </b>{district.population}</h5>
            <br></br>
            <h4><b>Representative:</b></h4>
            <h4>{district.rep}</h4>
            <br /> <br />
            <h4>Party: {district.party}</h4>
          </div>
        </Link>
      </div>
    )

    return (
      <div className='container' style={styles.head}>
        <h1 className='district-header'>
          {stateJSON[this.props.match.params.districtid]}
        </h1>
        <div className='row'>
          {districtsGrid}
        </div>
      </div>
    )
  }
}
