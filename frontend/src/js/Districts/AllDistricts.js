/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import StateInstance from './StateInstance'
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
  },
  center:{
	display: 'flex',
	flexWrap: 'wrap',
	paddingTop: '25%',
	paddingLeft: '50px',
	paddingRight: '50px',
	justifyContent: 'space-around'
  }
}

export default class AllDistricts extends Component {
	constructor (props) {
		  super(props)
		  this.state = {
			state_name : null,
			all_states : null,
			value: "",
		  }
		  this.handleChange = this.handleChange.bind(this)
	}

	  handleChange(event){
		this.setState({value: event.target.value})
		  if (event.target.value.length == 0){
			  this.setState({state_name:this.state.all_states})
		  }
		else{
			let reduced_list = this.state.all_states.filter(item => item["name"].toLowerCase().includes(event.target.value))
			this.setState({state_name: reduced_list})
		}
	  }

  componentWillMount () {
	axios.get(`http://api.swethepeople.me/state/`)
	.then((response)=>{
	  // console.log(response.data)
	  this.setState({
		state_name : response.data,
		all_states : response.data,
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
	  <div style={styles.center} className="loading">
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

	  let allStates = this.state.state_name.map((item)=>
		<StateInstance full_state={item.name} state={item.usps_abbreviation} num_reps={item.districts.length}/>
	  )

	  return (
		<div className="App">
		  <br />
		  <br />
		  <div style={styles.root} className="alldistricts-grid">
		  <center><input type="text" value={this.state.value} onChange={this.handleChange} /></center>
			<GridList>
			  {allStates}
			</GridList>
		  </div>
		</div>
	  )
	}
  }
}
