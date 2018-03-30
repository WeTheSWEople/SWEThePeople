/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {GridList} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'
/* eslint-enable no-unused-vars */

import RepresentativeInstance from './Representatives/RepresentativeInstance'
import PoliticalPartySingleInstance from './Parties/PoliticalPartySingleInstance'
import DistrictInstance from './Districts/DistrictInstance'
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
      party_names: null,
      party_counts: null,
      query : null
    }
  }

  queryAPI(query) {
    axios.get('http://ec2-18-188-158-73.us-east-2.compute.amazonaws.com/' +
      'search/?query=' + query).then((response) => {
      let names = {}
      for (const party of response.data.parties) {
        names[party.id] = party.name
      }

      let counts = {}
      for (const rep of response.data.reps) {
        if (!(rep.party_id in counts)) {
          counts[rep.party_id] = 1
        } else {
          counts[rep.party_id]++
        }
      }
      this.setState({
        reps: response.data.reps,
        parties: response.data.parties,
        districts: response.data.districts,
        party_names: names,
        party_counts: counts
      })
    }).catch((error) => {
      this.setState({
        reps: null,
        parties: null,
        districts: null,
        party_names: null,
        party_counts: null
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.term !== nextProps.match.params.term) {
      this.queryAPI(nextProps.match.params.term)
      this.setState({
        query : nextProps.match.params.term
      })
    }
  }

  componentDidMount() {
    this.queryAPI(this.props.match.params.term)
    this.setState({
        query : this.props.match.params.term
    })
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
      <PoliticalPartySingleInstance party={party}
        num_reps={this.state.party_counts[party.id]} search={this.state.query}/>
    ))

    let repGrid = this.state.reps.map((rep) => (
      <RepresentativeInstance key={rep.bioguide} rep={rep}
        party_name={this.state.party_names[rep.party_id]} search={this.state.query} />
    ))

    let districtGrid = this.state.districts.map((district) => (
      <DistrictInstance district={district} search={this.state.query} />
    ))

    let partiesDiv = <h3 className='model-name'>No Political Parties Found</h3>
    let x = "Republican"
    let y = "This is Republican"
    if (this.state.parties.length > 0) {
        partiesDiv = <div>
          <h3 className="model-name">Political Parties</h3>
          <div className="container party-container">
            {partiesGrid}             
          </div>
        </div>
    }

    let repsDiv = <h3 className='model-name'>No Representatives Found</h3>
    if (this.state.reps.length > 0) {
      repsDiv = <div>
        <h3 className="model-name">Representatives</h3>
        <GridList cellHeight={400} cols={4} className="reps-grid">
          {repGrid}
        </GridList>
      </div>
    }

    let districtsDiv = <h3 className='model-name'>No Districts Found</h3>
    if (this.state.districts.length > 0) {
      districtsDiv = <div>
        <h3 className="model-name">Districts</h3>
        <div className='row'>
          {districtGrid}
        </div>
      </div>
    }

    return (
      <div className="search-container">
        <div className='model-container'>
          {partiesDiv}
        </div>

        <div className='model-container'>
          {repsDiv}
        </div>

        <div className='model-container'>
          {districtsDiv}
        </div>
      </div>
    )
  }
}
