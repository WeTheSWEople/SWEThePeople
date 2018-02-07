import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import RepresentativeInstance from './RepresentativeInstance'


export default class Representative extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rep1: {
            bioguide : "R000570",
            name: "Paul Ryan"
      },
      rep2: {
            bioguide : "R000570",
            name: "Paul Ryan"
      },
      rep3: {
            bioguide : "R000570",
            name: "Paul Ryan"
      }
    }
    
  }
  render() {
    return (
      <div className="App">
      <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Representative</h1>
      </header>
      <RepresentativeInstance rep = {this.state.rep1} />
      <RepresentativeInstance rep = {this.state.rep2} />
      <RepresentativeInstance rep = {this.state.rep3} />
      </div>
    );
  }
}


