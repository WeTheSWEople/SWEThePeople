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
  constructor (props) {
      super(props)
      this.state = {
          party_name : undefined,
      }
    }
  componentWillMount () {
    console.log(`http://api.swethepeople.me/party/${this.props.rep.party_id}?party_name=True`)
    axios.get(`http://api.swethepeople.me/party/${this.props.rep.party_id}?party_name=True`)
    .then((response)=>{
      console.log(response)
      this.setState({
        party_name:response.data
      })
    })
    .catch((error)=>{
      this.setState({
          party_name: -1
      })
    })
  }

  render () {
    if (this.state.party_name === undefined){
      return(
      <div style={styles.center}>
      <RingLoader color={'#123abc'} loading={true} />
       </div>)
    }
    else if (this.state.party_name === -1){
      return (
          <div style={styles.root}>
           <p> Data Not Found </p>
          </div>
      )
    }
    else{
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
              <h4 class='party'>{this.state.party_name}</h4>
              <h4 class='district'><i>
                {this.props.rep.state + ' - ' + this.props.rep.district}
              </i></h4>
            </div>
          </GridTile>
        </Link>
      )
    }
  }
}
