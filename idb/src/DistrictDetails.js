import React, { Component } from 'react';
import header from './assets/images/header.png'
import './App.css';
import stateDistrict from './assets/data/census-data.json';
import { Link } from 'react-router-dom'
import {Timeline} from 'react-twitter-widgets'
import { Grid, Row, Col, ProgressBar } from 'react-bootstrap';
import allReps from './assets/bioguide-endpoint.json';
import states from './assets/data/state.json'
import RepresentativeInstance from './RepresentativeInstance'
import './DistrictDetails.css';


const styles = {
  hyperlink: {
  textDecoration: "none",
  color: "black"
  },
  roundcorner:{
    borderRadius: "13%"
  },
};

export default class RepresentativeDetails extends Component {
  constructor(props){

    super(props)
    this.state = {
      error: false,
      district_data: {},
      district_num: "",
      district_state: "",
    }
  }
  componentWillMount(){

    // get the data - in the future call the api
    this.setState({district_num: this.props.match.params.districtnum})
    this.setState({district_state: this.props.match.params.districtid})
    this.setState({district_data: stateDistrict[this.props.match.params.districtid][this.props.match.params.districtnum]})
    this.setState({rep_data: allReps[stateDistrict[this.props.match.params.districtid][this.props.match.params.districtnum]["bioguide"]]})
  }

  render() {
    var reps_grid = <div class="col-sm-3 district-rep-card">
            <RepresentativeInstance rep={this.state.reps[key]} />
    </div>

    console.log(this.state.district_state + " " + this.state.district_num + JSON.stringify(this.state.district_data["representative"]))
    return (

      <div className="App">
        <header className="Rep-Details-header"> </header>
        <Row >
          <Col sm={12} md={4}>
          <h1>{states[this.state.district_state]} District {this.state.district_num}</h1>
          <img src={"https://theunitedstates.io/images/congress/225x275/" + this.state.district_data["bioguide"] + ".jpg"}  height="110px" width="90px" alt="" style={styles.roundcorner} />
          <div>{this.state.district_data["representative"]} </div>
          </Col>
        </Row>
        <Row >
          <Col sm={6} md={6}>
          <h4><b>Population: </b>{this.state.district_data["population"]["total"]} </h4>
          <img src={"https://theunitedstates.io/images/congress/225x275/" + this.state.district_data["bioguide"] + ".jpg"}  height="110px" width="90px" alt="" style={styles.roundcorner} />
          <div>{this.state.district_data["representative"]} </div>
          </Col>
          <Col sm={6} md={6}>
          <h1>{states[this.state.district_state]} District {this.state.district_num}</h1>
          <img src={"https://theunitedstates.io/images/congress/225x275/" + this.state.district_data["bioguide"] + ".jpg"}  height="110px" width="90px" alt="" style={styles.roundcorner} />
          <div>{this.state.district_data["representative"]} </div>
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={6}>
          {reps_grid}
          </Col>
        </Row>

      </div>
  );
  }
}