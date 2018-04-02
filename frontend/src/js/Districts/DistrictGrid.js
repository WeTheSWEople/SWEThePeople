/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
/* eslint-enable no-unused-vars */

import '../../assets/css/App.css'
import '../../assets/css/District.css'
import axios from 'axios'
import {RingLoader} from 'react-spinners'

const URL = 'http://ec2-18-188-158-73.us-east-2.compute.amazonaws.com/' +
  'district/filter?filter='

export default class DistrictGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      districts: null,
      state_name : null,
      census_json: null
    }
  }

  getDistrictData(filterParams) {
    this.setState({districts: null})
    axios.get(URL + JSON.stringify(filterParams)).then((response) => {
      if (response.data.length === 0) {
        this.setState({districts: -2})
      } else {
        this.setState({districts: response.data})
      }
    }).catch((error) => {
      this.setState({districts: -1})
    })
  }

  componentDidMount() {
    this.getDistrictData({
      state: "None",
      population: "None",
      median_age: "None",
      order_by: "state_asc"
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.getDistrictData({
        state: nextProps.state_value,
        population: nextProps.population_value,
        median_age: nextProps.median_age_value,
        order_by: nextProps.sort_value
      })
    }
  }

  render () {
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

    if (this.state.districts === null) {
      return(
        <div style={styles.center}>
          <RingLoader color={'#123abc'} loading={true} />
        </div>
      )
    } else if (this.state.districts === -1) {
      return (
        <div style={styles.root}>
          <p>Data Not Found</p>
        </div>
      )
    } else if (this.state.districts === -2) {
      return (
        <div style={styles.root}>
          <h1>No districts found, try a different filter.</h1>
        </div>
      )
    } else{
      let districtsGrid = this.state.districts.map((district) =>
        <div className='col-sm-3 district-grid' key={district.alpha_num}>
          <Link to={`/districts/${district.state}/${district.id}`}>
            <div className='district-card'>
              <h3><b>{district.alpha_num}</b></h3>
              <h5><b>Population: </b>{district.population}</h5>
              <h5><b>Median Age: </b>{district.median_age}</h5>
              <img src={require('../../assets/images/districts/' +
                district.alpha_num + '.png')}
              width='250px' height='150px' marginLeft='25px' alt='District Map'
              className='img-responsive district-img'
              />
              <br></br>
            </div>
          </Link>
        </div>
      )

      return (
        <div className='container'>
          <div className='row' style={{paddingTop: '20px'}}>
            {districtsGrid}
          </div>
        </div>
      )
    }
  }
}
