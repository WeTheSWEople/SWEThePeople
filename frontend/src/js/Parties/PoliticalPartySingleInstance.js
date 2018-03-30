/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
/* eslint-enable no-unused-vars */

import '../../assets/css/PoliticalPartyInstance.css'

export default class PoliticalPartySingleInstance extends Component {
  render() {
    let num_reps = 0
    if (this.props.num_reps) {
      num_reps = this.props.num_reps
    }

    return (
      <Link to={`/party/${this.props.party.path}`}>
        <div className='search-card party-search-card'>
          <img src={require('../../assets/images/parties/index/' +
            this.props.party.path + '.png')}
          className='img-responsive'
          alt={this.props.party.path} />
          
          <div>
            <h3>{this.props.party.name}</h3>
            <p>
              Representatives in search: {num_reps}
            </p>
            <p>
              Party chair:<br />{this.props.party.chair}
            </p>
          </div>
        </div>
      </Link>
    )
  }
}
