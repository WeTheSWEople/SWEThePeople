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
 * Provides the select boxes for the user to filter the districts on the
 * district grid.
 */
class DistrictFilter extends Component {
  /**
   * Sets the default state and binds the handlers for the select boxes
   * @param props the props
   */
  constructor (props) {
    super(props)

    let stateArr = []
    Object.keys(this.props.states).forEach((key) =>
      stateArr.push({
        value: key,
        label: this.props.states[key]})
    )

    this.state = {
      state_value: null,
      population_value: null,
      median_age_value: null,
      sort_value: null,
      all_states: stateArr
    }

    this.handleStateDropdownChange = this.handleStateDropdownChange.bind(this)
    this.handlePopulationDropdownChange = this.handlePopulationDropdownChange
      .bind(this)
    this.handleMedianAgeDropdownChange = this.handleMedianAgeDropdownChange
      .bind(this)
    this.handleSortDropdownChange = this.handleSortDropdownChange.bind(this)
    this.handleFilterClicked = this.handleFilterClicked.bind(this)
    this.handleResetClicked = this.handleResetClicked.bind(this)
  }

  /**
   * Checks the cookies for any set filters and applies those filters.
   */
  componentDidMount () {
    let state = 'None'
    let population = 'None'
    let medianAge = 'None'
    let sort = 'state_asc'

    const {cookies} = this.props
    if (cookies.get('district_state_filter')) {
      this.handleStateDropdownChange(cookies.get('district_state_filter'))
      state = cookies.get('district_state_filter').value
    }
    if (cookies.get('district_population_filter')) {
      this.handlePopulationDropdownChange(
        cookies.get('district_population_filter'))
      population = cookies.get('district_population_filter').value
    }
    if (cookies.get('district_median_age_filter')) {
      this.handleMedianAgeDropdownChange(
        cookies.get('district_median_age_filter'))
      medianAge = cookies.get('district_median_age_filter').value
    }
    if (cookies.get('district_sort_filter')) {
      this.handleSortDropdownChange(cookies.get('district_sort_filter'))
      sort = cookies.get('district_sort_filter').value
    }

    this.props.buttonHandler(state, population, medianAge, sort)
  }

  /**
   * Handles when the state select changes to set the cookies and state for
   * the chosen filter.
   * @param selectedOption the value from the select box
   */
  handleStateDropdownChange (selectedOption) {
    const {cookies} = this.props
    cookies.set('district_state_filter', selectedOption)
    this.setState({state_value: selectedOption})
  }

  /**
   * Handles when the popluation select changes to set the cookies and state for
   * the chosen filter.
   * @param selectedOption the value from the select box
   */
  handlePopulationDropdownChange (selectedOption) {
    const {cookies} = this.props
    cookies.set('district_population_filter', selectedOption)
    this.setState({population_value: selectedOption})
  }

  /**
   * Handles when the median age select changes to set the cookies and state for
   * the chosen filter.
   * @param selectedOption the value from the select box
   */
  handleMedianAgeDropdownChange (selectedOption) {
    const {cookies} = this.props
    cookies.set('district_median_age_filter', selectedOption)
    this.setState({median_age_value: selectedOption})
  }

  /**
   * Handles when the sort by select changes to set the cookies and state for
   * the chosen filter.
   * @param selectedOption the value from the select box
   */
  handleSortDropdownChange (selectedOption) {
    const {cookies} = this.props
    cookies.set('district_sort_filter', selectedOption)
    this.setState({sort_value: selectedOption})
  }

  /**
   * Applies the chosen filters to the district grid.
   * @param e   the event
   */
  handleFilterClicked (e) {
    let state = 'None'
    if (this.state.state_value !== null) {
      state = this.state.state_value.value
    }

    let population = 'None'
    if (this.state.population_value !== null) {
      population = this.state.population_value.value
    }

    let medianAge = 'None'
    if (this.state.median_age_value !== null) {
      medianAge = this.state.median_age_value.value
    }

    let sort = 'state_asc'
    if (this.state.sort_value !== null) {
      sort = this.state.sort_value.value
    }

    this.props.buttonHandler(state, population, medianAge, sort)
  }

  /**
   * Resets the filters to their default values and clears any set cookies
   * @param e   the event
   */
  handleResetClicked (e) {
    this.handleStateDropdownChange(null)
    this.handlePopulationDropdownChange(null)
    this.handleMedianAgeDropdownChange(null)
    this.handleSortDropdownChange(null)
    this.props.buttonHandler('None', 'None', 'None', 'state_asc')
  }

  /**
   * Renders the filter card with the select boxes
   */
  render () {
    return (
      <div style={{marginLeft: '6%', marginRight: '5%', width: '90%'}}>
        <Row className='filter-component'>
          <Col sm={2} className='filter-control'>
            <b>Filter State:</b>
            <Select className='state-filter'
              name='district-state'
              value={this.state.state_value}
              onChange={this.handleStateDropdownChange}
              options={this.state.all_states}
            />
          </Col>

          <Col sm={2} className='filter-control'>
            <b>Filter Population:</b>
            <Select className='pop-filter'
              name='district-population'
              value={this.state.population_value}
              onChange={this.handlePopulationDropdownChange}
              options={[{value: '0-250000', label: '< 250,000'},
                {value: '250000-500000', label: '250,000 - 499,999'},
                {value: '500000-750000', label: '500,000 - 749,999'},
                {value: '750000-1000000', label: '750,000 - 999,999'},
                {value: '1000000-10000000', label: '>= 1,000,000'}]}
            />
          </Col>

          <Col sm={2} className='filter-control'>
            <b>Filter Median Age:</b>
            <Select className='age-filter'
              name='district-median-age'
              value={this.state.median_age_value}
              onChange={this.handleMedianAgeDropdownChange}
              options={[{value: '0-30', label: '<= 29'},
                {value: '30-40', label: '30 - 39'},
                {value: '40-50', label: '40 - 49'},
                {value: '50-60', label: '50 - 59'},
                {value: '60-100', label: '>= 60'}]}
            />
          </Col>

          <Col sm={2} className='filter-control'>
            <b>Sort:</b>
            <Select className='sort'
              name='district-sort'
              value={this.state.sort_value}
              onChange={this.handleSortDropdownChange}
              options={[{value: 'state_asc', label: 'State (ASC)'},
                {value: 'state_desc', label: 'State (DESC)'},
                {value: 'population_asc', label: 'Population (ASC)'},
                {value: 'population_desc', label: 'Population (DESC)'}]}
            />
          </Col>

          <Col sm={2} smOffset={2} className='button-control'>
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

export default withCookies(DistrictFilter)
