import React, { Component } from 'react';
import header from './assets/images/header.png'
import './App.css';
import allReps from './assets/bioguide-endpoint.json';
import { Link } from 'react-router-dom'
import {Timeline} from 'react-twitter-widgets'

const styles = {
  hyperlink: {
    textDecoration: "none",
    color: "black"
  },
};

export default class RepresentativeDetails extends Component {
  constructor(props){
    super(props)
    this.state = {
      error: false,
      rep_data: {},
      bioguideid: ""
    }
  }
  componentWillMount(){

    // get the data - in the future call the api
    this.setState({bioguideid: this.props.match.params.bioguideid})
    this.setState({rep_data: allReps[this.props.match.params.bioguideid]})

  }

  render() {
    return (
      <div className="App">
      <header className="Rep-Details-header-white"> </header>
      <img src={"https://theunitedstates.io/images/congress/225x275/" + this.state.bioguideid + ".jpg"}  alt="" />
      <p style={{paddingTop:"10px"}}>{this.state.rep_data["first-name"]} {this.state.rep_data["last-name"]}   </p>
      <p> Party: <Link
        to={`/parties/${this.state.rep_data["party"]}`}>
        {this.state.rep_data["party"]} </Link>
      </p>
      <p> State: {this.state.rep_data["state"]}</p>
      <p> District: <Link
        to={`/districts/${this.state.rep_data["state"]}/${this.state.rep_data["district"]}`}>
        {this.state.rep_data["district"]} </Link>
      </p>
      <a href={this.state.rep_data["url"]}>Website</a>
      <br></br>
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
      </div>
    );
  }
}
