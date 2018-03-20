/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
/* eslint-enable no-unused-vars */

import '../../assets/css/App.css'
import '../../assets/css/Bills.css'

import allReps from '../../assets/bioguide-endpoint.json'

export default class RepBills extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bills_data: null,
      bill_colors: []
    }
    this.getRandomColor = this.getRandomColor.bind(this)
  }
  componentWillMount () {
    // get the data - in the future call the api
    //this.setState({bioguideid: this.props.bioguideid})
    this.setState({bills_data: this.props.data})
    // shorten the latest major action
  }

  getRandomColor () {
    let letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  render () {
    console.log("BILS DATA: " + this.state.bills_data)
    for (let i = 0; i < this.state.bills_data.length; i++) {
      let bill = this.state.bills_data[i]
      if (bill['latest_major_action'].length > 115) {
        bill['latest_major_action'] =
          bill['latest_major_action'].substring(0, 115) + '...'
      }
      this.state.bill_colors.push(this.getRandomColor())
    }

    let mapping = Object.keys(this.state.bills_data).map((item) =>
      <Col sm={12} md={4}>
        <div class='tile1 job-bucket' >
          <div class='front'>
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
              <b> Introduced by: </b>
              {this.state.bills_data[item]['sponsor_name']}
            </h3>
            <h3>
              <b> Date: </b>
              {this.state.bills_data[item]['introduced_date']}
            </h3>
            <h3>
              <b> Lastest Major Action: </b>
              {this.state.bills_data[item]['latest_major_action']}
            </h3>
            <a href={this.state.bills_data[item]['congressdotgov_url']}>
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
