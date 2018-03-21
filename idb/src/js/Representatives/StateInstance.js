/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {GridTile} from 'material-ui/GridList'
/* eslint-enable no-unused-vars */
import '../../assets/css/App.css'
import '../../assets/css/RepresentativeInstance.css'

const styles = {
  hyperlink: {
    textDecoration: 'none',
    color: 'black'
  },
  imgStyle: {
    width: '75%',
    marginTop: '15px',
    marginLeft: '15px'
  }
}

export default class StateInstance extends Component {
  constructor (props) {
    super(props)
    this.state = {
      numReps: 0,
      numSenators: 0
    }
  }
  componentWillMount () {
    let repJSON = require('../../assets/data/rep_data/' +
      this.props.state + '.json')
    let senatorJSON = require('../../assets/data/senate_data/' +
      this.props.state + '.json')
    if (repJSON['status'] === 'OK') {
      this.setState({numReps: repJSON['results'].length})
    }
    if (senatorJSON['status'] === 'OK') {
      this.setState({numSenators: senatorJSON['results'].length})
    }
  }
  render () {
    return (
      <Link to={`/districts/${this.props.state}`}
        style={styles.hyperlink}>
        <GridTile
          key={this.props.state}
          class='tile' >
          <div class='row'>
            <div class='col-md-4'>
              <img
                src={require('../../assets/images/states/' +
                this.props.state + '.png')}
                className='img-responsive'
                style={styles.imgStyle}
                alt='State'
              />
            </div>
            <div className='col-md-4 text-md-left'>
              <div className='rep_info'>
                <h3 className='title'>{this.props.full_state}</h3>
                <h4 className='party'>Districts: {this.state.numReps}</h4>
                <h4 className='district'>
                  <i>Senators: {this.state.numSenators}</i>
                </h4>
              </div>
            </div>
          </div>
        </GridTile>
      </Link>
    )
  }
}
