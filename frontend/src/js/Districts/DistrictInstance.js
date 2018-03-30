/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Highlighter from "react-highlight-words";

/* eslint-enable no-unused-vars */
import '../../assets/css/District.css'


const styles = {
  highlight: {
    fontWeight: 'bold',
    backgroundColor: '#FFFF00'
  }
}

export default class DistrictInstance extends Component {



  render() {
    let query = []
    if(this.props.search !== null && this.props.search !== undefined) {
      query = this.props.search.split(" ")
      query.push(this.props.search)
    }
    const district = this.props.district
    return (
      <div className="district-instance">
        <div className='col-sm-3 district-grid'>
          <Link to={`/districts/${district.state}/${district.id}`}>
            <div className='district-card'>
              <h3><b>
              
                <Highlighter
                  searchWords={query}
                  autoEscape={true}
                  highlightStyle={styles.highlight}
                  textToHighlight={district.alpha_num}
                />
              </b></h3>

              <h5><b>Population: </b>{district.population}</h5>
              <h5><b>Median Age: </b>{district.median_age}</h5>
              
              <img src={require('../../assets/images/districts/' +
                district.alpha_num + '.png')}
              width='250px' height='150px' marginLeft='25px'
              className='img-response district-img' />
              <h5><i>
              <Highlighter
                  searchWords={query}
                  autoEscape={true}
                  highlightStyle={styles.highlight}
                  textToHighlight={district.state_full}
              />
             </i></h5>

            </div>
          </Link>
        </div>
      </div>
    )
  }
}
