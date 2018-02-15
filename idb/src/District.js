import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import header from './assets/images/header.png'
import './App.css';
import './District.css';

let state_json = require('./assets/data/state.json')
export default class Districts extends Component {
	constructor(props){
		super(props)
		this.state = {
			districts : 0,
			senator_count: 0,
			total_reps: 0,
			district_arr: [],
			state_data: []
		}

	}
	componentWillMount(){
		let rep_json = require('./assets/data/rep_data/' + this.props.match.params.districtid + '.json')
		let senator_json = require('./assets/data/senate_data/' + this.props.match.params.districtid + '.json')
		let reps = this.state.total_reps
		var districts_list = []
		if(rep_json["status"] === "OK"){
			reps += rep_json["results"].length
			for (var i = 0; i < rep_json.results.length; i++) {
				var result = rep_json.results[i]
				var party = "Democratic"
				var cssColor = "light-blue"
				if (result["party"] === "R") {
					party = "Republican"
					cssColor = "light-red"
				} else if (result["party"] === "L") {
					party = "Libertarian"
					cssColor = "light-yellow"
				}

				var name = "District " + result["district"]
				if (rep_json.results.length === 1) {
					name = result["district"] + " District"
				}

				districts_list.push({"district": result["district"],
									 "name": name,
									 "party": party,
									 "rep": result["name"],
									 "id": result["id"],
									 "cssColor": cssColor,
									 "rep_id": result["id"]})
				districts_list.sort(function(a, b) {
					return parseInt(a.district) - parseInt(b.district)
				})
			}
			this.setState({districts: rep_json["results"].length,
						   total_reps: reps,
						   districts_arr: districts_list})
		}
	}
  render() {
	let state_data = null
	if(this.state.senator_count == 2){
		state_data = <div><center><h3>{this.state.state_data[0]}</h3></center>
		<center><h4><a href ={this.state.state_data[1]}>
		{state_json[this.props.match.params.districtid]} Legislature Website</a></h4></center>
		<center><h5>Number of recent sessions: {this.state.state_data[2]}</h5></center>
		<center><h5>Recent Session name: {this.state.state_data[3]}</h5></center><br /></div>
	}

	let styles = {
		head: {
			paddingTop: "70px",
		},
		imgStyle: {
			width: "50%"
		}
	}

	let districts_grid = this.state.districts_arr.map(district =>
		<div className="col-sm-3 district-grid" key={district.district}>
			<Link to={`/districts/${this.props.match.params.districtid}/${district.district}`}>
				<div className={"district-card " + district.cssColor}>
					<h3>{district.name}</h3>
					<h4>{district.rep}</h4>
					<img src={"https://theunitedstates.io/images/congress/225x275/" + district.id + ".jpg"}  alt={district.name} class="rep_img" />
					<br /> <br />
					<h4>Party: {district.party}</h4>
				</div>
			</Link>
		</div>
	)

	return (
		<div className="container" style={styles.head}>
			<h1 className="district-header">
				{state_json[this.props.match.params.districtid]}
			</h1>
			{state_data}
			<div className="row">
				{districts_grid}
			</div>

		</div>
	);
  }
}
