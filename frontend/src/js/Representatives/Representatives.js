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


// const URL = 'http://ec2-18-188-158-73.us-east-2.compute.amazonaws.com/'

export default class Representatives extends Component {
  constructor (props) {
    super(props)
    this.state = {
      all_parties: null,
      all_states: null,
      state_value: 'None',
      party_value: 'None',
      vote_value: 'None',
      lastname_value: 'A-Z',
      sort_value: 'last_asc'
    }
    
    axios.get(url.api_url + 'party?party_name=True').then((response) => {
      this.setState({all_parties: response.data})

      axios.get(url.api_url + 'state/?state_usps=True').then((response) => {
        this.setState({all_states: response.data})
      }).catch((error) => {
        this.setState({all_parties: null, all_states: null})
      })
    }).catch((error) => {
      this.setState({all_parties: null, all_states: null})
    })

    this.handleFilterClicked = this.handleFilterClicked.bind(this)
  }

  handleFilterClicked(state_value, party_value, vote_value, lastname_value,
    sort_value) {
    this.setState({
      state_value: state_value,
      party_value: party_value,
      vote_value: vote_value,
      lastname_value: lastname_value,
      sort_value: sort_value
    })
  }

  render() {
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
          state_value={this.state.state_value}
          party_value={this.state.party_value}
          vote_value={this.state.vote_value}
          lastname_value={this.state.lastname_value}
          sort_value={this.state.sort_value} />
      </div>
    )
  }
}
