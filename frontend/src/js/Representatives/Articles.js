/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
/* eslint-enable no-unused-vars */

import moment from 'moment'

import '../../assets/css/App.css'
import '../../assets/css/Bills.css'

export default class RepArticles extends Component {
  constructor (props) {
    super(props)
    this.state = {
      articles: null,
      bill_colors: []
    }
  }
  componentWillMount () {
    this.setState({articles: this.props.data})
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

  titleCase (str) {
    str = str.toLowerCase().split(' ')
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)
    }
    return str.join(' ')
  }

  render () {
    this.state.articles = this.state.articles.slice(0, 3)
    for (let i = 0; i < this.state.articles.length; i++) {
      this.state.articles[i]['date'] =
        moment(this.state.articles[i]['date']).format('M/D/YYYY')
    }
    this.state.bill_colors.push(this.getRandomColor())

    let mapping = Object.keys(this.state.articles).map((item) =>
      <Col sm={12} md={4}>
        <div class='tile1 job-bucket' >
          <div class='front'>
            <div class='contents'>
              <div class='backcolor'
                style={{backgroundColor: `${this.state.bill_colors[item]}`}}>
              </div>
              <h3>{this.state.articles[item]['site']}</h3>
              <h4>{this.state.articles[item]['title']}</h4>
            </div>
          </div>
          <div class='back'>
            <h3>
              <b> Author: </b>
              {this.titleCase(this.state.articles[item]['author'])}
            </h3>
            <h3>
              <b> Date: </b>
              {this.state.articles[item]['date']}
            </h3>
            <h3>
              {this.state.articles[item]['text']}
            </h3>
            <a href={this.state.articles[item]['url']}>
              Link
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
