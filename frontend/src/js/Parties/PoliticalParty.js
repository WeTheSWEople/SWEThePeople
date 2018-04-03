/* eslint-disable no-unused-vars */
import PoliticalPartyInstance from './PoliticalPartyInstance.js'
import React, {Component} from 'react'
import {RingLoader} from 'react-spinners'
/* eslint-enable no-unused-vars */
import ReactPaginate from 'react-paginate'
import '../../assets/css/App.css'

let request = require('request')

const styles = {
  center:{
	display: 'flex',
	flexWrap: 'wrap',
	paddingTop: '25%',
	paddingLeft: '50px',
	paddingRight: '50px',
	justifyContent: 'space-around'
  }
}


export default class PoliticalParty extends Component {
  constructor (props) {
	super(props)

	this.state = {
	  ready: false,
	  error: false,
	  parties: {},
	  displayed_parties: {},
	  cur_page: 1
	}
	this.handlePageClick = this.handlePageClick.bind(this)
  }
handlePageClick(data){
	console.log(this.state.parties)
	let new_map = {}
	new_map["0"] = this.state.parties[data.selected*3]
	new_map["1"] = this.state.parties[data.selected*3 + 1]
	new_map["2"] = this.state.parties[data.selected*3 + 2]
	console.log(new_map)
	this.setState({displayed_parties: new_map})

}

  componentWillMount () {
	this.setState({ready: false})

	let options = {method: 'GET', url: 'http://api.swethepeople.me/party/'}
	request(options, function (error, response, body) {
	  if (error) {
		this.setState({error: true, ready: true})
	  } else {
		let allParties = JSON.parse(body)
		let partiesMap = {}
		Object.keys(allParties).forEach(function (partyName) {
		  partiesMap[partyName] = {
			path: allParties[partyName]['path'],
			name: allParties[partyName]['name'],
			chair: allParties[partyName]['chair'],
			num_reps: allParties[partyName]['representatives'].length
		  }
		})
		let new_map = {}
		new_map["0"] = partiesMap[0]
		new_map["1"] = partiesMap[1]
		new_map["2"] = partiesMap[2]
		this.setState({parties: partiesMap, ready: true, cur_page: JSON.parse(body).length/3, displayed_parties: new_map})
	  }
	}.bind(this))
  }

  render () {
	let parties = null
	if (this.state.ready) {
	  let divStyle = {
		paddingTop: '70px'
	  }
	  parties = <PoliticalPartyInstance party_data = {this.state.displayed_parties} />

	  return (
		<div style={divStyle} className="parties-container">
		  {parties}
		  <center>
		  <ReactPaginate previousLabel={"previous"}
			  nextLabel={"next"}
			  breakLabel={<a>...</a>}
			  breakClassName={"break-me"}
			  pageCount={this.state.cur_page}
			  marginPagesDisplayed={2}
			  pageRangeDisplayed={5}
			  onPageChange={this.handlePageClick}
			  containerClassName={"pagination"}
			  subContainerClassName={"pages pagination"}
			  activeClassName={"active"} /></center>
		</div>
	  )
	}
	else {

	  return(
	  <div style={styles.center}>
	  <RingLoader color={'#123abc'} loading={true} />
	   </div>)

	}
  }
}
