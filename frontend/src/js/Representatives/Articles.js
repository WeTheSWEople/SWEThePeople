/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Grid, Row, Col} from 'react-bootstrap'
/* eslint-enable no-unused-vars */

import '../../assets/css/App.css'
import '../../assets/css/Articles.css'

export default class RepArticles extends Component {
  constructor (props) {
    super(props)
    this.state = {
      articles: null,
    }
  }
  componentWillMount () {
    this.setState({articles: this.props.data})
    // shorten the latest major action
  }

  render () {
    this.state.articles = this.state.articles.slice(0, 3)
    for (let i = 0; i < 3; i++) {
      let article = this.state.articles[i]
      if (article['text'].length > 200) {
        article['text'] =
          article['text'].substring(0, 200) + '...'
      }
    }

    let mapping = Object.keys(this.state.articles).map((item) =>
      <Col sm={12} md={4}>
        <div class='tile1 job-bucket' >
          <div class='front'>
            <div class='contents'>
              <div class='backcolor'
                style={{backgroundColor: `#000000`}}>
              </div>
              <h4>{this.state.articles[item]['title']}</h4>
            </div>
          </div>
          <div class='back'>
            <h3>
              <b> Author: </b>
              {this.state.articles[item]['author']}
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
