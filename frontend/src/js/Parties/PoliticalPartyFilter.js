/* eslint-disable valid-jsdoc */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {GridList} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'
import Select from 'react-select'
import {Row, Col} from 'react-bootstrap'
import {withCookies, Cookies} from 'react-cookie'
/* eslint-disable no-unused-vars */

import '../../assets/css/Filter.css'
import 'react-select/dist/react-select.css'

/**
 * Provides the options for the user to filter political parties and handles
 * setting cookies and updating the grid when the user chooses options.
 */
class PoliticalPartyFilter extends Component {
  /**
   * Set the default state and binds the handlers to this
   * @param props   the props
   */
  constructor (props) {
    super(props)

    this.state = {
      social_value: null,
      color_value: null,
      formation_date_value: null,
      name_value: null,
      sort_value: null
    }

    this.handleSocialDropdownChange =
      this.handleSocialDropdownChange.bind(this)
    this.handleColorDropdownChange = this.handleColorDropdownChange.bind(this)
    this.handleFormationDateDropdownChange =
      this.handleFormationDateDropdownChange.bind(this)
    this.handleNameDropdownChange = this.handleNameDropdownChange.bind(this)
    this.handleSortDropdownChange = this.handleSortDropdownChange.bind(this)
    this.handleFilterClicked = this.handleFilterClicked.bind(this)
    this.handleResetClicked = this.handleResetClicked.bind(this)
  }

  /**
   * When the filter mounts, check the cookies for any set filter and apply any
   * filter that are found.
   */
  componentDidMount () {
    let social = 'None'
    let color = 'None'
    let formationDate = '1776-3000'
    let name = 'A-Z'
    let sort = 'None'

    const {cookies} = this.props
    if (cookies.get('party_social_media_filter') !== 'null') {
      this.handleSocialDropdownChange(cookies.get('party_social_media_filter'))
      social = cookies.get('party_social_media_filter').value
    }
    if (cookies.get('party_color_filter') !== 'null') {
      this.handleColorDropdownChange(cookies.get('party_color_filter'))
      color = cookies.get('party_color_filter').value
    }
    if (cookies.get('party_formation_date_filter') !== 'null') {
      this.handleFormationDateDropdownChange(
        cookies.get('party_formation_date_filter'))
      formationDate = cookies.get('party_formation_date_filter').value
      console.log(cookies.get('party_formation_date_filter'))
    }
    if (cookies.get('party_name_filter') !== 'null') {
      this.handleNameDropdownChange(cookies.get('party_name_filter'))
      name = cookies.get('party_name_filter').value
    }
    if (cookies.get('party_sort_filter') !== 'null') {
      this.handleSortDropdownChange(cookies.get('party_sort_filter'))
      sort = cookies.get('party_sort_filter').value
    }

    this.props.buttonHandler(social, color, formationDate, name, sort)
  }

  /**
   * Handles when the user selects a value from the social media filter
   * dropdown. Sets the state and a cookie with the value.
   * @param selectedOption  the selected option from the select box
   */
  handleSocialDropdownChange (selectedOption) {
    const {cookies} = this.props
    cookies.set('party_social_media_filter', selectedOption)
    this.setState({social_value: selectedOption})
  }

  /**
   * Handles when the user selects a value from the color filter dropdown. Sets
   * the state and a cookie with the value.
   * @param selectedOption  the selected option from the select box
   */
  handleColorDropdownChange (selectedOption) {
    const {cookies} = this.props
    cookies.set('party_color_filter', selectedOption)
    this.setState({color_value: selectedOption})
  }

  /**
   * Handles when the user selects a value from the formation date filter
   * dropdown. Sets the state and a cookie with the value.
   * @param selectedOption  the selected option from the select box
   */
  handleFormationDateDropdownChange (selectedOption) {
    const {cookies} = this.props
    cookies.set('party_formation_date_filter', selectedOption)
    this.setState({formation_date_value: selectedOption})
  }

  /**
   * Handles when the user selects a value from the party name filter dropdown
   * Sets the state and a cookie with the value.
   * @param selectedOption  the selected option from the select box
   */
  handleNameDropdownChange (selectedOption) {
    const {cookies} = this.props
    cookies.set('party_name_filter', selectedOption)
    this.setState({name_value: selectedOption})
  }

  /**
   * Handles when the user selects a value from the sort by dropdown. Sets the
   * state and a cookie with the value.
   * @param selectedOption  the selected option from the select box
   */
  handleSortDropdownChange (selectedOption) {
    const {cookies} = this.props
    cookies.set('party_sort_filter', selectedOption)
    this.setState({sort_value: selectedOption})
  }

