/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {RingLoader} from 'react-spinners'
import {Row, Col} from 'react-bootstrap'
/* eslint-enable no-unused-vars */
import ReactPaginate from 'react-paginate'

import '../../assets/css/App.css'
import '../../assets/css/District.css'
import '../../assets/css/FilterGrid.css'
import axios from 'axios'
import url from '../../assets/resource.json'

function clone(obj) {
	if (null == obj || "object" !== typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}

// eslint-disable-next-line
Array.prototype.subarray=function(start, end) {
 if(!end){
	 end = this.length;
 }
var newArray = clone(this);
return newArray.slice(start, end);
};

export default class DistrictGrid extends Component {
  constructor (props) {
	super(props)
	this.state = {
	  districts: null,
	  displayed_districts: null,
	  cur_page: -1
	}
	this.handlePageClick = this.handlePageClick.bind(this)
  }

  handlePageClick(data){
	  this.setState({displayed_districts: this.state.districts.subarray(data.selected*16, (data.selected + 1)* 16)})
  }

  getDistrictData (filterParams) {
    this.setState({districts: null})
    axios.get(url.api_url + 'district/filter?filter=' + JSON.stringify(filterParams)).then((response) => {
      if (response.data.length === 0) {
        this.setState({districts: -2, cur_page: -1, displayed_districts: -2})
      } else {
        this.setState({districts: response.data, cur_page: response.data.length/16, displayed_districts: response.data.subarray(0, 16)})
      }
    }).catch((error) => {
      this.setState({districts: -1})
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
		let districtsGrid = this.state.displayed_districts.map((district) =>
			<Col sm={3} className='district-grid' key={district.alpha_num}>
				<Link to={`/districts/${district.state}/${district.id}`}>
				<div className='district-card'>
					<img src={require('../../assets/images/districts/' +
						district.alpha_num + '.png')}
						width='250px' height='150px' marginLeft='25px' alt='District Map'
						className='img-responsive district-img'
						/>
					<h3><b>{district.alpha_num}</b></h3>
					<h5><b>Population: </b>{district.population}</h5>
					<h5><b>Median Age: </b>{district.median_age}</h5>
					<br></br>
				</div>
				</Link>
			</Col>
	  )

	  return (
		<div className='container'>
		  <Row style={{paddingTop: '20px'}}>
			{districtsGrid}
		  </Row>
		  <center>
		  <ReactPaginate previousLabel={"previous"}
			  nextLabel={"next"}
			  breakLabel={<a>...</a>}
			  breakClassName={"break-me"}
			  pageCount={Math.ceil(this.state.cur_page)}
			  marginPagesDisplayed={2}
			  pageRangeDisplayed={5}
			  onPageChange={this.handlePageClick}
			  containerClassName={"pagination"}
			  subContainerClassName={"pages pagination"}
			  activeClassName={"active"} /></center>
		</div>
	  )
	}
  }
}
