/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {RingLoader} from 'react-spinners'
import ReactPaginate from 'react-paginate'
/* eslint-enable no-unused-vars */

import '../../assets/css/App.css'
import '../../assets/css/District.css'
import '../../assets/css/FilterGrid.css'
import axios from 'axios'
import url from '../../assets/resource.json'

/* Grid of District cards */
export default class DistrictGrid extends Component {
  constructor (props) {
    super(props)
    this.state = {
      districts: null,
      displayedDistricts: null,
      cur_page: -1
    }
    this.handlePageClick = this.handlePageClick.bind(this)
  }
  handlePageClick (data) {
    this.setState({displayedDistricts:
      this.state.districts.subarray(data.selected * 16,
        (data.selected + 1) * 16)
    })
  }

  getDistrictData (filterParams) {
    this.setState({districts: null})
    axios.get(url.api_url + 'district/filter?filter=' +
      JSON.stringify(filterParams)).then((response) => {
      if (response.data.length === 0) {
        this.setState({districts: -2, cur_page: -1, displayedDistricts: -2})
      } else {
        this.setState({districts: response.data,
          cur_page: response.data.length / 16,
          displayedDistricts: response.data.subarray(0, 16)})
      }
    }).catch((error) => {
      if (error) {
        this.setState({districts: -1})
      }
    })
  }

  componentDidMount () {
    this.getDistrictData({
      state: 'None',
      population: 'None',
      median_age: 'None',
      order_by: 'state_asc'
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props !== nextProps) {
      this.getDistrictData({
        state: nextProps.state_value,
        population: nextProps.population_value,
        median_age: nextProps.median_age_value,
        order_by: nextProps.sort_value
      })
    }
  }

  render () {
    if (this.state.districts === null) {
      return (
        <div className='filter-grid-center'>
          <RingLoader color={'#123abc'} loading={true} />
        </div>
      )
    } else if (this.state.districts === -1) {
      return (
        <div className='filter-grid-root'>
          <p>Data Not Found</p>
        </div>
      )
    } else if (this.state.districts === -2) {
      return (
        <div className='filter-grid-root'>
          <h1>No districts found, try a different filter.</h1>
        </div>
      )
    } else {
      let districtsGrid = this.state.displayedDistricts.map((district) =>
        <div className='col-sm-3 district-grid' key={district.alpha_num}>
          <Link to={`/districts/${district.state}/${district.id}`}>
            <div className='district-card'>
              <h3><b>{district.alpha_num}</b></h3>
              <h5><b>Population: </b>{district.population}</h5>
              <h5><b>Median Age: </b>{district.median_age}</h5>
              <img src={require('../../assets/images/districts/' +
                district.alpha_num + '.png')}
              width='250px' height='150px' marginLeft='25px'
              alt='District Map'
              className='img-responsive district-img'
              />
              <br></br>
            </div>
          </Link>
        </div>

      )

      return (
        <div className='container'>
          <div className='row' style={{paddingTop: '20px'}}>
            {districtsGrid}
          </div>
          <center>
            <ReactPaginate previousLabel={'previous'}
              nextLabel={'next'}
              breakLabel={<a>...</a>}
              breakClassName={'break-me'}
              pageCount={Math.ceil(this.state.cur_page)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'} />
          </center>
        </div>
      )
    }
  }
}
