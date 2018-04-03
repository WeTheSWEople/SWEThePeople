/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {GridList} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'
import Select from 'react-select'
/* eslint-disable no-unused-vars */

import '../../assets/css/Filter.css'
import 'react-select/dist/react-select.css'

export default class PoliticalPartyFilter extends Component {
  constructor (props) {
    super(props)

    this.state = {
      social_value: null,
      color_value: null,
      formation_date_value: null,
      name_value: null,
      sort_value: null
    }

    this.handleSocialDropdownChange = this.handleSocialDropdownChange.bind(this)
    this.handleColorDropdownChange = this.handleColorDropdownChange.bind(this)
    this.handleFormationDateDropdownChange =
      this.handleFormationDateDropdownChange.bind(this)
    this.handleNameDropdownChange = this.handleNameDropdownChange.bind(this)
    this.handleSortDropdownChange = this.handleSortDropdownChange.bind(this)
    this.handleFilterClicked = this.handleFilterClicked.bind(this)
    this.handleResetClicked = this.handleResetClicked.bind(this)
  }

  handleSocialDropdownChange (selectedOption) {
    this.setState({social_value: selectedOption})
  }

  handleColorDropdownChange (selectedOption) {
    this.setState({color_value: selectedOption})
  }

  handleFormationDateDropdownChange (selectedOption) {
    this.setState({formation_date_value: selectedOption})
  }

  handleNameDropdownChange (selectedOption) {
    this.setState({name_value: selectedOption})
  }

  handleSortDropdownChange (selectedOption) {
    this.setState({sort_value: selectedOption})
  }

  handleFilterClicked (e) {
    let social = 'None'
    if (this.state.social_value !== null) {
      social = this.state.social_value.value
    }

    let color = 'None'
    if (this.state.color_value !== null) {
      color = this.state.color_value.value
    }

    let formationDate = 'None'
    if (this.state.formation_date_value !== null) {
      formationDate = this.state.formation_date_value
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

  handleResetClicked (e) {
    this.setState({
      social_value: null,
      color_value: null,
      formation_date_value: null,
      name_value: null,
      sort_value: null
    })

    this.props.buttonHandler('None', 'None', 'None', 'A-Z', 'None')
  }

  render () {
    return (
      <div style={{marginLeft: '6%', marginRight: '5%', width: '90%'}}>
        <div className='filter-component row'>
          <div className='col-sm-2 filter-control'>
            <b>Filter social media:</b>
            <Select name='party-social'
              value={this.state.social_value}
              onChange={this.handleSocialDropdownChange}
              options={[
                {value: 'YT', label: 'Both'},
                {value: 'T', label: 'Only Twitter'},
                {value: 'Y', label: 'Only YouTube'},
                {value: 'Neither', label: 'No Social Media'}]} />
          </div>

          <div className='col-sm-2 filter-control'>
            <b>Filter party color:</b>
            <Select name='party-color'
              value={this.state.color_value}
              onChange={this.handleColorDropdownChange}
              options={[
                {value: 'Black', label: 'Black'},
                {value: 'White', label: 'White'},
                {value: 'Gold', label: 'Gold'},
                {value: 'Orange', label: 'Orange'},
                {value: 'Purple', label: 'Purple'},
                {value: 'Red', label: 'Red'},
                {value: 'Blue', label: 'Blue'},
                {value: 'Green', label: 'Green'},
                {value: 'Gray', label: 'Gray'},
                {value: 'Azure', label: 'Azure'},
                {value: 'Yellow', label: 'Yellow'},
                {value: 'Teal', label: 'Teal'},
                {value: 'Buff', label: 'Buff'}]} />
          </div>

          <div className='col-sm-2 filter-control'>
            <b>Filter formation date:</b>
            <Select name='party-formation-date'
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
          </div>

          <div className='col-sm-2 filter-control'>
            <b>Filter party name:</b>
            <Select name='party-name'
              value={this.state.name_value}
              onChange={this.handleNameDropdownChange}
              options={[
                {value: 'A-L', label: 'A-L'},
                {value: 'M-Z', label: 'M-Z'}]} />
          </div>

          <div className='col-sm-2 filter-control'>
            <b>Sort:</b>
            <Select name='party-sort'
              value={this.state.sort_value}
              onChange={this.handleSortDropdownChange}
              options={[
                {value: 'name_asc', label: 'Party name (ASC)'},
                {value: 'name_desc', label: 'Party name (DESC)'},
                {value: 'chair_name_asc', label: 'Chair name (ASC)'},
                {value: 'chair_name_desc', label: 'Chair name (DESC)'}]} />
          </div>

          <div className='col-sm-2 button-control'>
            <button className="btn btn-primary"
              onClick={this.handleFilterClicked}>
              Filter
            </button>

            <button className="btn btn-danger reset-button"
              onClick={this.handleResetClicked}>
              Reset
            </button>
          </div>
        </div>
      </div>
    )
  }
}
