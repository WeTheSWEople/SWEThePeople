/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {RingLoader} from 'react-spinners'
import PoliticalPartySingleInstance from './PoliticalPartySingleInstance.js'
/* eslint-enable no-unused-vars */
import ReactPaginate from 'react-paginate'

import '../../assets/css/App.css'
import '../../assets/css/District.css'
import '../../assets/css/FilterGrid.css'
import axios from 'axios'
import url from '../../assets/resource.json'


// const URL = 'http://ec2-18-188-158-73.us-east-2.compute.amazonaws.com/' +
//   'party/filter?filter='

function clone(obj) {
	if (null == obj || "object" !== typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}

Array.prototype.subarray=function(start, end) {
 if(!end){
	 end = this.length;
 }
var newArray = clone(this);
return newArray.slice(start, end);
};

export default class PoliticalPartyGrid extends Component {
  constructor (props) {
	super(props)

	this.state = {
	  parties: null,
	  party_counts: null,
	  displayed_parties: null,
	  cur_page: -1
	}

	this.getPartyData = this.getPartyData.bind(this)
	this.handlePageClick = this.handlePageClick.bind(this)
  }
  handlePageClick(data){
	  this.setState({displayed_parties: this.state.parties.subarray(data.selected * 12, (data.selected + 1) * 12)})
  }

  getPartyData (filterParams) {
    this.setState({parties: null})
    axios.get(url.api_url + 'party/filter?filter=' + JSON.stringify(filterParams)).then((response) => {
      if (response.data.length === 0) {
        this.setState({parties: -2})
      } else {
        let counts = {}
        for (const party of response.data) {
          counts[party.id] = party.representatives.length
        }

		this.setState({parties: response.data, party_counts: counts, displayed_parties: response.data.subarray(0, 12), cur_page: response.data.length/12})
	  }
	}).catch((error) => {
	  this.setState({parties: -1, displayed_parties: -1})
	})
  }

  componentDidMount () {
	this.getPartyData({
	  social: 'None',
	  color: 'None',
	  date: 'None',
	  name: 'A-Z',
	  order_by: 'None'
	})
  }

  componentWillReceiveProps (nextProps) {
	if (this.props !== nextProps) {
	  this.getPartyData({
		social: nextProps.social_value,
		color: nextProps.color_value,
		date: nextProps.formation_date_value,
		name: nextProps.name_value,
		order_by: nextProps.sort_value
	  })
	}
  }

  render () {
	if (this.state.parties === null) {
	  return (
		<div className='filter-grid-center'>
		  <RingLoader color={'#123abc'} loading={true} />
		</div>
	  )
	} else if (this.state.parties === -1) {
	  return (
		<div className='filter-grid-root'>
		  <p>Data Not Found</p>
		</div>
	  )
	} else if (this.state.parties === -2) {
	  return (
		<div className='filter-grid-root'>
		  <h1>No political parties found, try a different filter.</h1>
		</div>
	  )
	} else {
	  let partiesGrid = this.state.displayed_parties.map((party) =>
		<div className='col-xs-6 col-sm-4 col-md-3'>
		  <PoliticalPartySingleInstance party={party}
			num_reps={this.state.party_counts[party.id]} />
		</div>
	  )

	  return (
		<div className='container'>
		  {partiesGrid}

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
