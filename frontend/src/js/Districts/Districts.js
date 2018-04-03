/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {RingLoader} from 'react-spinners'
/* eslint-enable no-unused-vars */

import axios from 'axios'
import DistrictGrid from './DistrictGrid'
import DistrictFilter from './DistrictFilter'

const URL = 'http://ec2-18-188-158-73.us-east-2.compute.amazonaws.com/'

export default class Districts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      all_states: null,
      state_value: 'None',
      population_value: 'None',
      median_age_value: 'None',
      sort_value: 'last_asc'
    }

    axios.get(URL + 'state/?state_usps=True').then((response) => {
      this.setState({all_states: response.data})
    }).catch((error) => {
      this.setState({all_states: null})
    })

    this.handleFilterClicked = this.handleFilterClicked.bind(this)
  }

  handleFilterClicked(state_value, population_value, median_age_value,
    sort_value) {
    this.setState({
      state_value: state_value,
      population_value: population_value,
      median_age_value: median_age_value,
      sort_value: sort_value
    })
  }

  render () {
    const styles = {
      center: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingTop: '25%',
        paddingLeft: '50px',
        paddingRight: '50px',
        justifyContent: 'space-around'
      }
    }

    if (this.state.all_states === null) {
      return (
        <div style={styles.center} className="loading">
          <RingLoader color={'#123abc'} loading={true} />
        </div>
      )
    }

    return (
      <div style={{paddingTop: '25px'}}>
        <DistrictFilter
          states={this.state.all_states}
          buttonHandler={this.handleFilterClicked} />
        <DistrictGrid
          state_value={this.state.state_value}
          population_value={this.state.population_value}
          median_age_value={this.state.median_age_value}
          sort_value={this.state.sort_value}
          all_states={this.state.all_states} />
      </div>
    )
  }
}
