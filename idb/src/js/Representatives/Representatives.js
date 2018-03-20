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
    paddingTop: '50%',
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
        all_reps : null,
    };
  }

 
  componentDidMount(){
    axios.get(`http://api.swethepeople.me/representative/`)
    .then((response)=>{
      this.setState({
        all_reps:response.data
      })
    })
    .catch((error)=>{
      this.setState({
          all_reps: -1
      })
    })
  }
  
  render () {
    if (this.state.all_reps === null){
      return(
      <div style={styles.center}>
      <RingLoader color={'#123abc'} loading={true} />
       </div>)
    }
    else if (this.state.all_reps === -1){
      return (
          <div style={styles.root}>
           <p> Data Not Found </p>
          </div>)
    }
    else{
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
