/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {GridList} from 'material-ui/GridList'
/* eslint-disable no-unused-vars */
import RepresentativeInstance from './RepresentativeInstance'
import '../../assets/css/App.css'

import allReps from '../../assets/all-reps-endpoint.json'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: '50px',
    paddingLeft: '50px',
    paddingRight: '50px',
    justifyContent: 'space-around'
  },
  gridList: {
    width: '100%',
    height: '100%',
    overflowY: 'auto'
  }
}

export default class Representatives extends Component {
  constructor (props) {
    super(props)

    this.state = allReps
  }
  render () {
    return (
      <div className='App'>
        <header className='App-header-white'></header>
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
    )
  }
}
