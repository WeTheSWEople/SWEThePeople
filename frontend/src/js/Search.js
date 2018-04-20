/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {GridList} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'
/* eslint-enable no-unused-vars */
import {Row, Col} from 'react-bootstrap'
import ReactPaginate from 'react-paginate'

import RepresentativeSingleInstance from './Representatives/RepresentativeSingleInstance'
import PoliticalPartySingleInstance from './Parties/PoliticalPartySingleInstance'
import DistrictInstance from './Districts/DistrictInstance.jsx'
import axios from 'axios'
import '../assets/css/Search.css'
import url from '../assets/resource.json'

export default class Search extends Component {
  constructor(props) {
    super(props)

    this.queryAPI = this.queryAPI.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)

    this.state = {
      ready: false,
      error: false,
      results: null,
      paginate_results: null,
      reps: null,
      parties: null,
      districts: null,
      states: null,
      party_names: null,
      party_counts: null,
      party_colors: null,
      rank: 1,
      cur_page: 0,
      all_results: null
    }

    this.buildCard = this.buildCard.bind(this)
  }

  // GET party colors from api
  componentWillMount () {
    axios.get(url.api_url + 'party/?party_color=True').then((response) => {
      this.setState({party_colors: response.data})
    })
  }

  // GET search query
  queryAPI(query) {
    this.setState({results: null})
    axios.get(url.api_url + 'search/?query=' + query).then((response) => {
      let respResult = response.data.sort(function (lhs, rhs) {
        return rhs.rank - lhs.rank
      })

      let counts = {}
      for (const entry of respResult) {
        if ('bioguide' in entry) {
          if (!(entry.party_id in counts)) {
            counts[entry.party_id] = 1
          } else {
            counts[entry.party_id]++
          }
        }
      }

      let pagResults = []
      for (let i = 0; i < 24 && i < respResult.length; i++) {
        pagResults.push(respResult[i])
      }

      this.setState({
        results: respResult,
        paginate_results: pagResults,
        party_counts: counts,
        cur_page: Math.ceil(respResult.length / 24)
      })

      // get the parties name
      return axios.get(url.api_url + `party?party_name=True`)

    }).then((response)=>{
      this.setState({
        party_names:response.data
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

  // Handle pagination on click
  handlePageClick(data){
    let cur_result = this.state.results
    let pagResults = []
    for (let i = data.selected * 24;
      i < (data.selected + 1) * 24 && i < cur_result.length; i++) {
        pagResults.push(cur_result[i])
    }

    this.setState({
      paginate_results: pagResults
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
        query: this.props.match.params.term
    })
  }

  buildCard (result) {
    if ('bioguide' in result) {
      // result is a Representative
      return (
        <Col xs={6} sm={4} md={3} className='search-card-wrapper'>
          <RepresentativeSingleInstance key={result.bioguide} rep={result}
            party_name={this.state.party_names[result.party_id][0]}
            party_color={this.state.party_colors[result.party_id]}
            search={this.props.match.params.term}
            className='search-component' />
        </Col>
      )
    } else if ('alpha_num' in result) {
      // result is a District
      return (
        <Col xs={6} sm={4} md={3} className='search-card-wrapper'>
          <DistrictInstance district={result} className='search-component'
            search={this.props.match.params.term} />
        </Col>
      )
    } else if ('chair' in result) {
      // result is a Political Party
      return (
        <Col xs={6} sm={4} md={3} className='search-card-wrapper'>
          <PoliticalPartySingleInstance party={result}
            num_reps={this.state.party_counts[result.id]}
            search={this.props.match.params.term}
            className='search-component' />
        </Col>
      )
    }
  }

  render() {
    if (this.state.results === null || this.state.party_names === null ||
      this.state.party_colors === null) {
      return (
        <div className="search-container">
          <center>
            <RingLoader color={'#123abc'} loading={true} />
          </center>
        </div>
      )
    }

    let grid = <h3 style={{textAlign: 'center'}}>
        No results found, try a different search.
    </h3>
    if (this.state.results.length > 0) {
      grid = this.state.paginate_results.map((result) =>
        this.buildCard(result))
    }

    // only show if more than 24 records
    let pagination_bar = ''
    if (this.state.results.length > 24) {
      pagination_bar = <div className="App">
                        <ReactPaginate previousLabel={"previous"}
                          nextLabel={"next"}
                          breakLabel={<a href="">...</a>}
                          breakClassName={"break-me"}
                          pageCount={this.state.cur_page}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          disabledClassName={"disabled"}
                          onPageChange={this.handlePageClick}
                          containerClassName={"pagination"}
                          subContainerClassName={"pages pagination"}
                          activeClassName={"active"} />
                    </div>
    }

    return (
      <div className='container search-container'>
        <div className='search-term'>
          <h3>
            Search results for {"\"" + this.props.match.params.term + "\""}
          </h3>
        </div>

        <Row>
          {grid}
        </Row>
        {pagination_bar}
      </div>
    )
  }
}
