/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {GridTile} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'
import axios from 'axios'
import {ProgressBar} from 'react-bootstrap'


/* eslint-enable no-unused-vars */
import '../../assets/css/App.css'
import '../../assets/css/RepresentativeInstance.css'

const styles = {
  hyperlink: {
    textDecoration: 'none',
    color: 'black'
  },
  progress: {
    paddingLeft: '10%',
    paddingRight: '10%'
  }
}

export default class RepresentativeInstance extends Component {
  render () {
      return (
        <Link
          to={`/representatives/${this.props.rep.bioguide}`}
          style={styles.hyperlink}>
          <div className='col-md-3 col-sm-4 col-xs-6'>
            <div className='tile'>
            <img
              src={'https://theunitedstates.io/images/congress/225x275/' +
              this.props.rep.bioguide + '.jpg'}
              alt={this.props.rep.firstName}
              className='rep_img'
              onError={(e)=>{e.target.src=require('../../assets/images/reps/default.png')}}
            />
            <div class='rep_info'>
              <h3 className='title'>
                {this.props.rep.firstname + ' ' + this.props.rep.lastname}
              </h3>
              <h4 className='party'>
                {this.props.party_name}
              </h4>
              <h4 className='district'><i>
                {this.props.rep.state + '-' + this.props.rep.district}
              </i></h4>
              <p>
                <b>Votes with Party (%): </b>
                <div style={styles.progress}>
                  <ProgressBar bsStyle='success'
                    now={this.props.rep.votes_with_party_pct}
                    label={`${this.props.rep.votes_with_party_pct}%`}
                  />
                </div>
              </p>
            </div>
            </div>
          </div>
        </Link>
      )
  }
}
