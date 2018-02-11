import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom'
import {GridTile} from 'material-ui/GridList';

const styles = {
  hyperlink: {
    textDecoration: "none",
    color: "black"
  },
};

export default class RepresentativeInstance extends Component {
  render() {
    console.log(this.props.rep)
    return (
      <Link
        to={`/representatives/${this.props.rep.bioguide}`}
        style={styles.hyperlink}>
            <GridTile
              key={this.props.rep.bioguide}
              title={this.props.rep.firstName + " " + this.props.rep.lastName} >
                <img src={"https://theunitedstates.io/images/congress/225x275/" + this.props.rep.bioguide + ".jpg"}  alt="" />
           </GridTile>
      </Link>
    );
  }
}
