/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {GridList} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'
/* eslint-enable no-unused-vars */

import RepresentativeSingleInstance from './Representatives/RepresentativeSingleInstance'
import PoliticalPartySingleInstance from './Parties/PoliticalPartySingleInstance'
import DistrictInstance from './Districts/DistrictInstance'
import axios from 'axios'

import '../assets/css/Search.css'

export default class Search extends Component {
  constructor(props) {
    super(props)

    this.queryAPI = this.queryAPI.bind(this)

    this.state = {
      ready: false,
      error: false,
      reps: null,
      parties: null,
      districts: null,
      states: null,
      party_names: null,
      party_counts: null,
      rank: 1
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
        party_counts: counts,
        rank: response.data.rank
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
      this.setState({reps: null})
      this.queryAPI(nextProps.match.params.term)
    }
  }

  componentDidMount() {
    this.queryAPI(this.props.match.params.term)
    this.setState({
        query : this.props.match.params.term
    })
  }

  render() {
    if (this.state.reps === null || this.state.parties === null ||
      this.state.districts === null || this.state.party_names === null ||
      this.state.party_counts === null) {
      return (
        <div className="search-container">
          <center>
            <RingLoader color={'#123abc'} loading={true} />
          </center>
        </div>
      )
    }

    let partiesGrid = this.state.parties.map((party) => (
      <div className='col-xs-6 col-sm-4 col-md-3 search-card-wrapper'>
        <PoliticalPartySingleInstance party={party}
          num_reps={this.state.party_counts[party.id]}
          search={this.props.match.params.term}
          className='search-component' />
      </div>
    ))

    let repGrid = this.state.reps.map((rep) => (
      <div className='col-xs-6 col-sm-4 col-md-3 search-card-wrapper'>
        <RepresentativeSingleInstance key={rep.bioguide} rep={rep}
          party_name={this.state.party_names[rep.party_id]}
          search={this.props.match.params.term}
          className='search-component' />
      </div>
    ))

    let districtGrid = this.state.districts.map((district) => (
      <div className='col-xs-6 col-sm-4 col-md-3 search-card-wrapper'>
        <DistrictInstance district={district} className='search-component'
          search={this.props.match.params.term} />
      </div>
    ))

    let rankedDiv = null
    if (this.state.rank === 1) {
      rankedDiv = <div>
        {repGrid}
        {partiesGrid}
        {districtGrid}
      </div>
    } else if (this.state.rank === 2) {
      rankedDiv = <div>
        {partiesGrid}
        {repGrid}
        {districtGrid}
      </div>
    } else {
      rankedDiv = <div>
        {districtGrid}
        {repGrid}
        {partiesGrid}
      </div>
    
    }

    return (
      <div className='container search-container'>
        <div className='search-term'>
          <h3>
            Search results for {"\"" + this.props.match.params.term + "\""}
          </h3>
        </div>

        <div className='row'>
          {rankedDiv}
        </div>
      </div>
    )
  }
}
