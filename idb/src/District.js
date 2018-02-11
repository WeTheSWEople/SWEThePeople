import React, { Component } from 'react';
import header from './assets/images/header.png'
import './App.css';

export default class Districts extends Component {
	componentWillMount(){
		console.log(this.props.match.params.districtid)
	}
  render() {
	return (
	  <div className="App">
	  <header className="App-header">
		  <img src={header} className="App-logo" alt="logo" />
		  <h1 className="App-title">Representative Details</h1>
	  </header>
	  <p>{this.props.match.params.districtid}</p>
	  </div>
	);
  }
}
