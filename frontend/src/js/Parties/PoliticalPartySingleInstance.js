/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Highlighter from "react-highlight-words";

/* eslint-enable no-unused-vars */

import '../../assets/css/PoliticalPartyInstance.css'

export default class PoliticalPartySingleInstance extends Component {
  render() {
    const styles = {
      highlight: {
        fontWeight: 'bold',
        backgroundColor: '#FFFF00'
      }
    }

    let num_reps = 0
    if (this.props.num_reps) {
      num_reps = this.props.num_reps
    }

    let searched = ''
    let query = []
    if(this.props.search !== null && this.props.search !== undefined) {
      query = this.props.search.split(" ")
      query.push(this.props.search)
      searched =  <p>
                      Representatives in search: {num_reps}
                  </p>

    }

    if (this.props.search === undefined) {
      searched =  <p>
                      Representatives: {num_reps}
                  </p>
    }

    let chair = ''
    if (this.props.party.chair === '') {
      chair = <p>
                Party chair:<br /> None
              </p>
    } else {
      chair = <p>
                Party chair:<br />
                <Highlighter
                    searchWords={query}
                    autoEscape={true}
                    highlightStyle={styles.highlight}
                    textToHighlight={this.props.party.chair} />
              </p>
    }


    return (
      <Link to={`/party/${this.props.party.path}`} className='search-card-link'>
        <div className='search-card party-search-card'>
          <img src={require('../../assets/images/parties/index/' +
            this.props.party.path + '.png')}
          className='img-responsive'
          alt={this.props.party.path} />

          <div>
            <h3>
              <Highlighter
                searchWords={query}
                autoEscape={true}
                highlightStyle={styles.highlight}
                textToHighlight={this.props.party.name} />
            </h3>
            {searched}
            {chair}
          </div>
        </div>
      </Link>
    )
  }
}
