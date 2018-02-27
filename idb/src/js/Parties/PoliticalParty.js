/* eslint-disable no-unused-vars */
import PoliticalPartyInstance from './PoliticalPartyInstance.js'
import React, {Component} from 'react'
/* eslint-enable no-unused-vars */

import '../../assets/css/App.css'
// import allParties from '../../assets/all-parties.json'
import allParties from '../../assets/parties.json'
import repsInfo from '../../assets/all-reps-endpoint.json'

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

    let partiesMap = {}
    Object.keys(allParties).forEach(function (partyName) {
      partiesMap[partyName] = {
        path: allParties[partyName]['path'],
        name: allParties[partyName]['name'],
        color: allParties[partyName]['color'],
        chair: allParties[partyName]['chair'],
        num_reps: 0
      }
    })

    Object.keys(repsInfo).forEach(function (repKey) {
      Object.keys(partiesMap).forEach(function (partyKey) {
        if (partyKey.startsWith(repsInfo[repKey]['party'])) {
          partiesMap[partyKey]['num_reps'] += 1
        }
      })
    })

    this.setState({parties: partiesMap, ready: true})
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
      <div style={divStyle}>
        {parties}
      </div>
    )
  }
}
