/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
/* eslint-enable no-unused-vars */

import axios from 'axios'
import url from '../../assets/resource.json'

import '../../assets/css/App.css'
import '../../assets/css/Bills.css'

/**
 * React component to represent bill cards for the representatives
 */
export default class RepBills extends Component {
  /**
   * Constructor to initialize state variables
   */
  constructor (props) {
    super(props)
    this.state = {
      bills_data: null,
      bill_colors: []
    }
    this.getRandomColor = this.getRandomColor.bind(this)
  }

  /**
   * Setting articles state to the data recieved from the parent component
   */
  componentWillMount () {
    this.setState({bills_data: this.props.data})
  }

  /**
   * Function to generate a random color for the bill cards
   */
  getRandomColor () {
    let letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  /**
    * Function to render the bill cards for representatives
    */
  render () {
    for (let i = 0; i < this.state.bills_data.length; i++) {
      let bill = this.state.bills_data[i]
      if (bill['latest_major_action'].length > 115) {
        bill['latest_major_action'] =
          bill['latest_major_action'].substring(0, 115) + '...'
      }
      axios.get(url.api_url + 'representative/' +
        this.state.bills_data[i]['sponsor_id'])
        .then((response) => {
          // eslint-disable-next-line
          this.state.bills_data[i]['sponsor'] =
            response.data['firstname'] + ' ' + response.data['lastname']
        })
      this.state.bill_colors.push(this.getRandomColor())
    }

    // Creates mapping between bill information and Bill frontend component
    let mapping = Object.keys(this.state.bills_data).map((item) =>
      <Col sm={12} md={4}>
        <div class='tile1 job-bucket'>
          <div class='front bill-single shadow'>
            <div class='contents'>
              <div class='backcolor'
                style={{backgroundColor: `${this.state.bill_colors[item]}`}}>
              </div>
              <h3>{this.state.bills_data[item]['number']}</h3>
              <h4>{this.state.bills_data[item]['short_title']}</h4>
            </div>
          </div>
          <div class='back'>
            <h4><b>Details</b></h4>
            <h3>
              <b> Introduced by: </b> <br/>
              {`Rep. ${this.state.bills_data[item]['sponsor']}`}
            </h3>
            <h3>
              <b> Date: </b>
              {this.state.bills_data[item]['introduced_date']}
            </h3>
            <h3>
              <b> Lastest Major Action: </b>
              {this.state.bills_data[item]['latest_major_action']}
            </h3>
            <a href={this.state.bills_data[item]['congressdotgov_url']}
              target="_blank"
              rel="noopener noreferrer">
              Congress.gov
            </a>
          </div>
        </div>
      </Col>
    )
    return (
      <Row>
        {mapping}
      </Row>
    )
  }
}
