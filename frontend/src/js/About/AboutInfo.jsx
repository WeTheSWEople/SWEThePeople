import React, {Component} from 'react'
import {Row, Col} from 'react-bootstrap'
import '../../assets/css/App.css'
import '../../assets/css/About.css'

/*
 * Component that renders the cards with information about the website.
 */
export default class AboutInfo extends Component{
	render (){
		return(
			<div>
			<h1 className="about-title">swethepeople.me</h1>
	        <h3>Brought to you by WeTheSWEople</h3>
			<Row className='about-info'>
	          <Col md={4}>
	            <div className='faq-box'>
	              <h2 className='faq-title'>Our Site</h2>
	              <h4>
	                SWEThePeople provides information and resources for
	                anyone interested in the members of United States House
	                of Representatives. This site provides information about
	                representatives, their districts, and parties.
	              </h4>
	            </div>
	          </Col>

	          <Col md={4}>
	            <div className='faq-box'>
	              <h2 className='faq-title'>Our Data</h2>
	              <h4>
	                The site combines information about legislators with
	                U.S. Census data, providing visitors with a better
	                understanding of the intersection between party, state,
	                and demographics.
	              </h4>
	            </div>
	          </Col>

	          <Col md={4}>
	            <div className='faq-box'>
	              <h2 className='faq-title'>Our Result</h2>
	              <h4>
	                Our website, by combining district party control and
	                demographic and age information, displays an interesting
	                corrolation between the two. Thus, SWEThePeople is a
	                valuable resource for anyone interested in studying party
	                and demographics in modern American politics.
	              </h4>
	            </div>
	          </Col>
	        </Row>
			</div>

		)
	}
}
