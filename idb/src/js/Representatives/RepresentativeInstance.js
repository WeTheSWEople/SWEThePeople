/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {GridTile} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'
import axios from 'axios'

/* eslint-enable no-unused-vars */
import '../../assets/css/App.css'
import '../../assets/css/RepresentativeInstance.css'

const styles = {
  hyperlink: {
    textDecoration: 'none',
    color: 'black'
  }
}

export default class RepresentativeInstance extends Component {
  render () {
      return (
        <Link
          to={`/representatives/${this.props.rep.bioguide}`}
          style={styles.hyperlink}>
          <GridTile
            key={this.props.rep.bioguide}
            class='tile' >
            <img
              src={'https://theunitedstates.io/images/congress/225x275/' +
              this.props.rep.bioguide + '.jpg'}
              alt={this.props.rep.firstName} class='rep_img' onError={(e)=>{e.target.src=require('../../assets/images/reps/default.png')}}
            />
            <div class='rep_info'>
              <h3 class='title'>
                {this.props.rep.firstname +
                ' ' + this.props.rep.lastname}
              </h3>
              <h4 class='party'>{this.props.party_name}</h4>
              <h4 class='district'><i>
                {this.props.rep.state + ' - ' + this.props.rep.district}
              </i></h4>
            </div>
          </GridTile>
        </Link>
      )
  }
}
