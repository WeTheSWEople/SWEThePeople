import React, { Component } from 'react';
import header from './assets/header.png'
import './App.css';

export default class RepresentativeDetails extends Component {
  constructor(props) {
    super(props);

  }
  render() {
    console.log("Hello")
    console.log(this.props.match.params.bioguideid)
    return (
      <div className="App">
      <header className="App-header">
          <img src={header} className="App-logo" alt="logo" />
          <h1 className="App-title">Representative DeTails</h1>
      </header>
      <p>{this.props.match.params.bioguideid}</p>
      
      </div>
    );
  }
}