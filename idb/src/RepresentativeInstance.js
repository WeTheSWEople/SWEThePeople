import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';



export default class RepresentativeInstance extends Component {
  constructor(props) {
    super(props);
    
  }
  render() {
    console.log("From Rep Instance: " + this.props.rep)
    return (
      <div className="App">
        <img src={"https://theunitedstates.io/images/congress/225x275/" + this.props.rep.bioguide + ".jpg"}  alt="" />
      </div>
    );
  }
}
