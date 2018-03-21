/* eslint-disable no-unused-vars */
import PoliticalPartyInstance from './PoliticalPartyInstance.js'
import React, {Component} from 'react'
import {RingLoader} from 'react-spinners'
/* eslint-enable no-unused-vars */

import '../../assets/css/App.css'

let request = require('request')

const styles = {
  center:{
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: '25%',
    paddingLeft: '50px',
    paddingRight: '50px',
    justifyContent: 'space-around'
  }
}
export default class PoliticalParty extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ready: false,
      error: false,
      parties: {}
    }
  }

  componentWillMount () {
    this.setState({ready: false})

    let options = {method: 'GET', url: 'http://api.swethepeople.me/party/'}
    request(options, function (error, response, body) {
      if (error) {
        this.setState({error: true, ready: true})
      } else {
        let allParties = JSON.parse(body)
        let partiesMap = {}
        Object.keys(allParties).forEach(function (partyName) {
          partiesMap[partyName] = {
            path: allParties[partyName]['path'],
            name: allParties[partyName]['name'],
            chair: allParties[partyName]['chair'],
            num_reps: allParties[partyName]['representatives'].length
          }
        })

        this.setState({parties: partiesMap, ready: true})
      }
    }.bind(this))
  }

  render () {
    let parties = null
    if (this.state.ready) {
      let divStyle = {
      paddingTop: '70px'
    }
      parties = <PoliticalPartyInstance party_data = {this.state.parties} />

      return (
        <div style={divStyle}>
          {parties}
        </div>
      )
    }
    else {

      return(
      <div style={styles.center}>
      <RingLoader color={'#123abc'} loading={true} />
       </div>)

    }

    
  }
}
