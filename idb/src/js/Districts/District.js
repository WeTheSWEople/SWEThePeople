/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
/* eslint-enable no-unused-vars */
import '../../assets/css/App.css'
import '../../assets/css/District.css'
import axios from 'axios'
import {RingLoader} from 'react-spinners'


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
    paddingTop: '20%',
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


//let stateJSON = require('../../assets/data/state.json')
export default class Districts extends Component {
  constructor (props) {
    super(props)
    this.state = {
      state_name : null,
      census_json: null
    }
  }
  componentWillMount () {
    axios.get(`http://api.swethepeople.me/state/${this.props.match.params.districtid}`)
    .then((response)=>{
      this.setState({
        state_name : response.data.name
      })
      axios.get(`http://api.swethepeople.me/district/${this.props.match.params.districtid}`)
      .then((response)=>{
        console.log(response.data)
        this.setState({
          census_json : response.data
        })
        console.log(this.state.census_json)
      })
      .catch((error)=>{
        this.setState({
            census_json: -1
        })
      })
    })
    .catch((error)=>{
      this.setState({
          state_name : -1
      })
    })



    //let censusJSON = require('../../assets/data/census_data.json')
    //let repJSON = require('../../assets/data/rep_data/' +
    //    this.props.match.params.districtid + '.json')
    // let senatorJSON = require('../../assets/data/senate_data/' +
    //   this.props.match.params.districtid + '.json')
    //let reps = this.state.total_reps
    //let districtsList = []
    // if (repJSON['status'] === 'OK') {
    //   reps += repJSON['results'].length
    //   for (let i = 0; i < repJSON.results.length; i++) {
    //     let result = repJSON.results[i]
    //     let party = 'Democratic'
    //     let cssColor = 'light-blue'
    //     if (result['party'] === 'R') {
    //       party = 'Republican'
    //       cssColor = 'light-red'
    //     } else if (result['party'] === 'L') {
    //       party = 'Libertarian'
    //       cssColor = 'light-yellow'
    //     }

    //     let name = 'District ' + result['district']
    //     // Re-add for At-Large Districts
    //     // if (repJSON.results.length === 1) {
    //     //   name = result['district'] + ' District'
    //     // }

    //     // console.log(censusJSON)
    //     // console.log('2 ' + this.props.match.params.districtid)
    //     // console.log(result['district'])
    //     //let state = censusJSON[this.props.match.params.districtid]

    //     let population = state[result['district']]['population']['total']
    //     let population = 
    //     districtsList.push({'district': result['district'],
    //       'name': name,
    //       'population': population,
    //       'party': party,
    //       'rep': result['name'],
    //       'id': result['id'],
    //       'cssColor': cssColor,
    //       'rep_id': result['id']})
    //   }

    //   districtsList.sort(function (a, b) {
    //     return parseInt(a.district, 10) - parseInt(b.district, 10)
    //   })
    //   this.setState({districts: repJSON['results'].length,
    //     total_reps: reps,
    //     districts_arr: districtsList})
    // }

    // for (let i = 0; i < repJSON.results.length; i++) {


    // }

  }
  render () {
    if (this.state.state_name === null || this.state.census_json === null){
      return(
      <div style={styles.center}>
      <RingLoader color={'#123abc'} loading={true} />
       </div>)
    }
    else if (this.state.state_name === -1 || this.state.census_json === -1){
      return (
          <div style={styles.root}>
           <p> Data Not Found </p>
          </div>)
    }
    else{
      let styles = {
        head: {
          paddingTop: '70px'
        },
        imgStyle: {
          width: '50%'
        }
      }

      let districtsGrid = this.state.census_json.map((district) =>
        <div className='col-sm-3 district-grid' key={district.alpha_num}>
        <Link to={`/districts/${this.props.match.params.districtid}/` +
        `${district.id}`}>
        <div className={'district-card'}>
              <h3><b>{district.alpha_num}</b></h3>
              <img src={
                require('../../assets/images/districts/' +
                district.alpha_num + '.png')}
              width='250px' height='150px' marginLeft='25px' alt='District Map'
              />
              <h5><b>Population: </b>{district.population}</h5>
              <h5><b>Meidan Age: </b>{district.median_age}</h5>
              <br></br>
            </div>
          </Link>
        </div>
      )
      

      return (
        <div className='container' style={styles.head}>
          <h1 className='district-header'>
            {this.state.state_name}
          </h1>
          <div className='row'>
            {districtsGrid}
          </div>
        </div>
      )
    }
  }
}
