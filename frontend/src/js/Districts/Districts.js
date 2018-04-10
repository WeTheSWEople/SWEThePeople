/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {RingLoader} from 'react-spinners'
import DistrictGrid from './DistrictGrid'
import DistrictFilter from './DistrictFilter'
/* eslint-enable no-unused-vars */

import axios from 'axios'
import url from '../../assets/resource.json'

/* Full districts page, including grid and filter UI */
export default class Districts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      all_states: null,
      stateValue: 'None',
      populationValue: 'None',
      medianAgeValue: 'None',
      sortValue: 'last_asc'
    }

    axios.get(url.api_url + 'state/?state_usps=True').then((response) => {
      this.setState({all_states: response.data})
    }).catch((error) => {
      if (error) {
        this.setState({all_states: null})
      }
    })

    this.handleFilterClicked = this.handleFilterClicked.bind(this)
  }

  handleFilterClicked (stateValue, populationValue, medianAgeValue,
    sortValue) {
    this.setState({
      stateValue: stateValue,
      populationValue: populationValue,
      medianAgeValue: medianAgeValue,
      sortValue: sortValue
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
          stateValue={this.state.stateValue}
          populationValue={this.state.populationValue}
          medianAgeValue={this.state.medianAgeValue}
          sortValue={this.state.sortValue} />
      </div>
    )
  }
}
