/* eslint-disable no-unused-vars */
import PoliticalPartyInstance from './PoliticalPartyInstance.js'
import React, {Component} from 'react'
import {RingLoader} from 'react-spinners'
/* eslint-enable no-unused-vars */

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
		value: "",
		parties: {},
		all_parties: {}
	  }
	  this.handleChange = this.handleChange.bind(this)
	}
	handleChange(event){
		this.setState({value: event.target.value})
		if (event.target.value.length == 0){
			this.setState({parties:this.state.all_parties})
		}
		else{
			let reduced_dict = {}
			let index = 0
			for (var item in this.state.all_parties){
				if (this.state.all_parties[item]["name"].toLowerCase().includes(event.target.value.toLowerCase())){
					reduced_dict[index] = this.state.all_parties[item]
					index++
				}
			}
			this.setState({parties: reduced_dict})
		}
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

		  this.setState({parties: partiesMap, all_parties: partiesMap, ready: true})
		}
	  }.bind(this))
	}

  render () {
	let parties = null
	if (this.state.ready) {
	  let divStyle = {
		paddingTop: '70px'
	  }
	  parties = <PoliticalPartyInstance party_data = {this.state.parties} />

	  return (
		<div style={divStyle} className="parties-container">
		<center><input type="text" value={this.state.value} onChange={this.handleChange} /></center>
		  {parties}
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
