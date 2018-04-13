/* eslint-disable no-unused-vars */
import PoliticalPartyInstance from './PoliticalPartyInstance.js'
import React, {Component} from 'react'
import ReactPaginate from 'react-paginate'
import {RingLoader} from 'react-spinners'
/* eslint-enable no-unused-vars */
import '../../assets/css/App.css'
import url from '../../assets/resource.json'

let request = require('request')

const styles = {
  center: {
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
      parties: {},
      displayed_parties: {},
      cur_page: 1
    }
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  handlePageClick (data) {
    let newMap = {}
    newMap['0'] = this.state.parties[data.selected * 3]
    newMap['1'] = this.state.parties[data.selected * 3 + 1]
    newMap['2'] = this.state.parties[data.selected * 3 + 2]
    this.setState({displayed_parties: newMap})
  }

  componentWillMount () {
    this.setState({ready: false})

    let options = {method: 'GET', url: url.api_url + 'party/'}
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
        let newMap = {}
        newMap['0'] = partiesMap[0]
        newMap['1'] = partiesMap[1]
        newMap['2'] = partiesMap[2]
        this.setState({parties: partiesMap,
          ready: true,
          cur_page: JSON.parse(body).length / 3,
          displayed_parties: newMap})
      }
    }.bind(this))
  }

  render () {
    let parties = null
    if (this.state.ready) {
      let divStyle = {
        paddingTop: '70px'
      }
      parties = <PoliticalPartyInstance party_data =
        {this.state.displayed_parties} />

      return (
        <div style={divStyle} className='parties-container'>
          {parties}
          <center>
            <ReactPaginate previousLabel={'previous'}
              nextLabel={'next'}
              breakLabel={<a>...</a>}
              breakClassName={'break-me'}
              pageCount={this.state.cur_page}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'} />
          </center>
        </div>
      )
    } else {
      return (
        <div style={styles.center}>
          <RingLoader color={'#123abc'} loading={true} />
        </div>
      )
    }
  }
}
