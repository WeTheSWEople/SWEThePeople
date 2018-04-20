/* eslint-disable valid-jsdoc */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Highlighter from 'react-highlight-words'
/* eslint-enable no-unused-vars */

import '../../assets/css/District.css'

/**
* Creates a district instance card with search highlights
*/
export default class DistrictInstance extends Component {
  /**
  * Sets data for card, including search words and district data
  */
  render () {
    const styles = {
      highlight: {
        fontWeight: 'bold',
        backgroundColor: '#FFFF00'
      }
    }

    let query = []
    if (this.props.search !== null && this.props.search !== undefined) {
      query = this.props.search.split(' ')
      query.push(this.props.search)
    }

    const district = this.props.district

    /**
    * Creates card for districts with proper highlights
    */
    return (
      <Link to={`/districts/${district.state}/${district.id}`}>
        <div className='search-card district-search-card'>
          <div className='district-grid'>
            <img src={require('../../assets/images/districts/' +
              district.alpha_num + '.png')}
            alt={district.state + '-' + district.id}
            width='250px' height='150px' marginLeft='25px'
            className='img-response' />

            <div>
              <h3>
                <b>
                  <Highlighter
                    searchWords={query}
                    autoEscape={true}
                    highlightStyle={styles.highlight}
                    textToHighlight={district.alpha_num} />
                </b>
              </h3>
              <h5><b>Population: </b>{district.population}</h5>
              <h5><b>Median Age: </b>{district.median_age}</h5>
              <h5>
                <i>
                  <Highlighter
                    searchWords={query}
                    autoEscape={true}
                    highlightStyle={styles.highlight}
                    textToHighlight={district.state_full} />
                </i>
              </h5>
            </div>
          </div>
        </div>
      </Link>
    )
  }
}
