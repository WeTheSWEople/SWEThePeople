/* eslint-disable no-unused-vars */
import RepresentativeInstance from '../Representatives/RepresentativeInstance'
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Grid, Row, Col, ProgressBar, Tabs, Tab, ResponsiveEmbed} from 'react-bootstrap'
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
      all_states: null,
      cpuLegend: null,
      internetLit: null,
      iLegend: null,
      incomeData: null
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

      let result = []
      let legendTemp = []
      if(response.data.population_american_indian_and_alaska_native !== null){
        result.push({'name': 'AIAAN', 'amt': response.data.population_american_indian_and_alaska_native})
        legendTemp.push({name: 'AIAAN', value: 'American Indian And Alaska Native (' + response.data.population_american_indian_and_alaska_native  + ')'})
      }
      if(response.data.population_asian !== null){
        result.push({'name': 'A', 'amt': response.data.population_asian})
        legendTemp.push({name: 'A', value: 'Asian (' + response.data.population_asian + ')'})
      }
      if(response.data.population_black_or_african_american !== null){
        result.push({'name': 'BOAA', 'amt': response.data.population_black_or_african_american})
        legendTemp.push({name: 'BOAA', value: 'Black Or African American (' + response.data.population_black_or_african_american + ')'})
      }
      if(response.data.population_native_hawaiian_and_other_pacific_islander !== null){
        result.push({'name': 'NHAOPI', 'amt': response.data.population_native_hawaiian_and_other_pacific_islander})
        legendTemp.push({name: 'NHAOPI', value: 'Native Hawaiian And Other Pacific Islander (' + response.data.population_native_hawaiian_and_other_pacific_islander + ')'})
      }
      if(response.data.population_some_other_race !== null){
        result.push({'name': 'SOR', 'amt': response.data.population_some_other_race})
        legendTemp.push({name: 'SOR', value: 'Some Other Race (' + response.data.population_some_other_race + ')'})
      }
      if(response.data.population_two_or_more_races !== null){
        result.push({'name': 'TR', 'amt': response.data.population_two_or_more_races})
        legendTemp.push({name: 'TR', value: 'Two or More Races (' + response.data.population_two_or_more_races + ')'})
      }
      if(response.data.population_white !== null){
        result.push({'name': 'W', 'amt': response.data.population_white})
        legendTemp.push({name: 'W', value: 'White (' + response.data.population_white + ')'})
      }

      this.setState({races_pop: result})
      this.setState({legend: legendTemp})

      let tlit = []
      let cLegendTemp = []
      if(response.data.computers_has_one_or_more !== null){
        tlit.push({'name': 'One or more', 'amt': response.data.computers_has_one_or_more})
      }
      if(response.data.computers_none !== null){
        tlit.push({'name': 'None', 'amt': response.data.computers_none})
      }
      if(response.data.computers_has_desktop_laptop !== null){
        tlit.push({'name': 'Desktop/Laptop', 'amt': response.data.computers_has_desktop_laptop})
        cLegendTemp.push({name: 'D/L', value: 'Desktops or Laptops (' + response.data.computers_has_desktop_laptop + ')'})
      }
      if(response.data.computers_has_smartphone !== null){
        tlit.push({'name': 'Smartphone', 'amt': response.data.computers_has_smartphone})
        cLegendTemp.push({name: 'S', value: 'Smartphones (' + response.data.computers_has_smartphone + ')'})
      }
      if(response.data.computers_has_tablet !== null){
        tlit.push({'name': 'Tablet', 'amt': response.data.computers_has_tablet})
        cLegendTemp.push({name: 'T', value: 'Tablets (' + response.data.computers_has_tablet + ')'})
      }
      if(response.data.computers_has_other !== null){
        tlit.push({'name': 'Other', 'amt': response.data.computers_has_other})
        cLegendTemp.push({name: 'O', value: 'Other (' + response.data.computers_has_other + ')'})
      }

      this.setState({cpuLegend: cLegendTemp})
      this.setState({techLiteracy: tlit})

      let internet = []
      let iLegendTemp = []
      if(response.data.internet_has !== null){
        internet.push({'name': 'Has internet', 'amt': response.data.internet_has})
      }
      if(response.data.internet_none !== null){
        internet.push({'name': 'Does not have internet', 'amt': response.data.internet_none})
      }
      if(response.data.internet_has_dialup !== null){
        internet.push({'name': 'Has dialup', 'amt': response.data.internet_has_dialup})
        iLegendTemp.push({name: 'D', value: 'Dialup (' + response.data.internet_has_dialup + ')'})
      }
      if(response.data.internet_has_broadband !== null){
        internet.push({'name': 'Has broadband', 'amt': response.data.internet_has_broadband})
        iLegendTemp.push({name: 'B', value: 'Broadband (' + response.data.internet_has_broadband + ')'})
      }
      if(response.data.internet_has_cellular_data !== null){
        internet.push({'name': 'Has cellular data', 'amt': response.data.internet_has_cellular_data})
        iLegendTemp.push({name: 'CD', value: 'Cellular Data (' + response.data.internet_has_cellular_data + ')'})
      }
      if(response.data.internet_has_satellite !== null){
        internet.push({'name': 'Has satellite internet', 'amt': response.data.internet_has_satellite})
        iLegendTemp.push({name: 'S', value: 'Satellite (' + response.data.internet_has_satellite + ')'})
      }

      this.setState({iLegend: iLegendTemp})
      this.setState({internetLit: internet})

      let income = []
      if(response.data.income_none !== null){
        income.push({'name': '0', 'amt': response.data.income_none})
      }
      if(response.data.income_9999_less !== null){
        income.push({'name': '1-10', 'amt': response.data.income_9999_less})
      }
      if(response.data.income_10000_14999 !== null){
        income.push({'name': '10-15', 'amt': response.data.income_10000_14999})
      }
      if(response.data.income_15000_19999 !== null){
        income.push({'name': '15-20', 'amt': response.data.income_15000_19999})
      }
      if(response.data.income_20000_24999 !== null){
        income.push({'name': '20-25', 'amt': response.data.income_20000_24999})
      }
      if(response.data.income_25000_29999 !== null){
        income.push({'name': '25-30', 'amt': response.data.income_25000_29999})
      }
      if(response.data.income_30000_34999 !== null){
        income.push({'name': '30-35', 'amt': response.data.income_30000_34999})
      }
      if(response.data.income_35000_39999 !== null){
        income.push({'name': '35-40', 'amt': response.data.income_35000_39999})
      }
      if(response.data.income_40000_44999 !== null){
        income.push({'name': '40-45', 'amt': response.data.income_40000_44999})
      }
      if(response.data.income_45000_49999 !== null){
        income.push({'name': '45-50', 'amt': response.data.income_45000_49999})
      }
      if(response.data.income_50000_59999 !== null){
        income.push({'name': '50-60', 'amt': response.data.income_50000_59999})
      }
      if(response.data.income_60000_74999 !== null){
        income.push({'name': '60-75', 'amt': response.data.income_60000_74999})
      }
      if(response.data.income_75000_99999 !== null){
        income.push({'name': '75-100', 'amt': response.data.income_75000_99999})
      }
      if(response.data.income_100000_124999 !== null){
        income.push({'name': '100-125', 'amt': response.data.income_100000_124999})
      }
      if(response.data.income_125000_149999 !== null){
        income.push({'name': '125-150', 'amt': response.data.income_125000_149999})
      }
      if(response.data.income_150000_199999 !== null){
        income.push({'name': '150-200', 'amt': response.data.income_150000_199999})
      }
      if(response.data.income_200000_more !== null){
        income.push({'name': '>200', 'amt': response.data.income_200000_more})
      }

      this.setState({incomeData: income})

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
      let repsGrid = <RepresentativeInstance rep={this.state.rep_data} party_name = {this.state.party_data[this.state.rep_data.party_id][0]}  />

      let legend = null
      legend = Object.keys(this.state.legend).map((item) =>
        <p style={{textAlign: 'left', fontSize: '12px', marginLeft: '60px'}}> <b>{this.state.legend[item]['name']}</b> :
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
      let img_src = "https://www.govtrack.us/congress/members/embed/mapframe?state=" + this.state.district_state + "&district=" + this.state.district_num
      if (this.state.district_num == "At-Large"){
        img_src = "https://www.govtrack.us/congress/members/embed/mapframe?state=" + this.state.district_state + "&district=" + 0
      }

      let cpuData = []
      let techPopulation = this.state.techLiteracy[0].amt + this.state.techLiteracy[1].amt
      cpuData.push({'name': '(' + (this.state.techLiteracy[0].amt /  techPopulation * 100).toFixed(2) + '%)' + ' Households with one or more', 'value': this.state.techLiteracy[0].amt})
      cpuData.push({'name': '(' + (this.state.techLiteracy[1].amt /  techPopulation * 100).toFixed(2) + '%)' + ' Households with none', 'value': this.state.techLiteracy[1].amt})

      let cpuTypeData = []
      cpuTypeData.push({'name': 'D/L', 'amt': this.state.techLiteracy[2].amt})
      cpuTypeData.push({'name': 'S', 'amt': this.state.techLiteracy[3].amt})
      cpuTypeData.push({'name': 'T', 'amt': this.state.techLiteracy[4].amt})
      cpuTypeData.push({'name': 'Other', 'amt': this.state.techLiteracy[5].amt})

      let cpuLegend = null
      cpuLegend = Object.keys(this.state.cpuLegend).map((item) =>
        <p style={{textAlign: 'left', fontSize: '12px', marginLeft: '60px'}}> <b>{this.state.cpuLegend[item]['name']}</b> :
        {` `}
        {this.state.cpuLegend[item]['value']}</p>
      )

      let internetData = []
      let internetPopulation = this.state.internetLit[0].amt + this.state.internetLit[1].amt
      internetData.push({'name': '(' + (this.state.internetLit[0].amt /  internetPopulation * 100).toFixed(2) + '%)' + ' Households with internet access', 'value': this.state.internetLit[0].amt})
      internetData.push({'name': '(' + (this.state.internetLit[1].amt /  internetPopulation * 100).toFixed(2) + '%)' + ' Households with no internet access', 'value': this.state.internetLit[1].amt})

      let internetTypeData = []
      internetTypeData.push({'name': 'D', 'amt': this.state.internetLit[2].amt})
      internetTypeData.push({'name': 'B', 'amt': this.state.internetLit[3].amt})
      internetTypeData.push({'name': 'CD', 'amt': this.state.internetLit[4].amt})
      internetTypeData.push({'name': 'S', 'amt': this.state.internetLit[5].amt})

      let internetLegend = null
      internetLegend = Object.keys(this.state.iLegend).map((item) =>
        <p style={{textAlign: 'left', fontSize: '12px', marginLeft: '60px'}}> <b>{this.state.iLegend[item]['name']}</b> :
        {` `}
        {this.state.iLegend[item]['value']}</p>
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
                  <p><font size='4'>
                  <b>Wikipedia: </b>
                    <a href = {this.state.district_data.wikipedia_link} target="_blank" > {this.state.district_state +'- District '+this.state.district_num} </a>
                  </font></p>
                </div>
              </div>
            </Col>
            <Col sm={12} md={7}>
              <div style={styles.box}>
                <Tabs defaultActiveKey={5} id="uncontrolled-tab-example">
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
                          <h3><b>{this.state.party_data[this.state.rep_data['party_id']][0]}</b></h3>
                        </Link>
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey={2} title="District Interactive Map">
                  <Row style={styles.tabBox}>
                      <Col md={12} style={styles.genderPie}>
                        <div style={{ width: 'auto', height: '80%'}}>
                          <ResponsiveEmbed a16by9>
                            <embed type="image/svg+xml" src={img_src} />
                          </ResponsiveEmbed>
                        </div>
                      </Col>
                   </Row>
                  </Tab>
                  <Tab eventKey={3} title="Population Breakdown">
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
                        {legend}
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey={4} title="Technology Literacy">
                    <Row style={styles.tabBox}>
                      <Col md={1}></Col>
                      <Col md={5} styles={styles.genderPie}>
                        <h3><b>Households with Computers</b></h3>
                        <PieChart
                          height={250}
                          width={300}
                          style={styles.chart}>
                          <Pie
                          data={cpuData}
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
                        <h3><b>Computer Breakdown</b></h3>
                        <BarChart
                          width={350}
                          height={250}
                          data={cpuTypeData}
                          style={styles.chart}>
                        <Bar dataKey='amt' fill='#78bdc4'/>
                        <XAxis dataKey="name" />
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
                          <Pie
                          data={internetData}
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
                        <h3><b>Internet Breakdown</b></h3>
                        <BarChart
                          width={350}
                          height={250}
                          data={internetTypeData}
                          style={styles.chart}>
                        <Bar dataKey='amt' fill='#78bdc4'/>
                        <XAxis dataKey="name" />
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
                      <h3><b>Internet Breakdown</b></h3>
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
