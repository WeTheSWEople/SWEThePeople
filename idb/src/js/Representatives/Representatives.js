/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {GridList} from 'material-ui/GridList'
import {RingLoader} from 'react-spinners'

/* eslint-disable no-unused-vars */
import RepresentativeInstance from './RepresentativeInstance'
import '../../assets/css/App.css'

import allReps from '../../assets/all-reps-endpoint.json'
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
  gridList: {
    width: '100%',
    height: '100%',
    overflowY: 'auto'
  }
}

axios.get('/user?ID=12345')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });


export default class Representatives extends Component {
  constructor (props) {
    super(props)
    this.state = {
        all_reps : null,
    };
  }

 
  componentDidMount(){
    axios.get(`http://api.swethepeople.me/representative/`)
    .then((response)=>{
      console.log("resp: " + JSON.stringify(response))
      this.setState({
        all_reps:response.data
      })
    })
    .catch((error)=>{
      console.log(error)
      this.setState({
          all_reps: -1
      })
    })
  }
  render () {
    if (this.state.all_reps === null){
      return(
      <div style={styles.root}>
      <RingLoader color={'#123abc'} loading={true} />
       </div>)
    }
    else if (this.state.all_reps === -1){
      console.log("hey: " + this.state.all_reps)
      return (
          <div style={styles.root}>
           <p> Data Not Found </p>
          </div>)
    }
    else{
      console.log(this.state.all_reps)
      return (
        <div className='App'>
          <header className='App-header-white'></header>
          <div style={styles.root}>
            <GridList
              cellHeight={400}
              cols={5}
              style={styles.gridList}
            >
              {this.state.all_reps.map((item) => (
                <RepresentativeInstance key={item.bioguide} rep = {item} />
              ))}
            </GridList>
          </div>
        </div>
      )
    }

  }
}
