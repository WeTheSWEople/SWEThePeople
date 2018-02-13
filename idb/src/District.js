import React, { Component } from 'react';
import header from './assets/images/header.png'
import './App.css';
let state_json = require('./assets/data/state.json')
export default class Districts extends Component {
	constructor(props){
		super(props)
		this.state = {
			districts : 0,
			senator_count: 0,
			total_reps: 0,
		}

	}
	componentWillMount(){
		let rep_json = require('./assets/data/rep_data/' + this.props.match.params.districtid + '.json')
		let senator_json = require('./assets/data/senate_data/' + this.props.match.params.districtid + '.json')
		let reps = this.state.total_reps
		if(rep_json["status"] === "OK"){
			reps += rep_json["results"].length
			this.setState({districts: rep_json["results"].length, total_reps: reps})
		}
		if(senator_json["status"] === "OK"){
			reps += senator_json["results"].length
			this.setState({senator_count: senator_json["results"].length, total_reps: reps})
		}
	}
  render() {
	  let senators = null
	  let senator_obj = null
	  if(this.state.senator_count != 0){
		  senators = <h2>Senators:</h2>
	  }
	return (
	  <div className="App">
	  <br />
	  <br />
	  <h1>{state_json[this.props.match.params.districtid]}</h1>
	  <h2>Districts: {this.state.districts}</h2>
	  <h3>Total Representatives: {this.state.total_reps}</h3>
	  </div>
	);
  }
}
