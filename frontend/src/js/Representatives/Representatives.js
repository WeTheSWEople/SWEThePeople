/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {GridList} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'
/* eslint-disable no-unused-vars */

import Filter from '../Filter'
import RepresentativeInstance from './RepresentativeInstance'
import '../../assets/css/App.css'
import axios from 'axios'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: '50px',
    paddingLeft: '50px',
    paddingRight: '50px',
    justifyContent: 'space-around'
  },
  center: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: '25%',
    paddingLeft: '50px',
    paddingRight: '50px',
    justifyContent: 'space-around'
  },
  gridList: {
    width: '100%',
    height: '100%',
    overflowY: 'auto'
  }
}

const URL = 'http://ec2-18-188-158-73.us-east-2.compute.amazonaws.com/' +
  'representative/filter?filter='

export default class Representatives extends Component {
  constructor (props) {
    super(props)
    this.state = {
      all_reps: null,
      party_name: null,
      all_states: null
    }

    this.handleFilterClicked = this.handleFilterClicked.bind(this)
    this.getRepData = this.getRepData.bind(this)
  }

  getRepData(filterParams) {
    // get the reps data
    axios.get(URL + JSON.stringify(filterParams))
    .then((response)=>{
      this.setState({
        all_reps:response.data
      })
      // get the party names
      return axios.get(`http://api.swethepeople.me/party?party_name=True`)
    })
    .then((response)=>{
      this.setState({party_name: response.data})

      axios.get('http://ec2-18-188-158-73.us-east-2.compute.amazonaws.com/' +
        'state/?state_usps=True').then((response) => {
          this.setState({all_states: response.data})
        })
    })
    .catch((error)=>{
      this.setState({
          all_reps: -1,
          party_name: -1,
          all_states: null
      })
    })
  }

  componentDidMount() {
    this.getRepData({
      state: "None",
      party_id: "None",
      last_name: "A-Z",
      votes_pct: "None",
      order_by: "last_asc"
    })
  }

  handleFilterClicked(state_value, party_value, vote_value, lastname_value,
    sort_value) {
    this.getRepData({
      state: state_value,
      party_id: party_value,
      last_name: lastname_value,
      votes_pct: vote_value,
      order_by: sort_value
    })
  }

  render () {
    if (this.state.all_reps === null || this.state.party_name === null ||
      this.state.all_states === null) {
      return(
      <div style={styles.center} className="loading">
      <RingLoader color={'#123abc'} loading={true} />
       </div>)
    }
    else if (this.state.all_reps === -1  || this.state.party_name === -1){
      return (
          <div style={styles.root}>
           <p> Data Not Found </p>
          </div>)
    }
    else{
      return (
        <div className='App'>
          <header className='App-header-white'></header>
          <Filter states={this.state.all_states}
            parties={this.state.party_name}
            buttonHandler={this.handleFilterClicked} />
          <div style={styles.root} className="grid-container">
            <GridList
              cellHeight={400}
              cols={5}
              style={styles.gridList}
              className="gridlist-container"
            >
              {this.state.all_reps.map((item) => (
                <RepresentativeInstance key={item.bioguide} rep = {item} party_name = {this.state.party_name[item.party_id][0]} />
              ))}
            </GridList>
          </div>
        </div>
      )
    }

  }
}
