/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import StateInstance from '../Representatives/StateInstance'
import {GridList} from 'material-ui/GridList'
/* eslint-enable no-unused-vars */
import axios from 'axios'
import {RingLoader} from 'react-spinners'
import '../../assets/css/App.css'

const styles = {
  root: {
    paddingTop: '50px',
    paddingLeft: '50px',
    paddingRight: '50px',
    justifyContent: 'space-around'
  },
  gridList: {
    width: '80%',
    height: '100%',
    overflowY: 'auto'
  }
}

let stateJSON = require('../../assets/data/state.json')
export default class AllDistricts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      state_name : null
    }
  }

  componentWillMount () {
    axios.get(`http://api.swethepeople.me/state/`)
    .then((response)=>{
      console.log(response.data)
      this.setState({
        state_name : response.data
      })
    })
    .catch((error)=>{
      this.setState({
          state_name : -1
      })
    })

  }

  render () {
    if (this.state.state_name === null){
      return(
      <div style={styles.center}>
      <RingLoader color={'#123abc'} loading={true} />
       </div>)
    }
    else if (this.state.state_name === -1){
      return (
          <div style={styles.root}>
           <p> Data Not Found </p>
          </div>)
    }
    else{
      // let allStates = Object.keys(this.state.state_name).map((key, index) =>
      //    console.log(key, index)
      //    <StateInstance full_state={this.state.state_name[key]} state={key} />
      // )

      let allStates = this.state.state_name.map((item)=>
        <StateInstance full_state={item.name} state={item.usps_abbreviation} num_reps={item.districts.length}/>
      )

      return (
        <div className="App">
          <br />
          <br />
          <div style={styles.root}>
            <GridList>
              {allStates}
            </GridList>
          </div>
        </div>
      )
    }
  }
}
