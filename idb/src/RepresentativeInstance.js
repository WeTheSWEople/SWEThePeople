import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom'
import {GridList, GridTile} from 'material-ui/GridList';

const styles = {
  hyperlink: {
    textDecoration: "none",
    color: "black"
  },
};

export default class RepresentativeInstance extends Component {
  constructor(props) {
    super(props);

  }
  render() {
    console.log("FROM REP: " + this.props.rep)
    return (
      <Link 
        to={`/representative/${this.props.rep.bioguide}`} 
        style={styles.hyperlink}>
            <GridTile
              key={this.props.rep.bioguide}
              title={this.props.rep.firstName} >
                <img src={"https://theunitedstates.io/images/congress/225x275/" + this.props.rep.bioguide + ".jpg"}  alt="" />
           </GridTile>
      </Link>
    );
  }
}

