/* eslint-disable no-unused-vars */
import {GridList} from 'material-ui/GridList'
import React, {Component} from 'react'
import {withCookies, Cookies} from 'react-cookie'
import Select from 'react-select'
import {RingLoader} from 'react-spinners'
import {Row, Col} from 'react-bootstrap'
/* eslint-disable no-unused-vars */

import '../../assets/css/Filter.css'
import 'react-select/dist/react-select.css'

class RepresentativeFilter extends Component {
  constructor (props) {
    super(props)

    let partyArr = []
    Object.keys(this.props.parties).forEach((partyID) =>
      partyArr.push({value: partyID, label: this.props.parties[partyID][0]})
    )

    let stateArr = []
    Object.keys(this.props.states).forEach((key) =>
      stateArr.push({
        value: key,
        label: this.props.states[key]})
    )

    this.state = {
      state_value: null,
      party_value: null,
      vote_value: null,
      lastname_value: null,
      sort_value: null,
      all_parties: partyArr,
      all_states: stateArr
    }

    this.handleStateDropdownChange = this.handleStateDropdownChange.bind(this)
    this.handlePartyDropdownChange = this.handlePartyDropdownChange.bind(this)
    this.handleVoteDropdownChange = this.handleVoteDropdownChange.bind(this)
    this.handleLastnameDropdownChange = this.handleLastnameDropdownChange.bind(
      this)
    this.handleSortDropdownChange = this.handleSortDropdownChange.bind(this)
    this.handleFilterClicked = this.handleFilterClicked.bind(this)
    this.handleResetClicked = this.handleResetClicked.bind(this)
  }

  componentDidMount () {
    let state = 'None'
    let party = 'None'
    let votes = 'None'
    let lastname = 'A-Z'
    let sort = 'last_asc'

    const {cookies} = this.props
    if (cookies.get('rep_state_filter')) {
      this.handleStateDropdownChange(cookies.get('rep_state_filter'))
      state = cookies.get('rep_state_filter').value
    }
    if (cookies.get('rep_party_filter')) {
      this.handlePartyDropdownChange(cookies.get('rep_party_filter'))
      party = cookies.get('rep_party_filter').value
    }
    if (cookies.get('rep_votes_filter')) {
      this.handleVoteDropdownChange(cookies.get('rep_votes_filter'))
      votes = cookies.get('rep_votes_filter').value
    }
    if (cookies.get('rep_lastname_filter')) {
      this.handleLastnameDropdownChange(cookies.get('rep_lastname_filter'))
      lastname = cookies.get('rep_lastname_filter').value
    }
    if (cookies.get('rep_sort_filter')) {
      this.handleSortDropdownChange(cookies.get('rep_sort_filter'))
      sort = cookies.get('rep_sort_filter').value
    }

    this.props.buttonHandler(state, party, votes, lastname, sort)
  }

  handleStateDropdownChange (selectedOption) {
    const {cookies} = this.props
    cookies.set('rep_state_filter', selectedOption)
    this.setState({state_value: selectedOption})
  }

  handlePartyDropdownChange (selectedOption) {
    const {cookies} = this.props
    cookies.set('rep_party_filter', selectedOption)
    this.setState({party_value: selectedOption})
  }

  handleVoteDropdownChange (selectedOption) {
    const {cookies} = this.props
    cookies.set('rep_votes_filter', selectedOption)
    this.setState({vote_value: selectedOption})
  }

  handleLastnameDropdownChange (selectedOption) {
    const {cookies} = this.props
    cookies.set('rep_lastname_filter', selectedOption)
    this.setState({lastname_value: selectedOption})
  }

  handleSortDropdownChange (selectedOption) {
    const {cookies} = this.props
    cookies.set('rep_sort_filter', selectedOption)
    this.setState({sort_value: selectedOption})
  }

  handleFilterClicked (e) {
    let state = 'None'
    if (this.state.state_value !== null) {
      state = this.state.state_value.value
    }

    let party = 'None'
    if (this.state.party_value !== null) {
      party = this.state.party_value.value
    }

    let votes = 'None'
    if (this.state.vote_value !== null) {
      votes = this.state.vote_value.value
    }

    let lastname = 'A-Z'
    if (this.state.lastname_value !== null) {
      lastname = this.state.lastname_value.value
    }

    let sort = 'last_asc'
    if (this.state.sort_value !== null) {
      sort = this.state.sort_value.value
    }

    this.props.buttonHandler(state, party, votes, lastname, sort)
  }

  handleResetClicked (e) {
    this.handleStateDropdownChange(null)
    this.handlePartyDropdownChange(null)
    this.handleVoteDropdownChange(null)
    this.handleLastnameDropdownChange(null)
    this.handleSortDropdownChange(null)
    this.props.buttonHandler('None', 'None', 'None', 'A-Z', 'last_asc')
  }

  render () {
    return (
      <div style={{marginLeft: '6%', marginRight: '5%', width: '90%'}}>
        <Row className='filter-component'>
          <Col sm={2} className='filter-control'>
            <b>Filter State:</b>
            <Select className='state-filter'
              name='rep-state'
              value={this.state.state_value}
              onChange={this.handleStateDropdownChange}
              options={this.state.all_states}
            />
          </Col>

          <Col sm={2} className='filter-control'>
            <b>Filter Party:</b>
            <Select className='party-filter'
              name='rep-party'
              value={this.state.party_value}
              onChange={this.handlePartyDropdownChange}
              options={this.state.all_parties}
            />
          </Col>

          <Col sm={2} className='filter-control'>
            <b>Filter Votes:</b>
            <Select className='vote-filter'
              name='rep-votes'
              value={this.state.vote_value}
              onChange={this.handleVoteDropdownChange}
              options={[{value: '0-69', label: '< 70%'},
                {value: '70-79', label: '70 - 79.99%'},
                {value: '80-89', label: '80 - 89.99%'},
                {value: '90-100', label: '90 - 100%'}]}
            />
          </Col>

          <Col sm={2} className='filter-control'>
            <b>Filter last names:</b>
            <Select className='lastname-filter'
              name='rep-lastname'
              value={this.state.lastname_value}
              onChange={this.handleLastnameDropdownChange}
              options={[{value: 'A-L', label: 'A-L'},
                {value: 'M-Z', label: 'M-Z'}]}
            />
          </Col>

          <Col sm={2} className='sort-control'>
            <b>Sort:</b>
            <Select className='sort'
              name='rep-lastname'
              value={this.state.sort_value}
              onChange={this.handleSortDropdownChange}
              options={[{value: 'last_asc', label: 'Last name (ASC)'},
                {value: 'last_desc', label: 'Last name (DESC)'},
                {value: 'votes_pct_asc', label: 'Votes with party (ASC)'},
                {value: 'votes_pct_desc', label: 'Votes with party (DESC)'}]}
            />
          </Col>

          <Col sm={2} className='button-control'>
            <button className="btn btn-primary"
              onClick={this.handleFilterClicked}>
              Filter
            </button>

            <button className="btn btn-danger reset-button"
              onClick={this.handleResetClicked}>
              Reset
            </button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default withCookies(RepresentativeFilter)
