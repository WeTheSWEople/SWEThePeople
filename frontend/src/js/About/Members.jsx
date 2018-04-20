/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
/* eslint-enable no-unused-vars */

import '../../assets/css/Members.css'
import '../../assets/css/About.css'

/*
 * Component that renders cards for each member and using data from About.
 */
export default class Members extends Component {
  render () {
    let mapping = Object.keys(this.props.swe_data).map((item) =>
      <Col sm={12} md={4}>
        <div className='member-card'>
          <h3>{this.props.swe_data[item][0]} <br /></h3>
          <p className='nickname'>
            {'\'' + this.props.swe_data[item][7] + '\''}
          </p>
          <img src={require('../../assets/images/about/' +
            this.props.swe_data[item][5])}
          width='280' height='280' alt='{this.props.swe_data[item][0]}'
          className='img-responsive' />

          <br />
          <p>{this.props.swe_data[item][6]}</p>
          <p>{this.props.swe_data[item][4]}</p>
          <p>
            Commits: {this.props.swe_data[item][1]}<br />
            Issues: {this.props.swe_data[item][2]}<br />
            Unit Tests: {this.props.swe_data[item][3]}<br />
          </p>
          <p>My home Congressional District is:
            <a href={'http://swethepeople.me/districts/' +
              this.props.swe_data[item][8] + '/' +
              this.props.swe_data[item][9]}>
              {this.props.swe_data[item][8] + ' - ' +
              this.props.swe_data[item][9]}</a></p>
        </div>
      </Col>
    )

    return (
        <div>
        <div className='about-header'>
          <h1>Your Representatives</h1>
        </div>
      <Grid>
        <Row>
          {mapping}
        </Row>
      </Grid>
      </div>
    )
  }
}
