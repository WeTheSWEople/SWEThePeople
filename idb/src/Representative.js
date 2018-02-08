import React, { Component } from 'react';
import header from './assets/header.png'
import './App.css';
import RepresentativeInstance from './RepresentativeInstance'
import allReps from './assets/all-reps-endpoint.json';

export default class Representative extends Component {
  constructor(props) {
    super(props);

    console.log(allReps)

    this.state = allReps

  }
  render() {
    return (
      <div className="App">
      <header className="App-header">
          <img src={header} className="App-logo" alt="logo" />
          <h1 className="App-title">Representative</h1>
      </header>
      <RepresentativeInstance rep = {this.state[0]} />
      <RepresentativeInstance rep = {this.state[1]} />
      <RepresentativeInstance rep = {this.state[2]} />
      </div>
    );
  }
}
