import React, { Component } from 'react';
import header from './assets/images/header.png'
import './App.css';
import allReps from './assets/bioguide-endpoint.json';
import { Link } from 'react-router-dom'
import {Timeline} from 'react-twitter-widgets'
import { Grid, Row, Col } from 'react-bootstrap';
import './Bill.css'; 
import RepBills from './Bills.js'


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
      rep_data: {},
      bioguideid: "",
      party_id: null
    }
  }
  componentWillMount(){

    // get the data - in the future call the api
    this.setState({bioguideid: this.props.match.params.bioguideid})
    this.setState({rep_data: allReps[this.props.match.params.bioguideid]})
    var id = 0
    if(allReps[this.props.match.params.bioguideid]["party"] === "Republican"){
      id = 1
    }
    else if(allReps[this.props.match.params.bioguideid]["party"] === "Libertarian"){
      id = 2
    }
    this.setState({party_id: id})

  }

  render() {

    return (

      <div className="App">
      <header className="Rep-Details-header"> </header>
      <Row >
        <Col sm={12} md={4}>
          <img src={"https://theunitedstates.io/images/congress/225x275/" + this.state.bioguideid + ".jpg"}  alt="" style={styles.roundcorner} />
        </Col>
        <Col sm={12} md={4}>
          <font size="5">
          <div style={{textAlign: "left"}}>
          <p style={{paddingTop:"10px"}}>{this.state.rep_data["firstName"]} {this.state.rep_data["lastName"]}  </p>
          <p> <b>Party: </b> <Link
            to={`/party/${this.state.party_id}`}>
            {this.state.rep_data["party"]} </Link> 
          </p>
          <p> <b> State: </b> {this.state.rep_data["state"]}</p>
          <p> <b> District: </b> <Link
            to={`/districts/${this.state.rep_data["state"]}/${this.state.rep_data["district"]}`}>
            {this.state.rep_data["district"]} </Link> 
          </p>
          <a href={this.state.rep_data["url"]}>Website</a>
          </div>
          </font> 
        </Col>

        <Col sm={12} md={4}>
          <Timeline
           dataSource={{
             sourceType: "profile",
             screenName: this.state.rep_data["twitter"]
           }}
           options={{
             username: this.state.rep_data["twitter"],
             height: "400",
             width:"400"
           }}
         />
        </Col>
        
      </Row>
      <h3 class="bills-header">Bills Sponsored</h3>
      <Row style={{paddingLeft:"160px"}}>
         <RepBills bioguideid = {this.state.bioguideid} />
      </Row>
      </div>
    );
  }
}
