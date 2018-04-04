/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {GridList} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'
/* eslint-disable no-unused-vars */
import ReactPaginate from 'react-paginate'

import RepresentativeInstance from './RepresentativeInstance'
import '../../assets/css/App.css'
import '../../assets/css/FilterGrid.css'
import axios from 'axios'
import url from '../../assets/resource.json'

// const URL = 'http://ec2-18-188-158-73.us-east-2.compute.amazonaws.com/' +
//   'representative/filter?filter='

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

export default class RepresentativeGrid extends Component {
  constructor (props) {
	super(props)
	this.state = {
	  all_reps: null,
	  party_name: null,
	  displayed_reps: null,
	  cur_page: 0
	}

	this.getRepData = this.getRepData.bind(this)
	this.handlePageClick = this.handlePageClick.bind(this)
	this.getRepData({
	  state: this.props.state_value,
	  party_id: this.props.party_value,
	  votes_pct: this.props.vote_value,
	  last_name: this.props.lastname_value,
	  order_by: this.props.sort_value
	})
  }

  handlePageClick(data){
		this.setState({displayed_reps: this.state.all_reps.subarray(data.selected*25, (data.selected+1)*25)})
	}


  getRepData (filterParams) {
	this.setState({all_reps: null})
	axios.get(url.api_url + 'representative/filter?filter=' + JSON.stringify(filterParams)).then((response) => {
	  if (response.data.length === 0) {
		this.setState({all_reps: -2, displayed_reps: -2})
	  } else {
		this.setState({all_reps: response.data, displayed_reps: response.data.slice(0,25), cur_page: response.data.length/25,})
	  }
	  // get the party names
	  return axios.get(url.api_url + `party?party_name=True`)
	}).then((response) => {
	  this.setState({party_name: response.data})
	}).catch((error) => {
	  this.setState({
		all_reps: -1,
		party_name: -1
	  })
	})
  }

  componentDidMount () {
	this.getRepData({
	  state: 'None',
	  party_id: 'None',
	  last_name: 'A-Z',
	  votes_pct: 'None',
	  order_by: 'last_asc'
	})
  }

  componentWillReceiveProps (nextProps) {
	if (this.props !== nextProps) {
	  this.getRepData({
		state: nextProps.state_value,
		party_id: nextProps.party_value,
		votes_pct: nextProps.vote_value,
		last_name: nextProps.lastname_value,
		order_by: nextProps.sort_value
	  })
	}
  }

  render () {
	if (this.state.all_reps === null || this.state.party_name === null) {
	  return (
		<div className='loading filter-grid-center'>
		  <RingLoader color={'#123abc'} loading={true} />
		</div>
	  )
	} else if (this.state.all_reps === -1 || this.state.party_name === -1) {
	  return (
		<div className='filter-grid-root'>
		  <p>Data Not Found</p>
		</div>
	  )
	} else if (this.state.all_reps === -2) {
	  return (
		<div className='filter-grid-root'>
		  <h1>No representatives found, try a different filter.</h1>
		</div>
	  )
	} else {
	  return (
		<div className='App'>
		  <div className='grid-container filter-grid-root'>
			<GridList
			  cellHeight={400}
			  cols={5}
			  className='gridlist-container filter-grid-list'
			>
			  {this.state.displayed_reps.map((item) => (
				<RepresentativeInstance
				  key={item.bioguide}
				  rep={item}
				  party_name={this.state.party_name[item.party_id][0]} />
			  ))}
			</GridList>
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
				activeClassName={"active"} />
		  </div>
		</div>
	  )
	}
  }
}
