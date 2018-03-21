/* eslint-disable no-unused-vars */
import PoliticalPartyInstance from './PoliticalPartyInstance.js'
import React, {Component} from 'react'
/* eslint-enable no-unused-vars */

import '../../assets/css/App.css'

let request = require('request')

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
      parties = <PoliticalPartyInstance party_data = {this.state.parties} />
    }

    let divStyle = {
      paddingTop: '70px'
    }

    return (
      <div style={divStyle} className="parties-container">
        {parties}
      </div>
    )
  }
}
