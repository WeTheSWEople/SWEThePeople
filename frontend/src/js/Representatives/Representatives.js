/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {GridList} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'

/* eslint-disable no-unused-vars */
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
  center:{
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

export default class Representatives extends Component {
	constructor (props) {
	  super(props)
	  this.state = {
		  reps : null,
		  all_reps: null,
		  party_name : null,
		  value: ""
	  };
	  this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event){
		this.setState({value: event.target.value})
		if (event.target.value.length == 0){
			this.setState({reps:this.state.all_reps})
		}
		else{
			let filter_arr = this.state.all_reps.filter(item => item["firstname"].toLowerCase().includes(event.target.value.toLowerCase()) || item["lastname"].toLowerCase().includes(event.target.value.toLowerCase()))
			this.setState({reps: filter_arr})
		}
	}


	componentDidMount(){

	  // get the reps data
	  axios.get(`http://api.swethepeople.me/representative/`)
	  .then((response)=>{
		this.setState({
		  reps:response.data,
		  all_reps: response.data
		})
		// get the party names
		return axios.get(`http://api.swethepeople.me/party?party_name=True`)
	  })
	  .then((response)=>{
		this.setState({
		  party_name:response.data
		})
	  })
	  .catch((error)=>{
		this.setState({
			reps: -1,
			all_reps: -1,
			party_name: -1

		})
	  })
	}

  render () {
	if (this.state.all_reps === null || this.state.party_name === null){
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
		  <div style={styles.root} className="grid-container">
		  <center><input type="text" value={this.state.value} onChange={this.handleChange} /></center>
			<GridList
			  cellHeight={400}
			  cols={5}
			  style={styles.gridList}
			  className="gridlist-container"
			>
			  {this.state.reps.map((item) => (
				<RepresentativeInstance key={item.bioguide} rep = {item} party_name = {this.state.party_name[item.party_id][0]} />
			  ))}
			</GridList>
		  </div>
		</div>
	  )
	}

  }
}
