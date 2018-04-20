/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {GridList} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'
/* eslint-disable no-unused-vars */
import ReactPaginate from 'react-paginate'
import {Row, Col} from 'react-bootstrap'

import RepresentativeInstance from './RepresentativeInstance'
import '../../assets/css/App.css'
import '../../assets/css/FilterGrid.css'
import axios from 'axios'
import url from '../../assets/resource.json'


/**
 * Helper function to clone given obj. Used for pagination 
 */
function clone (obj) {
  if (obj == null || typeof obj !== 'object') return obj
  let copy = obj.constructor()
  for (let attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
  }
  return copy
}

/* eslint-disable no-extend-native */
Array.prototype.subarray = function (start, end) {
  if (!end) {
    end = this.length
  }
  let newArray = clone(this)
  return newArray.slice(start, end)
}
/* eslint-enable no-extend-native */

/**
 * React component for the representative grid. Renders the representatives
 * in a grid format along with pagination.
 */
export default class RepresentativeGrid extends Component {
  /**
   * Constructor to initialize state variables
   */
  constructor (props) {
    super(props)
    this.state = {
      all_reps: null,
      party_name: null,
      displayed_reps: null,
      party_colors: null,
      cur_page: 0
    }

    this.getRepData = this.getRepData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  /**
   * Set the state variables upon mounting of this component
   */
  componentWillMount () {
    axios.get(url.api_url + 'party/?party_color=True').then((response) => {
      this.setState({party_colors: response.data})
    })
  }

  /**
   * Function to handle page click. Resets the state variables. 
   * Used for pagination
   */
  handlePageClick (data) {
    this.setState({displayed_reps:
      this.state.all_reps.subarray(data.selected * 24, (data.selected + 1) * 24)
    })
  }

  /**
   * Makes an http request to our api to get information about representative
   * and party and set the state varibles accordingly
   * @param - filterparams: filter parameters
   */
  getRepData (filterParams) {
    this.setState({all_reps: null})
    // get the current representatives
    axios.get(url.api_url + 'representative/filter?filter=' +
      JSON.stringify(filterParams)).then((response) => {
      if (response.data.length === 0) {
        this.setState({all_reps: -2, displayed_reps: -2})
      } else {
        this.setState({
          all_reps: response.data,
          displayed_reps: response.data.slice(0, 24),
          cur_page: response.data.length / 24
        })
      }
      // get the party names
      return axios.get(url.api_url + `party?party_name=True`)
    }).then((response) => {
      this.setState({party_name: response.data})
    }).catch((error) => {
      if (error) {
        this.setState({
          all_reps: -1,
          party_name: -1
        })
      }
    })
  }

  /**
   * Make a function call to get the data from the api when parent props are
   * received
   */
  componentWillReceiveProps (nextProps) {
    if (this.props !== nextProps) {
      this.getRepData({
        state: nextProps.state_value,
        party_id: nextProps.party_value,
        votes_pct: nextProps.vote_value,
        last_name: nextProps.lastname_value,
        order_by: nextProps.sort_value
      })
    }
  }

  /**
   * Renders the representative grid and along with pagination.
   * Renders RepresentativeInstance component for each rep in the data
   */
  render () {
    if (this.state.all_reps === null || this.state.party_name === null ||
      this.state.party_colors === null) {
      return (
        <div className='loading filter-grid-center'>
          <RingLoader color={'#123abc'} loading={true} />
        </div>
      )
    } else if (this.state.all_reps === -1 || this.state.party_name === -1) {
      return (
        <div className='filter-grid-root'>
          <p>Data Not Found</p>
        </div>
      )
    } else if (this.state.all_reps === -2) {
      return (
        <div className='filter-grid-root'>
          <h1>No representatives found, try a different filter.</h1>
        </div>
      )
    } else {
      // return grid, with mapping of representative data to
      //  RepresentativeInstances
      return (
        <div className='App'>
          <div className='rep-grid-container container'>
            <Row>
              {this.state.displayed_reps.map((item) => (
                <RepresentativeInstance
                  key={item.bioguide}
                  rep={item}
                  party_name={this.state.party_name[item.party_id][0]}
                  party_color={this.state.party_colors[item.party_id]} />
              ))}
            </Row>
          </div>
          <Row>
            <ReactPaginate previousLabel={"previous"}
              nextLabel={"next"}
              breakLabel={<a>...</a>}
              breakClassName={'break-me'}
              pageCount={Math.ceil(this.state.cur_page)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
            />
          </Row>
        </div>
      )
    }
  }
}
