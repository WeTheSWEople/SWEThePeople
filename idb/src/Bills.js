import React, { Component } from 'react';
import header from './assets/images/header.png'
import './App.css';
import allReps from './assets/bioguide-endpoint.json';
import { Grid, Row, Col } from 'react-bootstrap';
import './Bill.css';


export default class RepBills extends Component {
  constructor(props){
    super(props)
    this.state = {
      error: false,
      bills_data: {},
      bioguideid: "",
    }
  }
  componentWillMount(){

    // get the data - in the future call the api
    this.setState({bioguideid: this.props.bioguideid})
    this.setState({bills_data: allReps[this.props.bioguideid]["bills"]})
  	

  }

  render() {
  	console.log("bill data: " +  this.state.bills_data[0]["number"])
  	let mapping = Object.keys(this.state.bills_data).map((item) =>
  		<Col sm={12} md={4}>
              <div class="tile1 job-bucket">
                <div class="front">
                      <div class="contents">
                          <div class="backcolor"> </div>
                          <h3>{this.state.bills_data[item]["number"]}</h3>
                          <h4>{this.state.bills_data[item]["short_title"]}</h4>
                      </div>
                </div>
                <div class="back">
                      <h3>Details</h3>
                      <h3> Introduced by: {this.state.bills_data[item]["sponsor_name"]} </h3>
                      <h3> Date: {this.state.bills_data[item]["introduced_date"]} </h3>
                      <h3> Lastest Major Action: {this.state.bills_data[item]["latest_major_action"]} </h3>
                      <a href={this.state.bills_data[item]["congressdotgov_url"]}>Congress.gov</a>
                </div>
              </div>
       	</Col>
	)
  
    return (
      <Row>
      	{mapping}
       </Row>
    );
  }
}
