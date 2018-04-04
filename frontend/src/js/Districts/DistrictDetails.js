/* eslint-disable no-unused-vars */
import RepresentativeInstance from '../Representatives/RepresentativeInstance'
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Grid, Row, Col, ProgressBar} from 'react-bootstrap'
import {PieChart, BarChart} from 'react-easy-chart'
import axios from 'axios'
import {RingLoader} from 'react-spinners'

/* eslint-enable no-unused-vars */
import '../../assets/css/App.css'
import '../../assets/css/DistrictDetails.css'
import url from '../../assets/resource.json'


const styles = {
  imgStyle: {
    width: '100%',
    height: '100%'
  },
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

export default class DistrictDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      district_data: null,
      rep_data: null,
      party_data: null,
      races_pop: null,
      legend: null,
      district_num: '',
      district_state: '',
      bioguide: '',
      all_states: null

    }
  }
  componentWillMount () {
    axios.get(url.api_url + `district/${this.props.match.params.districtid}/${this.props.match.params.districtnum}`)
    .then((response)=>{
      this.setState({
        district_data:response.data,
        district_num : response.data.id,
        district_state : response.data.state,
        bioguide: response.representative_id
      })

      let result = []
      if (response.data.population_american_indian_and_alaska_native !== null){
        result.push({'x': 'AIAAN', 'y': response.data.population_american_indian_and_alaska_native})
      }
      if (response.data.population_asian !== null){
        result.push({'x': 'A', 'y': response.data.population_asian})
      }

      if(response.data.population_black_or_african_american !== null){
        result.push({'x': 'BOAA', 'y': response.data.population_black_or_african_american})
      }

      if(response.data.population_native_hawaiian_and_other_pacific_islander !== null){
        result.push({'x': 'NHAOPI', 'y': response.data.population_native_hawaiian_and_other_pacific_islander})
      }

      if(response.data.population_some_other_race !== null){
        result.push({'x': 'SOR', 'y': response.data.population_some_other_race})
      }

      if(response.data.population_two_or_more_races !== null){
        result.push({'x': 'TR', 'y': response.data.population_two_or_more_races})
      }

      if(response.data.population_white !== null){
        result.push({'x': 'W', 'y': response.data.population_white})
      }

      let legendTemp = []
      legendTemp.push({key: 'TR', value: 'Two or More Races'})
      legendTemp.push({key: 'W', value: 'White'})
      legendTemp.push({key: 'BOAA', value: 'Black Or African American'})
      legendTemp.push({key: 'AIAAN', value: 'American Indian And Alaska Native'})
      legendTemp.push({key: 'A', value: 'Asian'})
      legendTemp.push({key: 'NHAOPI', value: 'Native Hawaiian And Other Pacific Islander'})
      legendTemp.push({key: 'SOR', value: 'Some Other Race'})

      this.setState({races_pop: result})
      this.setState({legend: legendTemp})



      axios.get(url.api_url + `representative/${response.data.representative_id}`)
      .then((response)=>{
          this.setState({
            rep_data:response.data
          })

          // set party image
          let party = response.data.party_id
          if (party === 1) {
            this.setState({party_image: 'Democratic'})
          } else if (party === 2) {
            this.setState({party_image: 'Republican'})
          } else {
            this.setState({party_image: 'Libertarian'})
          }

          axios.get(url.api_url + `party?party_name=True`)
          .then((response)=>{
            this.setState({
              party_data:response.data
            })
             axios.get(url.api_url + 'state/?state_usps=True').then((response) => {
              this.setState({all_states: response.data})
             }).catch((error) => {
              this.setState({all_states: -1})
             })

          })
          .catch((error)=>{
            this.setState({
                party_data : -1
            })
          })
      })
      .catch((error)=>{
          this.setState({
              rep_data: -1,
        })
      })
    })
    .catch((error)=>{
        this.setState({
            district_data: -1
        })
    })
  }

  render () {


    if (this.district_data === null || this.state.rep_data === null || this.state.party_data === null || this.state.all_states === null){
      return(
      <div style={styles.center}>
      <RingLoader color={'#123abc'} loading={true} />
       </div>)
    }
    else if (this.district_data === null || this.state.rep_data === -1 || this.state.party_data === -1 || this.state.all_states === -1){
      return (
          <div style={styles.root}>
           <p> Data Not Found </p>
          </div>)
    }
    else{
      let repsGrid = <div class='col-sm-6'>
        <RepresentativeInstance rep={this.state.rep_data} party_name = {this.state.party_data[this.state.rep_data.party_id][0]}  />
      </div>

      let legend = null
      legend = Object.keys(this.state.legend).map((item) =>
        <p style={{textAlign: 'left'}}> <b>{this.state.legend[item]['key']}</b> :
        {` `}
        {this.state.legend[item]['value']}</p>
      )

      let genderPopData = []

      let population = this.state.district_data.population

      let male = {}
      male['key'] = 'Male (' +
        (this.state.district_data.population_male / population * 100).toFixed(2) + '%)'
      male['value'] = this.state.district_data.population_male
      male['color'] = '#abcc84'

      let female = {}
      let female_pop = population - this.state.district_data.population_male
      female['key'] = 'Female (' +
        (female_pop / population * 100).toFixed(2) + '%)'
      female['value'] = population - this.state.district_data.population_male
      female['color'] = '#aaac84'
      genderPopData.push(male)
      genderPopData.push(female)
      return (
        <div className='App'>
          <header className='Rep-Details-header'> </header>

          <Row >
            <h1><font size='8'><b>
            {` `}
            {this.state.all_states[this.state.district_state]+' - District '+this.state.district_num}</b></font></h1>
            <br></br><br></br>
            <Col sm={6} md={6}>

              <img src={
                require('../../assets/images/districts/' +
                this.state.district_state + '-' + this.state.district_num + '.png')}
              width='500px' height='350px' marginLeft='25px' alt='District Map'/>

            </Col>
            <Col sm={6} md={6}>
              <div style={{textAlign: 'left', padding: '80px'}}>
                <p><font size='5'>
                  <b>Total Population: </b>
                  {this.state.district_data.population}
                  {` `}
                  people
                </font></p>
                <p><font size='5'>
                  <b>Median Age: </b>
                  {this.state.district_data.median_age}
                  {` `}
                  years
                </font></p>
                <p><font size='5'>
                  <b>Median Age (Male): </b>
                  {this.state.district_data.median_age_male}
                  {` `}
                  years
                </font></p>
                <p><font size='5'>
                  <b>Median Age (Female): </b>
                  {this.state.district_data.median_age_female}
                  {` `}
                  years
                </font></p>
              </div>
            </Col>
          </Row>
          <br></br><br></br>
          <h3 class='bills-header'>
            <b>
            Statistics for District {this.state.district_num}
            </b>
          </h3>
          <Row >
            <Col sm={5} md={5}>
              <PieChart labels
                padding={30}
                data={genderPopData}
                styles={{
                  '.chart_text': {
                    fontSize: '1em',
                    fill: '#fff'
                  }
                }}
              />
              <p><b> Gender Population</b></p>
            </Col>
            <Col sm={5} md={5}>
              <BarChart labels
                colorBars
                axes
                barWidth={20}
                axisLabels={{x: 'Race', y: 'Number of People'}}
                height={400}
                data={this.state.races_pop}
                styles={{
                  '.chart_text': {
                    fontSize: '1em',
                    fill: '#fff'
                  }
                }}
              />

              <p><b> Race v.s. Number of People</b></p>
            </Col>
            <Col sm={2} md={2}>
              <div style={{marginTop: '75px', marginRight: '40px'}}>
                <h5> <b>Legend: </b></h5>
                {legend}
              </div>
            </Col>

          </Row>
          <h3 class='bills-header'><b>Representative</b></h3>
          <div class='row'>
            <div class='col-md-5 col-md-offset-2'>
              {repsGrid}
            </div>
            <div class='col-md-3'>
              <Link to={`/party/${this.state.party_data[this.state.rep_data['party_id']][1]}`} >
                <img src={
                  require('../../assets/images/parties/' +
                    this.state.party_image + '.png')}
                alt='Party logo'
                className='img-responsive'
                style={styles.imgStyle} />
                <h3><b>{this.state.party_data[this.state.rep_data['party_id']][0]}</b></h3>
              </Link>
            </div>
          </div>
          <br></br>
        </div>

      )
    }
  }
}
