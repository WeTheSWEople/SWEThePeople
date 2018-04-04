/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {RingLoader} from 'react-spinners'
import PoliticalPartySingleInstance from './PoliticalPartySingleInstance.js'
/* eslint-enable no-unused-vars */

import '../../assets/css/App.css'
import '../../assets/css/District.css'
import '../../assets/css/FilterGrid.css'
import axios from 'axios'

const URL = 'http://ec2-18-188-158-73.us-east-2.compute.amazonaws.com/' +
  'party/filter?filter='

export default class PoliticalPartyGrid extends Component {
  constructor (props) {
    super(props)

    this.state = {
      parties: null,
      party_counts: null
    }

    this.getPartyData = this.getPartyData.bind(this)
  }

  getPartyData (filterParams) {
    this.setState({parties: null})
    axios.get(URL + JSON.stringify(filterParams)).then((response) => {
      if (response.data.length === 0) {
        this.setState({parties: -2})
      } else {
        let counts = {}
        for (const party of response.data) {
          counts[party.id] = party.representatives.length
        }

        this.setState({parties: response.data, party_counts: counts})
      }
    }).catch((error) => {
      this.setState({parties: -1})
    })
  }

  componentDidMount () {
    this.getPartyData({
      social: 'None',
      color: 'None',
      date: 'None',
      name: 'A-Z',
      order_by: 'None'
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props !== nextProps) {
      this.getPartyData({
        social: nextProps.social_value,
        color: nextProps.color_value,
        date: nextProps.formation_date_value,
        name: nextProps.name_value,
        order_by: nextProps.sort_value
      })
    }
  }

  render () {
    if (this.state.parties === null) {
      return (
        <div className='filter-grid-center'>
          <RingLoader color={'#123abc'} loading={true} />
        </div>
      )
    } else if (this.state.parties === -1) {
      return (
        <div className='filter-grid-root'>
          <p>Data Not Found</p>
        </div>
      )
    } else if (this.state.parties === -2) {
      return (
        <div className='filter-grid-root'>
          <h1>No political parties found, try a different filter.</h1>
        </div>
      )
    } else {
      let partiesGrid = this.state.parties.map((party) =>
        <div className='col-xs-6 col-sm-4 col-md-3'>
          <PoliticalPartySingleInstance party={party}
            num_reps={this.state.party_counts[party.id]} />
        </div>
      )

      return (
        <div className='container'>
          {partiesGrid}
        </div>
      )
    }
  }
}
