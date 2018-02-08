import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { RingLoader } from 'react-spinners';
import Members from './Members'


var request = require("request");

export default class About extends Component {
	constructor(props){
		super(props)
		this.state = {
			ready: false,
			total_commits: 0,
			error: false,
			total_issues: 0,
			swe_member_data: {}
		}
	}
	componentWillMount(){
		this.setState({ready: false})

		var options = { method: 'GET',
		url: 'https://api.github.com/repos/WeTheSWEople/SWEThePeople/commits'}
		request(options, function (error, response, body) {
			if(error){
				this.setState({error: true, ready: true})
			}
			var swe_members = {}
			swe_members['MTirtowidjojo'] = ['Michael Tirtowidjojo', 0,0, 0]
			swe_members['copperstick6'] = ["William Han",0,0, 0]
			swe_members['raulcodes'] = ['Raul Camacho', 0,0, 0]
			swe_members['minwoo0jo'] = ['Minwoo Jo', 0,0, 0]
			swe_members['bzsinger'] = ['Benjamin Singer', 0,0, 0]
			swe_members['palakhirpara'] = ['Palakkumar Hirpara', 0, 0, 0]
			var commit_json = JSON.parse(body)
			for(var i = 0; i < commit_json.length; i++){
				swe_members[String(commit_json[i]["author"]["login"])][1] += 1

			}
			this.setState({total_commits: commit_json.length})
			var options = { method: 'GET',
			  url: 'https://api.github.com/repos/WeTheSWEople/SWEThePeople/issues?state=all',
			  qs: { state: 'all' },
			  };

			request(options, function (error, response, body) {
			  if(error){
				  this.setState({error: true, ready: true})
			  }
			 var issue_json = JSON.parse(body)
			 for(var i = 0; i < issue_json.length; i++){
				 var current_author = issue_json[i]["user"]["login"]
				 swe_members[String(issue_json[i]["user"]["login"])][2] += 1
			 }
			 console.log(swe_members)
			 this.setState({swe_member_data: swe_members, total_issues: issue_json.length, ready: true})
		  }.bind(this));

	  }.bind(this));

	}
  render() {
	  let calls_ready = null
	  let members = null
	  if(this.state.ready){
		  calls_ready = <h4>Total Commits: {this.state.total_commits} <br />Total Issues: {this.state.total_issues} <br />Total Unit tests: 0</h4>
		  members = <Members swe_data = {this.state.swe_member_data} />
	  }

	return (
	  <div className="App">
	  <h2>We the Sweople Present: </h2>
	  <h3>SWEThePeople.me</h3>
	  <h4>Swethepeople is a website devoted to people who love the government. We provide information about local government officials, the location in which they represent, and the parties they represent.</h4>
	  <h4>Within our website, you will also find a visualization of census data with the location of certain government districts.</h4>
		<center><RingLoader
		  color={'#123abc'}
		  loading={!this.state.ready}
		/></center>
		{calls_ready}
		{members}
	  </div>
	);
  }
}
