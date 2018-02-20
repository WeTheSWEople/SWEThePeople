import '../../assets/css/App.css';
import '../../assets/css/RepresentativeInstance.css';
import React, { Component } from 'react';
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
    return (
      <Link
        to={`/representatives/${this.props.rep.bioguide}`}
        style={styles.hyperlink}>
          <GridTile
            key={this.props.rep.bioguide}
            class="tile" >
            <img src={"https://theunitedstates.io/images/congress/225x275/" + this.props.rep.bioguide + ".jpg"}  alt={this.props.rep.firstName} class="rep_img" />
            <div class="rep_info">
            <h3 class="title">{this.props.rep.firstName + " " + this.props.rep.lastName}</h3>
            <h4 class="party">{this.props.rep.party}</h4>
            <h4 class="district"><i>{this.props.rep.state + " - " + this.props.rep.district}</i></h4>
            </div>
          </GridTile>
      </Link>
    );
  }
}
