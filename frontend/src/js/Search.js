/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {GridList} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'
/* eslint-enable no-unused-vars */

import RepresentativeInstance from './Representatives/RepresentativeInstance'
import PoliticalPartySingleInstance from './Parties/PoliticalPartySingleInstance'
import axios from 'axios'

import '../assets/css/Search.css'

export default class Search extends Component {
  constructor(props) {
    super(props)

    this.queryAPI = this.queryAPI.bind(this)

    console.log(this.props.match.params)
    console.log(this.props.match.params.term)

    this.state = {
      ready: false,
      error: false,
      reps: null,
      parties: null,
      districts: null,
      states: null,
      party_names: null
    }
  }

  queryAPI(query) {
    axios.get('http://ec2-18-188-158-73.us-east-2.compute.amazonaws.com/' +
      'search/?query=' + query).then((response) => {
      console.log(response.data)

      let names = {}
      for (const party of response.data.parties) {
        names[party.id] = party.name
      }

      this.setState({
        reps: response.data.reps,
        parties: response.data.parties,
        districts: response.data.districts,
        party_names: names,
        states: null,
      })
    }).catch((error) => {
      this.setState({
        reps: null,
        parties: null,
        districts: null,
        party_names: null,
        states: null,
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.term !== nextProps.match.params.term) {
      this.queryAPI(nextProps.match.params.term)
    }
  }

  componentDidMount() {
    this.queryAPI(this.props.match.params.term)
  }

  render() {
    if (this.state.reps === null || this.state.parties === null) {
      return (
        <div className="search-container">
          <center>
            <RingLoader color={'#123abc'} loading={true} />
          </center>
        </div>
      )
    }

    let partiesGrid = this.state.parties.map((party) => (
      <PoliticalPartySingleInstance party={party} />
    ))

    let repGrid = this.state.reps.map((rep) => (
      <RepresentativeInstance key={rep.bioguide} rep={rep}
        party_name={this.state.party_names[rep.party_id]} />
    ))

    return (
      <div className="search-container">
        <div className="model-container">
          <h3 className="model-name">Political Parties</h3>
          <div className="container party-container">
            {partiesGrid}
          </div>
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
      </div>
    )
  }
}
