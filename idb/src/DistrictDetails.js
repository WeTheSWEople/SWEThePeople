import React, { Component } from 'react';
import header from './assets/images/header.png'
import './App.css';
import stateDistrict from './assets/data/census_data.json';
import districtRep from './assets/data/district_rep.json';
import { Link } from 'react-router-dom'
import {Timeline} from 'react-twitter-widgets'
import { Grid, Row, Col, ProgressBar } from 'react-bootstrap';
import allReps from './assets/bioguide-endpoint.json';
import states from './assets/data/state.json'
import RepresentativeInstance from './RepresentativeInstance'
import './DistrictDetails.css';
import {PieChart, BarChart} from 'react-easy-chart';


const styles = {
    imgStyle: {
        width:"100%",
        
        height:"100%"
    }
}

export default class RepresentativeDetails extends Component {
  constructor(props){

    super(props)
    this.state = {
      error: false,
      district_data: {},
      district_num: "",
      district_state: "",
      bioguide: "",
      rep_data : {},
      races_pop : {},
      party_image: {},
      legend:{}
    }
  }
  componentWillMount(){

    // get the data - in the future call the api
    var state = this.props.match.params.districtid
    var number = this.props.match.params.districtnum
    var bio_guide = districtRep[state][number]["representative-bioguide"]
    this.setState({district_num: number})
    this.setState({district_state: state})
    this.setState({district_data: stateDistrict[state][number]})
    this.setState({bioguide: bio_guide})
    this.setState({rep_data: allReps[bio_guide]})

    // set party image
    var party = allReps[bio_guide]["party"]
    if(party === "Democrat"){
      this.setState({party_image: "Democratic"})
    }
    else if(party === "Libertarian"){
      this.setState({party_image: "Libertarian"})
    }
    else{
      this.setState({party_image: "Republican"})
    }

    // data for the bar graph
    var one_race = stateDistrict[state][number]["race"]["one-race"]
    var result = []
    var legend_temp = []
    for (var key in one_race){
      if (key != "total"){
        // format the labels
        var str_split = key.split("-").map(function(word){
          return (word.charAt(0).toUpperCase())
        })

        var format_words = key.split("-").map(function(word){
          return (word.charAt(0).toUpperCase()) + word.slice(1)
        })

        str_split = str_split.join("")
        format_words = format_words.join(" ")
        var temp = {}
        temp["x"] = str_split
        temp["y"] = one_race[key]
        legend_temp.push({"key": str_split, "value":format_words})
        result.push(temp)
      }
    }
    var temp = {}
    temp["x"] = "TR"
    temp["y"] = stateDistrict[state][number]["race"]["two-or-more-races"]
    result.push(temp)
    legend_temp.push({key: "TR", value:"Two or More Races"})
    this.setState({races_pop: result})
    this.setState({legend: legend_temp})
    console.log(legend_temp)

  }

  render() {

    var reps_grid = <div class="col-sm-6">
            <RepresentativeInstance rep={this.state.rep_data} />
    </div>

    let legend = null
    legend = Object.keys(this.state.legend).map((item) =>
            <p style={{textAlign: "left"}}> <b>{this.state.legend[item]["key"]}</b> : {this.state.legend[item]["value"]}</p>
        )
    console.log(legend)

    var gender_pop_data = []
    
    var population = this.state.district_data["population"]
    var male = {}
    male["key"] = "Male (" + (population["male"]/population["total"] * 100).toFixed(2) + "%)"
    male["value"] = population["male"]
    male["color"] = "#abcc84"

    var female = {}
    female["key"] = "Female (" + (population["female"]/population["total"] * 100).toFixed(2) + "%)"
    female["value"] = population["female"]
    female["color"] = "#aaac84"
    gender_pop_data.push(male)
    gender_pop_data.push(female)


    return (

      <div className="App">
        <header className="Rep-Details-header"> </header>

        <Row >
          <h1><font size="8"><b>{states[this.state.district_state]} District {this.state.district_num}</b></font></h1>
          <br></br><br></br>
          <Col sm={6} md={6}>
          
            <img className="district-map-card"src={require("./assets/images/districts/"  + this.state.district_state + this.state.district_num +  ".png")}
                                           width="500px" height="350px" marginLeft="25px"/>
          
          </Col>
          <Col sm={6} md={6}>
            <div style={{textAlign: "left", padding:"80px"}}>
            <p><font size="5"><b>Total Population: </b> {this.state.district_data["population"]["total"]} people</font></p>
            <p><font size="5"><b>Median Age: </b> {this.state.district_data["median-age"]["both-sexes"]} years</font></p>
            <p><font size="5"><b>Median Age (Male): </b> {this.state.district_data["median-age"]["male"]} years</font></p>
            <p><font size="5"><b>Median Age (Female): </b> {this.state.district_data["median-age"]["female"]} years</font></p>
            </div>
      


          </Col>
        </Row>
        <br></br><br></br>
        <h3 class="bills-header"><b>Statistics for District {this.state.district_num}</b></h3>
        <Row >
          <Col sm={5} md={5}>
           <PieChart labels
              padding={30}
              data={gender_pop_data}
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
            <div style={{marginTop:"75px", marginRight:"40px"}}><h5> <b>Legend: </b></h5>
            {legend}
            </div>
          </Col>


        </Row>
        <h3 class="bills-header"><b>Representative</b></h3>
       <div class="row">
          <div class="col-md-5 col-md-offset-2">
              {reps_grid}
          </div>
          <div class="col-md-3">
              <Link to={`/party/${this.state.rep_data["party"]}`} >
                  <img src={require("./assets/images/parties/" + this.state.party_image + ".png")}
                                           className="img-responsive" style={styles.imgStyle} />
                  <h3><b>{this.state.rep_data["party"]}</b></h3>
             </Link>
          </div>
        </div>
        <br></br>
      </div>

  );
  }
}
