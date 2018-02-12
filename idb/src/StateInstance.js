import React, { Component } from 'react';
import './App.css';
import './RepresentativeInstance.css';
import { Link } from 'react-router-dom'
import {GridTile} from 'material-ui/GridList';

const styles = {
  hyperlink: {
	textDecoration: "none",
	color: "black"
  },
};

export default class StateInstance extends Component {
	constructor(props){
		super(props)
		this.state = {
			numReps : 0,
			numSenators: 0,

		}
	}
	componentWillMount(){
		let rep_json = require('./assets/data/rep_data/' + this.props.state + '.json')
		let senator_json = require('./assets/data/senate_data/' + this.props.state + '.json')
		if(rep_json["status"] === "OK"){
			this.setState({numReps: rep_json["results"].length})
		}
		if(senator_json["status"] === "OK"){
			this.setState({numSenators: senator_json["results"].length})
		}
	}
  render() {
	return (
	  <Link
		to={`/districts/${this.props.state}`}
		style={styles.hyperlink}>
		  <GridTile
			key={this.props.state}
			class="tile" >
			<div class="rep_info">
			<h3 class="title">{this.props.full_state}</h3>
			<h4 class="party">Districts: {this.state.numReps}</h4>
			<h4 class="district"><i>Senators: {this.state.numSenators}</i></h4>
			</div>
		  </GridTile>
	  </Link>
	);
  }
}
