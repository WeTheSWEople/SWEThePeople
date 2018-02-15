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
      party_image: {}
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
    if(this.state.rep_data["party"] == "Democrat"){
      this.setState({party_image: "Democratic"})
    }
    else if(this.state.rep_data["party"] == "Libertarian"){
      this.setState({party_image: "Libertarian"})
    }
    else{
      this.setState({party_image: "Republican"})
    }

    // data for the bar graph
    var one_race = stateDistrict[state][number]["race"]["one-race"]
    var result = []
    for (var key in one_race){
      if (key != "total"){
        // format the labels
        var str_split = key.split("-").map(function(word){
          return (word.charAt(0).toUpperCase())
        })
        str_split = str_split.join(" ")
        var temp = {}
        temp["x"] = str_split
        temp["y"] = one_race[key]
        result.push(temp)
      }
    }
    var temp = {}
    temp["x"] = "TwoRaces"
    temp["y"] = stateDistrict[state][number]["race"]["two-or-more-races"]
    result.push(temp)
    this.setState({races_pop: result})

  }

  render() {

    var reps_grid = <div class="col-sm-6 district-rep-card">
            <RepresentativeInstance rep={this.state.rep_data} />
    </div>


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
          <Col sm={12} md={12}>
          <h1>{states[this.state.district_state]} District {this.state.district_num}</h1>
          </Col>
        </Row>
        <h3 class="bills-header"><b>Statistics for the District</b></h3>
        <Row >
          <Col sm={6} md={6}>
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
          <Col sm={6} md={6}>
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

        </Row>
        <h3 class="bills-header"><b>Other Details</b></h3>
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
      </div>
  );
  }
}