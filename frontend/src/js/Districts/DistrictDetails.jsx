/* eslint-disable valid-jsdoc */
/* eslint-disable no-unused-vars */
import RepresentativeInstance from '../Representatives/RepresentativeInstance'
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Grid, Row, Col, ProgressBar, Tabs, Tab, ResponsiveEmbed}
  from 'react-bootstrap'
import {PieChart, Pie, BarChart, Bar, Tooltip, Cell, Legend, YAxis, XAxis}
  from 'recharts'
import axios from 'axios'
import {RingLoader} from 'react-spinners'
import {cleanIncomeData, cleanEducationData, cleanEthnicityData,
  cleanComputersData, cleanInternetData} from './DistrictDataFilter.js'
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
  center: {
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
    paddingTop: '20px'
  },
  genderPie: {
    textAlign: 'center'
  },
  chart: {
    margin: 'auto'
  }
}

/**
 * Component to display the details for a specific district instance.
 */
export default class DistrictDetails extends Component {
  /**
   * Sets the default state and binds methods to this
   */
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
      all_states: null,
      cpuLegend: null,
      internetLit: null,
      iLegend: null,
      incomeData: null,
      educationData: null
    }

    this.getAllStates = this.getAllStates.bind(this)
  }

  /**
   * Gets the mapping of state usps abbreviations to the full state name from
   * the API
   */
  getAllStates () {
    axios.get(url.api_url + 'state/?state_usps=True').then((response) => {
      this.setState({all_states: response.data})

      axios.get(url.api_url + `party?party_name=True`).then((response) => {
        this.setState({
          party_data: response.data
        })
      })
    }).catch((error) => {
      this.setState({all_states: -1})
    })
  }

  /**
   * Gets the information from about this district from the API
   */
  componentWillMount () {
    axios.get(url.api_url +
      `district/${this.props.match.params.districtid}` +
      `/${this.props.match.params.districtnum}`)
      .then((response) => {
        this.setState({
          district_data: response.data,
          district_num: response.data.id,
          district_state: response.data.state,
          bioguide: response.representative_id
        })
        let district_data = response.data
        this.setState({races_pop: cleanEthnicityData(district_data)[0]})
        this.setState({legend: cleanEthnicityData(district_data)[1]})
        this.setState({cpuLegend: cleanComputersData(district_data)[1]})
        this.setState({techLiteracy: cleanComputersData(district_data)[0]})
        this.setState({iLegend: cleanInternetData(district_data)[1]})
        this.setState({internetLit: cleanInternetData(district_data)[0]})
        this.setState({incomeData: cleanIncomeData(district_data)})
        this.setState({educationData: cleanEducationData(district_data)})

        axios.get(url.api_url +
          `representative/${response.data.representative_id}`)
          .then((response) => {
            this.setState({
              rep_data: response.data
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
              .then((response) => {
                this.setState({
                  party_data: response.data
                })
                axios.get(url.api_url + 'state/?state_usps=True')
                  .then((response) => {
                    this.setState({all_states: response.data})
                  }).catch((error) => {
                    this.setState({all_states: -1})
                  })
              })
              .catch((error) => {
                this.setState({party_data: -1})
              })
          })
          .catch((error) => {
            this.setState({rep_data: -1})
            this.getAllStates()
          })
      })
      .catch((error) => {
        this.setState({
          district_data: -1
        })
      })
  }

  /**
   * Renders the district information
   */
  render () {
    if (this.state.district_data === -1 && this.state.rep_data === -1 &&
      this.state.party_data === -1 && this.state.all_states === -1) {
      return (
        <div style={styles.root}>
          <p> Data Not Found </p>
        </div>
      )
    } else if (this.state.district_data === null ||
      this.state.rep_data === null || this.state.party_data === null ||
      this.state.all_states === null) {
      return (
        <div style={styles.center}>
          <RingLoader color={'#123abc'} loading={true} />
        </div>
      )
    } else {
      let repsGrid = <div> There is No Representative For this District. </div>
      if (this.state.rep_data !== -1) {
        repsGrid = <RepresentativeInstance rep={this.state.rep_data}
          party_name = {
            this.state.party_data[this.state.rep_data.party_id][0]} />
      }

      let legend = null
      legend = Object.keys(this.state.legend).map((item) =>
        <p style={{textAlign: 'left', fontSize: '12px', marginLeft: '60px'}}>
          <b>{this.state.legend[item]['name']}</b> :
          {` `}
          {this.state.legend[item]['value']}
        </p>
      )

      let genderPopData = []
      let population = this.state.district_data.population
      let male = {}
      male['name'] = 'Male (' +
        (this.state.district_data.population_male / population * 100)
          .toFixed(2) + '%)'
      male['value'] = this.state.district_data.population_male

      let female = {}
      let female_pop = population - this.state.district_data.population_male
      female['name'] = 'Female (' +
        (female_pop / population * 100).toFixed(2) + '%)'
      female['value'] = population - this.state.district_data.population_male
      genderPopData.push(male)
      genderPopData.push(female)
      let img_src = 'https://www.govtrack.us/congress/members/embed/' +
        'mapframe?state=' + this.state.district_state + '&district=' +
        this.state.district_num
      if (this.state.district_num == 'At-Large') {
        img_src = 'https://www.govtrack.us/congress/members/embed/' +
          'mapframe?state=' + this.state.district_state + '&district=' + 0
      }

      let cpuData = []
      let techPopulation = this.state.techLiteracy[0].amt +
        this.state.techLiteracy[1].amt
      cpuData.push({
        'name': '(' +
          (this.state.techLiteracy[0].amt / techPopulation * 100).toFixed(2) +
          '%)' + ' Households with one or more',
        'value': this.state.techLiteracy[0].amt})
      cpuData.push({
        'name': '(' +
          (this.state.techLiteracy[1].amt / techPopulation * 100).toFixed(2) +
          '%)' + ' Households with none',
        'value': this.state.techLiteracy[1].amt})

      let cpuTypeData = []
      cpuTypeData.push({'name': 'D/L', 'amt': this.state.techLiteracy[2].amt})
      cpuTypeData.push({'name': 'S', 'amt': this.state.techLiteracy[3].amt})
      cpuTypeData.push({'name': 'T', 'amt': this.state.techLiteracy[4].amt})
      cpuTypeData.push({'name': 'Other', 'amt': this.state.techLiteracy[5].amt})

      let cpuLegend = null
      cpuLegend = Object.keys(this.state.cpuLegend).map((item) =>
        <p style={{textAlign: 'left', fontSize: '12px', marginLeft: '60px'}}>
          <b>{this.state.cpuLegend[item]['name']}</b> :
          {` `}
          {this.state.cpuLegend[item]['value']}
        </p>
      )

      let internetData = []
      let internetPopulation = this.state.internetLit[0].amt +
        this.state.internetLit[1].amt
      internetData.push({
        'name': '(' + (this.state.internetLit[0].amt / internetPopulation * 100)
          .toFixed(2) + '%)' + ' Households with internet access',
        'value': this.state.internetLit[0].amt
      })
      internetData.push({
        'name': '(' + (this.state.internetLit[1].amt / internetPopulation * 100)
          .toFixed(2) + '%)' + ' Households with no internet access',
        'value': this.state.internetLit[1].amt
      })

      let internetTypeData = []
      internetTypeData.push({
        'name': 'D',
        'amt': this.state.internetLit[2].amt
      })
      internetTypeData.push({
        'name': 'B',
        'amt': this.state.internetLit[3].amt
      })
      internetTypeData.push({
        'name': 'CD',
        'amt': this.state.internetLit[4].amt
      })
      internetTypeData.push({
        'name': 'S',
        'amt': this.state.internetLit[5].amt
      })

      let internetLegend = null
      internetLegend = Object.keys(this.state.iLegend).map((item) =>
        <p style={{textAlign: 'left', fontSize: '12px', marginLeft: '60px'}}>
          <b>{this.state.iLegend[item]['name']}</b> :
          {` `}
          {this.state.iLegend[item]['value']}
        </p>
      )

      let incomeLegend = null
      incomeLegend = Object.keys(this.state.incomeData).map((item) =>
        <Col md={2} style={{
          textAlign: 'left', fontSize: '12px', marginLeft: '60px'}}>
          <b>{this.state.incomeData[item]['name']}</b> :
          {` `}
          {this.state.incomeData[item]['amt']}
        </Col>
      )

      let educationLegend = null
      educationLegend = Object.keys(this.state.educationData).map((item) =>
        <Col md={3} style={{
          textAlign: 'left', fontSize: '12px', marginLeft: '60px'}}>
          <b>{this.state.educationData[item]['name']}</b> :
          {` `}
          {this.state.educationData[item]['amt']}
        </Col>
      )

      return (
        <div className='App'>
          <header className='Rep-Details-header'> </header>
          <Row>
            <Col sm={0} md={1}></ Col>
            <Col sm={12} md={3}>
              <div style={styles.box}>

                <img src={
                  require('../../assets/images/districts/' +
                    this.state.district_state + '-' + this.state.district_num +
                    '.png')}
                style={styles.image}
                alt='District Map'/>

                <h1><font size='5'><b>
                  {this.state.all_states[this.state.district_state] +
                    ' - District ' + this.state.district_num}
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
                  <p><font size='4'>
                    <b>Wikipedia: </b>
                    <a href = {this.state.district_data.wikipedia_link}
                      target="_blank" > {
                        this.state.district_state + '- District ' +
                        this.state.district_num}
                    </a>
                  </font></p>
                </div>
              </div>
            </Col>
            <Col sm={12} md={7}>
              <div style={styles.box}>
                <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
                  <Tab eventKey={1} title="Current Representative">
                    <Row style={styles.tabBox}>
                      <Col md={1} sm={0}></Col>
                      <Col>
                        {repsGrid}
                      </Col>
                      <Col md={2} sm={0}></Col>
                      <Col md={4}>
                        <Link to={`/party/${this.state.party_data[this.state.rep_data['party_id']][1]}`} >
                          <img src={
                            require('../../assets/images/parties/' +
                              this.state.party_image + '.png')}
                          alt='Party logo'
                          className='img-responsive'
                          style={styles.imgStyle} />
                          <h3><b>
                            {this.state.party_data[this.state.rep_data['party_id']][0]}
                          </b></h3>
                        </Link>
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey={2} title='District Interactive Map'>
                    <Row style={styles.tabBox}>
                      <Col md={12} style={styles.genderPie}>
                        <div style={{width: 'auto', height: '80%'}}>
                          <ResponsiveEmbed a16by9>
                            <embed type='image/svg+xml' src={img_src} />
                          </ResponsiveEmbed>
                        </div>
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey={3} title='Population Breakdown'>
                    <Row style={styles.tabBox}>
                      <Col md={1}></Col>
                      <Col md={5} styles={styles.genderPie}>
                        <h3><b>Gender Population</b></h3>
                        <PieChart
                          height={250}
                          width={300}
                          style={styles.chart}>
                          <Pie data={genderPopData} outerRadius={80}
                            fill='#8884d8'>
                            <Cell fill={'#78bdc4'} />
                            <Cell fill={'#ea1f28'} />
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </Col>
                      <Col md={5} style={styles.genderPie}>
                        <h3><b>Race/Ethnicity v. Population</b></h3>
                        <BarChart
                          width={300}
                          height={250}
                          data={this.state.races_pop}
                          style={styles.chart}>
                          <Bar dataKey='amt' fill='#78bdc4'/>
                          <XAxis dataKey='name' />
                          <YAxis />
                        </BarChart>
                        {legend}
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey={4} title='Technology Literacy'>
                    <Row style={styles.tabBox}>
                      <Col md={1}></Col>
                      <Col md={5} styles={styles.genderPie}>
                        <h3><b>Households with Computers</b></h3>
                        <PieChart
                          height={250}
                          width={300}
                          style={styles.chart}>
                          <Pie data={cpuData} outerRadius={80} fill='#8884d8'>
                            <Cell fill={'#78bdc4'} />
                            <Cell fill={'#ea1f28'} />
                          </Pie>
                          <Tooltip/>
                          <Legend/>
                        </PieChart>
                      </Col>
                      <Col md={5} style={styles.genderPie}>
                        <h3><b>Computer Breakdown</b></h3>
                        <BarChart
                          width={350}
                          height={250}
                          data={cpuTypeData}
                          style={styles.chart}>
                          <Bar dataKey='amt' fill='#78bdc4'/>
                          <XAxis dataKey='name' />
                          <YAxis />
                        </BarChart>
                        {cpuLegend}
                      </Col>
                    </Row>
                    <Row>
                      <Col md={1}></Col>
                      <Col md={5} styles={styles.genderPie}>
                        <h3><b>Households with Internet</b></h3>
                        <PieChart
                          height={250}
                          width={300}
                          style={styles.chart}>
                          <Pie data={internetData} outerRadius={80}
                            fill='#8884d8'>
                            <Cell fill={'#78bdc4'} />
                            <Cell fill={'#ea1f28'} />
                          </Pie>
                          <Tooltip/>
                          <Legend/>
                        </PieChart>
                      </Col>
                      <Col md={5} style={styles.genderPie}>
                        <h3><b>Internet Breakdown</b></h3>
                        <BarChart
                          width={350}
                          height={250}
                          data={internetTypeData}
                          style={styles.chart}>
                          <Bar dataKey='amt' fill='#78bdc4'/>
                          <XAxis dataKey='name' />
                          <YAxis />
                        </BarChart>
                        {internetLegend}
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey={5} title="Income and Education">
                    <Row>
                      <Col md={1}></Col>
                      <Col md={10}>
                        <h3><b>Income Breakdown</b></h3>
                        <BarChart
                          width={700}
                          height={250}
                          data={this.state.incomeData}
                          style={styles.chart}>
                          <Bar dataKey='amt' fill='#78bdc4'/>
                          <XAxis dataKey="name" />
                          <YAxis />
                        </BarChart>
                        <Tooltip/>
                      </Col>
                    </Row>
                    <h3>Legend</h3>
                    <p><b>Income: Population</b></p>
                    <p>(Income values in 10,000&#39;s)</p>
                    <Row>
                      {incomeLegend}
                    </Row>
                    <Row>
                      <Col md={1}></Col>
                      <Col md={10}>
                        <h3><b>Education Breakdown</b></h3>
                        <BarChart
                          width={700}
                          height={250}
                          data={this.state.educationData}
                          style={styles.chart}>
                          <Bar dataKey='amt' fill='#ea1f28'/>
                          <XAxis dataKey="name" />
                          <YAxis />
                        </BarChart>
                        <Tooltip/>
                      </Col>
                    </Row>
                    <h3>Legend</h3>
                    <p><b>Education: Population</b></p>
                    <Row>
                      {educationLegend}
                    </Row>
                    <br></br><br></br>
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
