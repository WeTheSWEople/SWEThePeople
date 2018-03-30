/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
/* eslint-enable no-unused-vars */

import '../../assets/css/RepresentativeInstance.css'

export default class RepresentativeSingleInstance extends Component {
  render() {
    return (
      <Link to={`/representatives/${this.props.rep.bioguide}`}>
        <div className='search-card'>
          <img src={'https://theunitedstates.io/images/congress/225x275/' +
            this.props.rep.bioguide + '.jpg'}
          className='rep_img'
          onError={(e) => {e.target.src=require(
            '../../assets/images/reps/default.png')}} />

          <div className='rep_info'>
            <h3 className='title'>
              {this.props.rep.firstname + ' ' + this.props.rep.lastname}
            </h3>
            <h4 className='party'>{this.props.party_name}</h4>
            <h4 className='district'>
              <i>{this.props.rep.state + ' - ' + this.props.rep.district}</i>
            </h4>
          </div>
        </div>
      </Link>
    )
  }
}
