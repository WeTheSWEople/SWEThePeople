/* eslint-disable valid-jsdoc */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {RingLoader} from 'react-spinners'
import {Row, Col} from 'react-bootstrap'
import PoliticalPartySingleInstance from './PoliticalPartySingleInstance.js'
import ReactPaginate from 'react-paginate'
/* eslint-enable no-unused-vars */

import '../../assets/css/App.css'
import '../../assets/css/District.css'
import '../../assets/css/FilterGrid.css'
import axios from 'axios'
import url from '../../assets/resource.json'

function clone (obj) {
  if (obj == null || typeof obj !== 'object') return obj
  let copy = obj.constructor()
  for (let attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
  }
  return copy
}

Array.prototype.subarray = function (start, end) {
  if (!end) {
    end = this.length
  }
  let newArray = clone(this)
  return newArray.slice(start, end)
}

/**
 * The grid that displays all political party instances as they have been
 * filtered and sorted by the user.
 */
export default class PoliticalPartyGrid extends Component {
  /**
   * Sets the default state and binds functions to this
   */
  constructor (props) {
    super(props)

    this.state = {
      parties: null,
      party_counts: null,
      displayed_parties: null,
      cur_page: -1
    }

    this.getPartyData = this.getPartyData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  /**
   * Handles when a page is selected from the pagination to update the displayed
   * parties to be the ones for the selected page.
   * @param data  contains the selected page number
   */
  handlePageClick (data) {
    this.setState({
      displayed_parties: this.state.parties.subarray(data.selected * 12,
        (data.selected + 1) * 12)
    })
  }

  /**
   * Handles getting the party data from the API using the filters received from
   * the parent component. Sets the state with the updated parties and
   * pagination values or sets to -1 if encounters an error while requesting
   * data from the API.
   * @param filterParams  the dictionary of filters to send to the API
   */
  getPartyData (filterParams) {
    this.setState({parties: null})
    axios.get(url.api_url + 'party/filter?filter=' +
        JSON.stringify(filterParams)).then((response) => {
      if (response.data.length === 0) {
        this.setState({parties: -2})
      } else {
        let counts = {}
        for (const party of response.data) {
          counts[party.id] = party.representatives.length
        }

        this.setState({
          parties: response.data,
          party_counts: counts,
          displayed_parties: response.data.subarray(0, 12),
          cur_page: response.data.length / 12
        })
      }
    }).catch((error) => {
      this.setState({parties: -1, displayed_parties: -1})
    })
  }

  /**
   * Calls getPartyData() to update the political parties being displayed if
   * this component receives new props that are not the same as the current
   * props
   * @param nextProps   the new props to be received
   */
  componentWillReceiveProps (nextProps) {
    if (this.props !== nextProps) {
      this.getPartyData({
        social: nextProps.social_value,
        color: nextProps.color_value,
        date: nextProps.formation_date_value,
        name: nextProps.name_value,
        order_by: nextProps.sort_value
      })
    }
  }

  /**
   * Renders either the grid of political party cards or error messages if no
   * political parties were found or there was an error while getting data.
   */
  render () {
    if (this.state.parties === null) {
      return (
        <div className='filter-grid-center'>
          <RingLoader color={'#123abc'} loading={true} />
        </div>
      )
    } else if (this.state.parties === -1) {
      return (
        <div className='filter-grid-root'>
          <p>Data Not Found</p>
        </div>
      )
    } else if (this.state.parties === -2) {
      return (
        <div className='filter-grid-root'>
          <h1>No political parties found, try a different filter.</h1>
        </div>
      )
    } else {
      let partiesGrid = this.state.displayed_parties.map((party) =>
        <Col xs={6} sm={4} md={3}>
          <PoliticalPartySingleInstance party={party}
            num_reps={this.state.party_counts[party.id]} />
        </Col>
      )

      return (
        <div className='container'>
          {partiesGrid}

          <center>
            <Col md={12}>
              <ReactPaginate previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={<a>...</a>}
                breakClassName={'break-me'}
                pageCount={Math.ceil(this.state.cur_page)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'} />
            </Col>
          </center>
        </div>
      )
    }
  }
}
