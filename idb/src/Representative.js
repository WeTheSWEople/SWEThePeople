import React, { Component } from 'react';
import header from './assets/header.png'
import './App.css';
import RepresentativeInstance from './RepresentativeInstance'
import allReps from './assets/all-reps-endpoint.json';
import { Link } from 'react-router-dom'


export default class Representative extends Component {
  constructor(props) {
    super(props);

    console.log(allReps)

    this.state = null
    this.state = allReps

  }
  render() {
    return (
      <div className="App">
      <header className="App-header">
          <img src={header} className="App-logo" alt="logo" />
          <h1 className="App-title">Representative</h1>
      </header>
      <Link to={`/representative/${this.state[0].bioguide}`} >
      <RepresentativeInstance rep = {this.state[0]} />
      </Link>

       <Link to={`/representative/${this.state[1].bioguide}`} >
      <RepresentativeInstance rep = {this.state[1]} />
      </Link>

       <Link to={`/representative/${this.state[2].bioguide}`} >
      <RepresentativeInstance rep = {this.state[2]} />
      </Link>

      </div>
    );
  }
}
