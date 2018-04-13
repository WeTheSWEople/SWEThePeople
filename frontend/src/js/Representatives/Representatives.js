/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {GridList} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'
/* eslint-disable no-unused-vars */

import axios from 'axios'
import RepresentativeFilter from './RepresentativeFilter'
import RepresentativeGrid from './RepresentativeGrid'
import '../../assets/css/App.css'
import url from '../../assets/resource.json'

export default class Representatives extends Component {
  constructor (props) {
    super(props)
    this.state = {
      all_parties: null,
      all_states: null,
      stateValue: 'None',
      partyValue: 'None',
      voteValue: 'None',
      lastnameValue: 'A-Z',
      sortValue: 'last_asc'
    }

    axios.get(url.api_url + 'party?party_name=True').then((response) => {
      this.setState({all_parties: response.data})

      axios.get(url.api_url + 'state/?state_usps=True').then((response) => {
        this.setState({all_states: response.data})
      }).catch((error) => {
        if (error) {
          this.setState({all_parties: null, all_states: null})
        }
      })
    }).catch((error) => {
      if (error) {
        this.setState({all_parties: null, all_states: null})
      }
    })

    this.handleFilterClicked = this.handleFilterClicked.bind(this)
  }

  handleFilterClicked (stateValue, partyValue, voteValue, lastnameValue,
    sortValue) {
    this.setState({
      stateValue: stateValue,
      partyValue: partyValue,
      voteValue: voteValue,
      lastnameValue: lastnameValue,
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

    if (this.state.all_states === null || this.state.all_parties === null) {
      return (
        <div style={styles.center} className="loading">
          <RingLoader color={'#123abc'} loading={true} />
        </div>
      )
    }

    return (
      <div style={{paddingTop: '25px'}}>
        <RepresentativeFilter
          states={this.state.all_states}
          parties={this.state.all_parties}
          buttonHandler={this.handleFilterClicked} />
        <RepresentativeGrid
          stateValue={this.state.stateValue}
          partyValue={this.state.partyValue}
          voteValue={this.state.voteValue}
          lastnameValue={this.state.lastnameValue}
          sortValue={this.state.sortValue} />
      </div>
    )
  }
}
