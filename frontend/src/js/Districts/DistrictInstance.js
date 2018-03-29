/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
/* eslint-enable no-unused-vars */

import '../../assets/css/District.css'

export default class DistrictInstance extends Component {
  render() {
    const district = this.props.district
    return (
      <div className="district-instance">
        <div className='col-sm-3 district-grid'>
          <Link to={`/districts/${district.state}/${district.id}`}>
            <div className='district-card'>
              <h3><b>{district.alpha_num}</b></h3>
              <img src={require('../../assets/images/districts/' +
                district.alpha_num + '.png')}
              width='250px' height='150px' marginLeft='25px'
              className='img-response district-img' />
            </div>
          </Link>
        </div>
      </div>
    )
  }
}
