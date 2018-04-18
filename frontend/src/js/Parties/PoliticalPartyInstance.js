/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Link} from 'react-router-dom'
/* eslint-enable no-unused-vars */
import {Row, Col} from 'react-bootstrap'

import '../../assets/css/PoliticalPartyInstance.css'

export default class Parties extends Component {
  render () {
    const styles = {
      imgStyle: {
        width: '50%'
      },
      itemHeader: {
        marginRight: '5px'
      }
    }

    let mapping = Object.keys(this.props.party_data).map((key) =>
      <Link to={`/party/${this.props.party_data[key]['path']}`} key={key}>
        <Row className='party-index-card'>
          <Col md={8} mdOffset={2}>
            <Row>
              <Col md={6}>
                <div className='center-div'>
                  <img src={require('../../assets/images/parties/index/' +
                    this.props.party_data[key]['path'] + '.png')}
                  className='img-responsive'
                  style={styles.imgStyle}
                  alt={key} />
                </div>
              </Col>

              <Col md={6} className='party-index-name'>
                <h3>{this.props.party_data[key]['name']}</h3>
                <p>
                  <span style={styles.itemHeader}>
                    Number of representatives:
                  </span>
                  {this.props.party_data[key]['num_reps']}
                </p>
                <p>
                  <span style={styles.itemHeader}>Party chair:</span>
                  {this.props.party_data[key]['chair']}
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Link>
    )

    return (
      <div className='container'>
        {mapping}
      </div>
    )
  }
}
