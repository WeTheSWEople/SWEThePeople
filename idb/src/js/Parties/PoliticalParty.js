/* eslint-disable no-unused-vars */
import PoliticalPartyInstance from './PoliticalPartyInstance.js'
import React, {Component} from 'react'
/* eslint-enable no-unused-vars */

import '../../assets/css/App.css'
import allParties from '../../assets/all-parties.json'
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
    for (let i = 0; i < allParties.length; i++) {
      partiesMap[allParties[i]['name']] = {
        name: allParties[i]['name'],
        color: allParties[i]['color'],
        chair: allParties[i]['chair'],
        num_reps: 0
      }
    }

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
