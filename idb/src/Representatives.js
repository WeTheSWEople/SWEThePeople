import React, { Component } from 'react';
import header from './assets/images/header.png'
import './App.css';
import RepresentativeInstance from './RepresentativeInstance'
import allReps from './assets/all-reps-endpoint.json';
import {GridList} from 'material-ui/GridList';



const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: '50px',
    paddingLeft: '50px',
    paddingRight: '50px',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '80%',
    height: '100%',
    overflowY: 'auto',
  },
};


export default class Representatives extends Component {
  constructor(props) {
    super(props);

    this.state = allReps

  }
  render() {
    return (
      <div className="App">
      <header className="App-header-white">
      </header>
      <div style={styles.root}>
      <GridList
        cellHeight={400}
        cols={4}
        style={styles.gridList} >
        {this.state.map((item) => (
            <RepresentativeInstance key={item.bioguide} rep = {item} />
        ))}
      </GridList>
      </div>
      </div>
    );
  }
}
