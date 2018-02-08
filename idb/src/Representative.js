import React, { Component } from 'react';
import header from './assets/header.png'
import './App.css';
import RepresentativeInstance from './RepresentativeInstance'
import allReps from './assets/all-reps-endpoint.json';
import { Link } from 'react-router-dom'


const styles = {
  hyperlink: {
    textDecoration: "none",
    color: "black"
  },
};


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

      {this.state.map((item) => (
          <Link 
            key={item.bioguide} 
            to={`/representative/${item.bioguide}`} 
            style={styles.hyperlink} >
            <RepresentativeInstance rep = {item} />
            
          </Link>
      ))}
      
      </div>
    );
  }
}
