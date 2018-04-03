/* eslint-disable no-unused-vars */
import PoliticalPartyInstance from './PoliticalPartyInstance.js'
import React, {Component} from 'react'
import {RingLoader} from 'react-spinners'
import PoliticalPartyFilter from './PoliticalPartyFilter'
import PoliticalPartyGrid from './PoliticalPartyGrid'
/* eslint-enable no-unused-vars */

export default class PoliticalParties extends Component {
  constructor (props) {
    super(props)

    this.state = {
      social_value: null,
      color_value: null,
      formation_date_value: null,
      name_value: null,
      sort_value: null
    }

    this.handleFilterClicked = this.handleFilterClicked.bind(this)
  }

  handleFilterClicked (socialValue, colorValue, formationDateValue, nameValue,
    sortValue) {
    this.setState({
      social_value: socialValue,
      color_value: colorValue,
      formation_date_value: formationDateValue,
      name_value: nameValue,
      sort_value: sortValue
    })
  }

  render () {
    return (
      <div style={{paddingTop: '25px'}}>
        <PoliticalPartyFilter
          buttonHandler={this.handleFilterClicked} />
        <PoliticalPartyGrid
          social_value={this.state.social_value}
          color_value={this.state.color_value}
          formation_date_value={this.state.formation_date_value}
          name_value={this.state.name_value}
          sort_value={this.state.sort_value} />
      </div>
    )
  }
}
