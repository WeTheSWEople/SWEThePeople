import React, { Component } from 'react';
import header from './assets/header.png'
import './App.css';
import RepresentativeInstance from './RepresentativeInstance'
import allReps from './assets/all-reps-endpoint.json';
import { Link } from 'react-router-dom'
import {GridList, GridTile} from 'material-ui/GridList';



const styles = {
  hyperlink: {
    textDecoration: "none",
    color: "black"
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: '50px',
    paddingLeft: '50px',
    paddingRight: '50px',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
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


      <div style={styles.root}>
      <GridList
        cellHeight={400}
        cols={5}
        style={styles.gridList}
      >
        {this.state.map((item) => (
            <RepresentativeInstance key={item.bioguide} rep = {item} />
        ))}
      </GridList>
      </div>
      </div>
    );
  }
}
