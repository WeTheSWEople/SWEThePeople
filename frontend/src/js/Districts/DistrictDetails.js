/* eslint-disable no-unused-vars */
import RepresentativeInstance from '../Representatives/RepresentativeInstance'
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Grid, Row, Col, ProgressBar, Tabs, Tab} from 'react-bootstrap'
import {PieChart, Pie, BarChart, Bar, Tooltip, Cell, Legend, YAxis, XAxis} from 'recharts'
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
  },
  box: {
    background: 'white',
    margin: '5px',
    fontFamily: 'EB Garamond',
    minHeight: '70vh'
  },
  tabBox: {
    padding: '15px',
    fontFamily: 'EB Garamond'
  },
  image: {
    maxWidth: '75%',
    paddingTop: '20px',
  },
  genderPie: {
    textAlign: 'center'
  },
  chart: {
    margin: 'auto'
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
      techLiteracy: null,
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
        district_data: response.data,
        district_num : response.data.id,
        district_state : response.data.state,
        bioguide: response.representative_id
      })

      console.log(this.state.district_data)

      let result = []
      if(response.data.population_american_indian_and_alaska_native !== null){
        result.push({'name': 'AIAAN', 'amt': response.data.population_american_indian_and_alaska_native})
      }
      if(response.data.population_asian !== null){
        result.push({'name': 'A', 'amt': response.data.population_asian})
      }
      if(response.data.population_black_or_african_american !== null){
        result.push({'name': 'BOAA', 'amt': response.data.population_black_or_african_american})
      }
      if(response.data.population_native_hawaiian_and_other_pacific_islander !== null){
        result.push({'name': 'NHAOPI', 'amt': response.data.population_native_hawaiian_and_other_pacific_islander})
      }
      if(response.data.population_some_other_race !== null){
        result.push({'name': 'SOR', 'amt': response.data.population_some_other_race})
      }
      if(response.data.population_two_or_more_races !== null){
        result.push({'name': 'TR', 'amt': response.data.population_two_or_more_races})
      }
      if(response.data.population_white !== null){
        result.push({'name': 'W', 'amt': response.data.population_white})
      }

      let legendTemp = []
      legendTemp.push({name: 'TR', value: 'Two or More Races'})
      legendTemp.push({name: 'W', value: 'White'})
      legendTemp.push({name: 'BOAA', value: 'Black Or African American'})
      legendTemp.push({name: 'AIAAN', value: 'American Indian And Alaska Native'})
      legendTemp.push({name: 'A', value: 'Asian'})
      legendTemp.push({name: 'NHAOPI', value: 'Native Hawaiian And Other Pacific Islander'})
      legendTemp.push({name: 'SOR', value: 'Some Other Race'})

      this.setState({races_pop: result})
      this.setState({legend: legendTemp})

      let tlit = []
      if(response.data.computers_has_one_or_more !== null){
        tlit.push({'name': 'One or more', 'amt': response.data.computers_has_one_or_more})
      }

      this.setState({techLiteracy: tlit})

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
      let repsGrid = <div class='col-sm-8'>
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
      male['name'] = 'Male (' +
        (this.state.district_data.population_male / population * 100).toFixed(2) + '%)'
      male['value'] = this.state.district_data.population_male

      let female = {}
      let female_pop = population - this.state.district_data.population_male
      female['name'] = 'Female (' +
        (female_pop / population * 100).toFixed(2) + '%)'
      female['value'] = population - this.state.district_data.population_male
      genderPopData.push(male)
      genderPopData.push(female)

      return (
        <div className='App'>
          <header className='Rep-Details-header'> </header>

          <Row>
            <Col sm={0} md={1}></ Col>
            <Col sm={12} md={3}>
              <div style={styles.box}>

                <img src={
                  require('../../assets/images/districts/' +
                  this.state.district_state + '-' + this.state.district_num + '.png')}
                style={styles.image}
                alt='District Map'/>

                <h1><font size='5'><b>
                  {this.state.all_states[this.state.district_state]+' - District '+this.state.district_num}
                </b></font></h1>

                <div style={{textAlign: 'center', padding: '40px'}}>
                  <p><font size='4'>
                    <b>Total Population: </b>
                    {this.state.district_data.population}
                    {` `}
                    people
                  </font></p>
                  <p><font size='4'>
                    <b>Median Age: </b>
                    {this.state.district_data.median_age}
                    {` `}
                    years
                  </font></p>
                  <p><font size='4'>
                    <b>Median Age (Male): </b>
                    {this.state.district_data.median_age_male}
                    {` `}
                    years
                  </font></p>
                  <p><font size='4'>
                    <b>Median Age (Female): </b>
                    {this.state.district_data.median_age_female}
                    {` `}
                    years
                  </font></p>
                </div>
              </div>
            </Col>
            <Col sm={12} md={7}>
              <div style={styles.box}>
                <Tabs defaultActiveKey={2} id="uncontrolled-tab-example">
                  <Tab eventKey={1} title="Current Representative">
                    <Row style={styles.tabBox}>
                      {repsGrid}
                      <div class='col-md-4'>
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
                    </Row>
                  </Tab>
                  <Tab eventKey={2} title="Population Breakdown">
                    <Row style={styles.tabBox}>
                      <Col md={1}></Col>
                      <Col md={5} styles={styles.genderPie}>
                        <h3><b>Gender Population</b></h3>
                        <PieChart
                          height={250}
                          width={300}
                          style={styles.chart}>
                          <Pie
                          data={genderPopData}
                          outerRadius={80}
                          fill="#8884d8"
                          >
                          <Cell fill={"#78bdc4"}/>
                          <Cell fill={"#ea1f28"}/>
                          </Pie>
                          <Tooltip/>
                          <Legend/>
                        </PieChart>
                      </Col>
                      <Col md={5} style={styles.genderPie}>
                        <h3><b>Race v. Population</b></h3>
                        <BarChart
                          width={300}
                          height={250}
                          data={this.state.races_pop}
                          style={styles.chart}>
                        <Bar dataKey='amt' fill='#78bdc4'/>
                        <XAxis dataKey="name" />
                        <YAxis />
                        </BarChart>
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey={3} title="Technology Literacy">
                          <h1>{this.state.techLiteracy[0].name}</h1>
                  </Tab>
                </Tabs>
              </div>
            </ Col>
          </Row>
        </div>

      )
    }
  }
}
