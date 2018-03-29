/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {GridList} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'
/* eslint-enable no-unused-vars */

import RepresentativeInstance from './Representatives/RepresentativeInstance'
import axios from 'axios'

import '../assets/css/Search.css'

export default class Search extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ready: false,
      error: false,
      reps: null,
      party_names: null
    }
  }

  componentWillMount() {
    this.setState({ready: false})

    this.setState({ready: true})
  }

  componentDidMount() {
    axios.get(`http://api.swethepeople.me/representative/`)
    .then((response)=>{
      this.setState({
        reps: response.data,
      })

      // get the party names
      return axios.get(`http://api.swethepeople.me/party?party_name=True`)
    })
    .then((response)=>{
      this.setState({
        party_names: response.data
      })
    })
    .catch((error)=>{
      this.setState({
          reps: null,
          party_names: null
      })
    })
  }

  render() {
    if (this.state.reps === null || this.state.party_names === null) {
      return (
        <div className="search-container">
          <center>
            <RingLoader color={'#123abc'} loading={true} />
          </center>
        </div>
      )
    }

    let repGrid = this.state.reps.map((rep) => (
      <RepresentativeInstance key={rep.bioguide} rep={rep}
        party_name={this.state.party_names[rep.party_id][0]} />
    ))

    return (
      <div className="search-container">
        <div className="model-container">
          <h3 className="model-name">Political Parties</h3>
        </div>

        <div className="model-container">
          <h3 className="model-name">Representatives</h3>
          <GridList cellHeight={400} cols={4} className="reps-grid">
            {repGrid}
          </GridList>
        </div>

        <div className="model-container">
          <h3 className="model-name">Districts</h3>
        </div>

        <div className="model-container">
          <h3 className="model-name">States</h3>
        </div>
      </div>
    )
  }
}
