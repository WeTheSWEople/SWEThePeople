/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
/* eslint-enable no-unused-vars */

import '../../assets/css/District.css'

export default class DistrictInstance extends Component {
  render() {
    const district = this.props.district
    return (
      <Link to={`/districts/${district.state}/${district.id}`}>
        <div className="search-card district-search-card">
          <div className='district-grid'>
            <img src={require('../../assets/images/districts/' +
              district.alpha_num + '.png')}
            width='250px' height='150px' marginLeft='25px'
            className='img-response' />

            <div>
              <h3><b>{district.alpha_num}</b></h3>
              <h5><b>Population: </b>{district.population}</h5>
              <h5><b>Median Age: </b>{district.median_age}</h5>
            </div>
          </div>
        </div>
      </Link>
    )
  }
}
