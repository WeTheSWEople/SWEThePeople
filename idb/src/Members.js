import React, { Component } from 'react';


export default class Members extends Component {
	constructor(props){
		super(props)
	}
  render() {
	  console.log(this.props.swe_data)
	  let mapping = Object.keys(this.props.swe_data).map((item) =>
	  <p>{this.props.swe_data[item][0]} <br />
	  Commits: {this.props.swe_data[item][1]} <br />
	  Issues: {this.props.swe_data[item][2]} <br />
	  Unit Tests: {this.props.swe_data[item][3]}</p>
	)
	return (
	  <div>
	  {mapping}
	  </div>
	);
  }
}