  /**
   * Handles when the filter button is clicked to apply the choosen filters and
   * update the grid component.
   * @param e   the event
   */
  handleFilterClicked (e) {
    let social = 'None'
    if (this.state.social_value !== null) {
      social = this.state.social_value.value
    }

    let color = 'None'
    if (this.state.color_value !== null) {
      color = this.state.color_value.value
    }

    let formationDate = '1776-3000'
    if (this.state.formation_date_value !== null) {
      formationDate = this.state.formation_date_value.value
    }

    let name = 'A-Z'
    if (this.state.name_value !== null) {
      name = this.state.name_value.value
    }

    let sort = 'None'
    if (this.state.sort_value !== null) {
      sort = this.state.sort_value.value
    }

    this.props.buttonHandler(social, color, formationDate, name, sort)
  }

  /**
   * Handles when the reset button is clicked to set all select boxes to their
   * default value and have the grid render all political parties
   * @param e   the event
   */
  handleResetClicked (e) {
    this.handleSocialDropdownChange(null)
    this.handleColorDropdownChange(null)
    this.handleFormationDateDropdownChange(null)
    this.handleNameDropdownChange(null)
    this.handleSortDropdownChange(null)

    this.props.buttonHandler('None', 'None', '1776-3000', 'A-Z', 'None')
  }

  /**
   * Renders the filter card with select boxes for the user to choose filters
   * from.
   */
  render () {
    return (
      <div style={{marginLeft: '6%', marginRight: '5%', width: '90%'}}>
        <Row className='filter-component'>
          <Col sm={2} className='filter-control'>
            <b>Filter social media:</b>
            <Select className='social-filter'
              name='party-social'
              value={this.state.social_value}
              onChange={this.handleSocialDropdownChange}
              options={[
                {value: 'YT', label: 'Has Both'},
                {value: 'T', label: 'Has Twitter'},
                {value: 'Y', label: 'Has YouTube'},
                {value: 'Neither', label: 'No Social Media'}]} />
          </Col>

          <Col sm={2} className='filter-control'>
            <b>Filter party color:</b>
            <Select className='color-filter'
              name='party-color'
              value={this.state.color_value}
              onChange={this.handleColorDropdownChange}
              options={[
                {value: 'Azure', label: 'Azure'},
                {value: 'Black', label: 'Black'},
                {value: 'Blue', label: 'Blue'},
                {value: 'Buff', label: 'Buff'},
                {value: 'Gold', label: 'Gold'},
                {value: 'Gray', label: 'Gray'},
                {value: 'Green', label: 'Green'},
                {value: 'Orange', label: 'Orange'},
                {value: 'Purple', label: 'Purple'},
                {value: 'Red', label: 'Red'},
                {value: 'Teal', label: 'Teal'},
                {value: 'White', label: 'White'},
                {value: 'Yellow', label: 'Yellow'}]} />
          </Col>

          <Col sm={2} className='filter-control'>
            <b>Filter formation date:</b>
            <Select className='formation-filter'
              name='party-formation-date'
              value={this.state.formation_date_value}
              onChange={this.handleFormationDateDropdownChange}
              options={[
                {value: '1776-1800', label: '1776 - 1800'},
                {value: '1800-1850', label: '1800 - 1850'},
                {value: '1850-1900', label: '1850 - 1900'},
                {value: '1900-1950', label: '1900 - 1950'},
                {value: '1950-2000', label: '1950 - 2000'},
                // TODO: if aliens have not destroyed the earth by 3000 this
                // will have to be fixed
                {value: '2000-3000', label: '2000 - Present'}]} />
          </Col>

          <Col sm={2} className='filter-control'>
            <b>Filter party name:</b>
            <Select className='name-filter'
              name='party-name'
              value={this.state.name_value}
              onChange={this.handleNameDropdownChange}
              options={[
                {value: 'A-L', label: 'A-L'},
                {value: 'M-Z', label: 'M-Z'}]} />
          </Col>

          <Col sm={2} className='filter-control'>
            <b>Sort:</b>
            <Select className='sort'
              name='party-sort'
              value={this.state.sort_value}
              onChange={this.handleSortDropdownChange}
              options={[
                {value: 'name_asc', label: 'Party name (ASC)'},
                {value: 'name_desc', label: 'Party name (DESC)'},
                {value: 'chair_name_asc', label: 'Chair name (ASC)'},
                {value: 'chair_name_desc', label: 'Chair name (DESC)'}]} />
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

export default withCookies(PoliticalPartyFilter)
