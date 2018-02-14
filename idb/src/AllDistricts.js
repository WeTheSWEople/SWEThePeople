import React, { Component } from 'react';
import './App.css';
import {GridList} from 'material-ui/GridList';
import StateInstance from './StateInstance'

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

let state_json = require('./assets/data/state.json')
export default class AllDistricts extends Component {

  render() {
	  let allStates = Object.keys(state_json).map((key, index) =>
			  <StateInstance full_state={state_json[key]} state={key} />
		)
	return (
	  <div className="App">
	  <br />
	  <br />
	  <div style={styles.root}>
	  <GridList>
		  {allStates}
	  </GridList>
	  </div>
	  </div>
	);
  }
}
