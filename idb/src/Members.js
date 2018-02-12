import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

export default class Members extends Component {
	constructor(props){
		super(props)
	}
  render() {
		let mapping = Object.keys(this.props.swe_data).map((item) =>
	  <Col sm={12} md={4}>
	  <h3>{this.props.swe_data[item][0]} <br /></h3>
	  <p><img src={require("./assets/images/about/" + this.props.swe_data[item][5])} width='300' height='300' />
	  <br />
	  <br />
	  {this.props.swe_data[item][4]}<br />
	  Commits: {this.props.swe_data[item][1]} <br />
	  Issues: {this.props.swe_data[item][2]} <br />
	  Unit Tests: {this.props.swe_data[item][3]}</p>
	  </Col>
	)
	return (
	  <Grid>
			<Row>
			{mapping}
			</Row>
	  </Grid>
	);
  }
}
