/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import StateInstance from './StateInstance'
import {GridList} from 'material-ui/GridList'
/* eslint-enable no-unused-vars */

import '../../assets/css/App.css'

const styles = {
  root: {
    paddingTop: '50px',
    paddingLeft: '50px',
    paddingRight: '50px',
    justifyContent: 'space-around'
  },
  gridList: {
    width: '80%',
    height: '100%',
    overflowY: 'auto'
  }
}

let stateJSON = require('../../assets/data/state.json')
export default class AllDistricts extends Component {
  render () {
    let allStates = Object.keys(stateJSON).map((key, index) =>
      <StateInstance full_state={stateJSON[key]} state={key} />
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
    )
  }
}
