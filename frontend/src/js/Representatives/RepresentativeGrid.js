/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {GridList} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'
/* eslint-disable no-unused-vars */

import RepresentativeInstance from './RepresentativeInstance'
import '../../assets/css/App.css'
import '../../assets/css/FilterGrid.css'
import axios from 'axios'

const URL = 'http://ec2-18-188-158-73.us-east-2.compute.amazonaws.com/' +
  'representative/filter?filter='

export default class RepresentativeGrid extends Component {
  constructor (props) {
    super(props)
    this.state = {
      all_reps: null,
      party_name: null
    }

    this.getRepData = this.getRepData.bind(this)

    this.getRepData({
      state: this.props.state_value,
      party_id: this.props.party_value,
      votes_pct: this.props.vote_value,
      last_name: this.props.lastname_value,
      order_by: this.props.sort_value
    })
  }

  getRepData (filterParams) {
    this.setState({all_reps: null})
    axios.get(URL + JSON.stringify(filterParams)).then((response) => {
      if (response.data.length === 0) {
        this.setState({all_reps: -2})
      } else {
        this.setState({all_reps: response.data})
      }

      // get the party names
      return axios.get(`http://api.swethepeople.me/party?party_name=True`)
    }).then((response) => {
      this.setState({party_name: response.data})
    }).catch((error) => {
      this.setState({
        all_reps: -1,
        party_name: -1
      })
    })
  }

  componentDidMount () {
    this.getRepData({
      state: 'None',
      party_id: 'None',
      last_name: 'A-Z',
      votes_pct: 'None',
      order_by: 'last_asc'
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props !== nextProps) {
      this.getRepData({
        state: nextProps.state_value,
        party_id: nextProps.party_value,
        votes_pct: nextProps.vote_value,
        last_name: nextProps.lastname_value,
        order_by: nextProps.sort_value
      })
    }
  }

  render () {
    if (this.state.all_reps === null || this.state.party_name === null) {
      return (
        <div className='loading filter-grid-center'>
          <RingLoader color={'#123abc'} loading={true} />
        </div>
      )
    } else if (this.state.all_reps === -1 || this.state.party_name === -1) {
      return (
        <div className='filter-grid-root'>
          <p>Data Not Found</p>
        </div>
      )
    } else if (this.state.all_reps === -2) {
      return (
        <div className='filter-grid-root'>
          <h1>No representatives found, try a different filter.</h1>
        </div>
      )
    } else {
      return (
        <div className='App'>
          <div className='grid-container filter-grid-root'>
            <GridList
              cellHeight={400}
              cols={5}
              className='gridlist-container filter-grid-list'
            >
              {this.state.all_reps.map((item) => (
                <RepresentativeInstance
                  key={item.bioguide}
                  rep={item}
                  party_name={this.state.party_name[item.party_id][0]} />
              ))}
            </GridList>
          </div>
        </div>
      )
    }
  }
}
