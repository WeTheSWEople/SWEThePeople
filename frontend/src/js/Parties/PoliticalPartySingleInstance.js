/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Highlighter from "react-highlight-words";

/* eslint-enable no-unused-vars */

import '../../assets/css/PoliticalPartyInstance.css'

export default class PoliticalPartySingleInstance extends Component {
  render() {
    const styles = {
      imgStyle: {
        width: '50%'
      },
      itemHeader: {
        marginRight: '5px'
      },
        highlight: {
        fontWeight: 'bold',
        backgroundColor: '#FFFF00'
      },
      hyperlink: {
        textDecoration: 'none',
        color: 'black'
      }
    }

    let num_reps = 0
    if (this.props.num_reps) {
      num_reps = this.props.num_reps
    }

    let query = []
    if(this.props.search !== null && this.props.search !== undefined) {
      query = this.props.search.split(" ")
      query.push(this.props.search)
    }

    return (
      <Link to={`/party/${this.props.party.path}`} style={styles.hyperlink}>
        <div className='row party-index-card'>
          <div className='col-md-8 col-md-offset-2'>
            <div className='row'>
              <div className='col-md-6'>
                <div className='center-div'>
                  <img src={require('../../assets/images/parties/index/' +
                    this.props.party.path + '.png')}
                  className='img-responsive'
                  style={styles.imgStyle}
                  alt={this.props.party.path} />
                </div>
              </div>

              <div className='col-md-6 party-index-name'>
                <h3>
                    <Highlighter
                      searchWords={query}
                      autoEscape={true}
                      highlightStyle={styles.highlight}
                      textToHighlight={this.props.party.name}
                    />
                </h3>
                <p>
                  <span style={styles.itemHeader}>
                    Number of representatives in this search:
                  </span>
                  {num_reps}
                </p>
                <p>
                  <span style={styles.itemHeader}>Party chair:</span>
                  <Highlighter
                      searchWords={query}
                      autoEscape={true}
                      highlightStyle={styles.highlight}
                      textToHighlight={this.props.party.chair}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }
}
