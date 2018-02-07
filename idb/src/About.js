import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var request = require("request");

export default class About extends Component {
	constructor(props){
		super(props)
		this.state = {
			ready: false,
			total_commits: 0,
			error: false,
			total_issues: 0,
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
			var commit_json = JSON.parse(body)
		  this.setState({total_commits: commit_json.length})
	  }.bind(this));

	}
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          ABOUT
        </p>
      </div>
    );
  }
}
