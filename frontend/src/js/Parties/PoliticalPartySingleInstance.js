/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
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
      }
    }

    return (
      <Link to={`/party/${this.props.party.path}`}>
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
                <h3>{this.props.party.name}</h3>
                <p>
                  <span style={styles.itemHeader}>
                    Number of representatives:
                  </span>
                  TODO FIX THIS
                </p>
                <p>
                  <span style={styles.itemHeader}>Party chair:</span>
                  {this.props.party.chair}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }
}
