/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
/* eslint-enable no-unused-vars */

import Highlighter from "react-highlight-words";

import '../../assets/css/RepresentativeInstance.css'

export default class RepresentativeSingleInstance extends Component {
  render() {
    const styles = {
      highlight: {
        fontWeight: 'bold',
        backgroundColor: '#FFFF00'
      }
    }

    let query = []
    if(this.props.search !== null && this.props.search !== undefined) {
      query = this.props.search.split(" ")
      query.push(this.props.search)
    }

    let borderStyle = {}
    if (this.props.party_color !== '') {
      borderStyle = {
        border: "3px solid " + this.props.party_color
      }
    }

    return (
      <Link to={`/representatives/${this.props.rep.bioguide}`}>
        <div className='search-card' style={borderStyle}>
          <img src={'https://theunitedstates.io/images/congress/225x275/' +
            this.props.rep.bioguide + '.jpg'}
          alt={this.props.rep.firstname + ' ' + this.props.rep.lastname}
          className='rep_img'
          onError={(e) => {e.target.src=require(
            '../../assets/images/reps/default.png')}} />

          <div className='rep_info'>
            <h3 className='title'>
              <Highlighter
                searchWords={query}
                autoEscape={true}
                highlightStyle={styles.highlight}
                textToHighlight={this.props.rep.firstname + ' ' +
                  this.props.rep.lastname} />
            </h3>
            <h4 className='party'>
              <Highlighter
                searchWords={query}
                autoEscape={true}
                highlightStyle={styles.highlight}
                textToHighlight={this.props.party_name} />
            </h4>
            <h4 className='district'>
              <i>
                <Highlighter
                  searchWords={query}
                  autoEscape={true}
                  highlightStyle={styles.highlight}
                  textToHighlight={this.props.rep.state + '-' +
                    this.props.rep.district} />
              </i>
            </h4>
          </div>
        </div>
      </Link>
    )
  }
}
