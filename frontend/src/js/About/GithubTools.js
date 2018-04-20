import React, {Component} from 'react'
import {Row, Col} from 'react-bootstrap'

import '../../assets/css/App.css'
import '../../assets/css/About.css'
import url from '../../assets/resource.json'

/*
 * Component that renders the links for our github repo,
 * gitbook, travis, uml, and d3 visualization.
 */
export default class GithubTools extends Component{
	render (){
		return(
			<div className='github-info'>
			  <Row>
				<Col sm={6} smOffset={3}>
				  <Row className='github-counts'>
					<Col md={4}>
					  <div className='info-box'>
						<h4>Total Commits:</h4>
						<span className='right-info'>
						  {this.props.totalCommits}
						</span>
					  </div>
					</Col>
					<Col md={4}>
					  <div className='info-box'>
						<h4>Total Issues:</h4>
						<span className='right-info'>
						  {this.props.total_issues}
						</span>
					  </div>
					</Col>
					<Col md={4}>
					  <div className='info-box'>
						<h4>Total Unit Tests:</h4>
						<span className='right-info'>
						  {this.props.totalTests}
						</span>
					  </div>
					</Col>
				  </Row>
				</Col>
			  </Row>
			  <Row className='link-row'>
				<Col md={2} mdOffset={1}>
				  <p>
					<a href='https://github.com/WeTheSWEople/SWEThePeople/'
					  target="_blank" rel="noopener noreferrer">
					  <div className='link-box'>
						<img
						  src={require('../../assets/images/about/github.png')}
						  className='img-responsive' alt='GitHub logo'/>
						<p>GitHub Repository</p>
					  </div>
					</a>
				  </p>
				</Col>
				<Col md={2}>
				  <p>
					<a href='https://wethesweople.gitbooks.io/report/'
					  target="_blank" rel="noopener noreferrer">
					  <div className='link-box'>
						<img
						  src={require('../../assets/images/about/gitbook-logo.jpg')}
						  className='img-responsive' alt='Gitbook logo'/>
						<p>Technical Report</p>
					  </div>
					</a>
				  </p>
				</Col>
				<Col md={2}>
				  <a href='https://wethesweople.gitbooks.io/api/'
				    target="_blank" rel="noopener noreferrer">
					<div className='link-box'>
					  <img
					    src={require('../../assets/images/about/gitbook-logo.jpg')}
					    className='img-responsive' alt='Gitbook logo'/>
					  <p>API Documentation</p>
					</div>
				  </a>
				</Col>
				<Col md={2}>
				  <p>
					<a href={url.api_url}>
					  <div className='link-box'>
						<img
						  src={require('../../assets/images/about/api-image.png')}
						  className='img-responsive' alt='API logo'/>
						<p>API</p>
					  </div>
					</a>
				  </p>
				</Col>
				<Col md={2}>
				  <a
				    href='https://travis-ci.org/WeTheSWEople/SWEThePeople/builds'
				    target="_blank" rel="noopener noreferrer">
					<div className='link-box'>
					  <img
					    src={require('../../assets/images/about/travisci.png')}
					    className='img-responsive' alt='TravisCI logo'/>
					  <p>Travis CI</p>
					</div>
				  </a>
				</Col>
				<Col md={2} mdOffset={1}>
				  <p>
					<a
					  href='https://raw.githubusercontent.com/WeTheSWEople/SWEThePeople/master/UML/models.png'
					  target="_blank" rel="noopener noreferrer">
					  <div className='link-box'>
						<img src={require('../../assets/images/about/uml.png')}
						  className='img-responsive' alt='UML logo'/>
						<p>UML Diagram</p>
					  </div>
					</a>
				  </p>
				</Col>
				<Col md={2}>
				  <p>
					<a href='/visualization.html' target="_blank"
					  rel="noopener noreferrer">
					  <div className='link-box'>
						<img src={require('../../assets/images/about/d3.png')}
						  className='img-responsive' alt='UML logo'/>
						<p>Visualization</p>
					  </div>
					</a>
				  </p>
				</Col>
			  </Row>
			</div>

		)
	}
}
