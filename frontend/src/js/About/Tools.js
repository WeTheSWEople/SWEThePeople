import React, {Component} from 'react'
import {Row, Col} from 'react-bootstrap'
import '../../assets/css/App.css'
import '../../assets/css/About.css'

/*
 * Component that renders cards with information of all the tools that we used.
 */
export default class Tools extends Component{
	render(){
		return(
			<div className='tools-div container'>
	          <div className='tools-header'>
	            <h2>Tools</h2>
	          </div>
	          <Row>
	            <a href='https://github.com/WeTheSWEople/SWEThePeople/'
	              target="_blank" rel="noopener noreferrer">
	              <Col sm={3}>
	                <div className='tools-card'>
	                  <img
	                    src={require('../../assets/images/about/github.png')}
	                    className='img-responsive' alt='GitHub logo'/>
	                  <h5>GitHub</h5>
	                  <p>
	                    Used to manage versions betwen different branches of
	                    the project.
	                  </p>
	                </div>
	              </Col>
	            </a>
	            <a href='https://www.gitbook.com/@wethesweople'
	              target="_blank" rel="noopener noreferrer">
	              <Col sm={3}>
	                <div className='tools-card'>
	                  <img
	                    src={require('../../assets/images/about/gitbook.png')}
	                    className='img-responsive' alt='Gitbook logo' />
	                  <h5>Gitbook</h5>
	                  <p>Used to document the project and its API.</p>
	                </div>
	              </Col>
	            </a>
	            <a href='https://reactjs.org/' target="_blank"
	              rel="noopener noreferrer">
	              <Col sm={3}>
	                <div className='tools-card'>
	                  <img
	                    src={require('../../assets/images/about/reactjs.png')}
	                    className='img-responsive' alt='ReactJS logo'/>
	                  <h5>ReactJS</h5>
	                  <p>The JavaScript library the site is built on.</p>
	                </div>
	              </Col>
	            </a>
	            <a href='https://aws.amazon.com/ec2/' target="_blank"
	              rel="noopener noreferrer">
	              <Col sm={3}>
	                <div className='tools-card'>
	                  <img src={require('../../assets/images/about/ec2.jpg')}
	                    className='img-responsive' alt='EC2 logo'/>
	                  <h5>Amazon EC2</h5>
	                  <p>Container being used to host the production site.</p>
	                </div>
	              </Col>
	            </a>
	            <a href='https://getbootstrap.com/' target="_blank"
	              rel="noopener noreferrer">
	              <Col sm={3}>
	                <div className='tools-card'>
	                  <img
	                    src={require('../../assets/images/about/bootstrap.png')}
	                    className='img-responsive' alt='Bootstrap logo'/>
	                  <h5>Bootstrap</h5>
	                  <p>CSS and JavaScript toolkit used to beautify pages.</p>
	                </div>
	              </Col>
	            </a>
	            <a href='http://flask.pocoo.org/' target="_blank"
	              rel="noopener noreferrer">
	              <Col sm={3}>
	                <div className='tools-card'>
	                  <img src={require('../../assets/images/about/flask.png')}
	                    className='img-responsive' alt='Flask logo'/>
	                  <h5>Python Flask</h5>
	                  <p>Web framework used for the production site.</p>
	                </div>
	              </Col>
	            </a>
	            <a href='https://www.nginx.com/' target="_blank"
	              rel="noopener noreferrer">
	              <Col sm={3}>
	                <div className='tools-card'>
	                  <img src={require('../../assets/images/about/nginx.png')}
	                    className='img-responsive' alt='NGINX logo'/>
	                  <h5>NGINX</h5>
	                  <p>Webserver to serve the production site.</p>
	                </div>
	              </Col>
	            </a>
	            <a href='https://www.slack.com/' target="_blank"
	              rel="noopener noreferrer">
	              <Col sm={3}>
	                <div className='tools-card'>
	                  <img src={require('../../assets/images/about/slack.png')}
	                    className='img-responsive' alt='Slack logo'/>
	                  <h5>Slack</h5>
	                  <p>
	                    Used to communicate between members to organize
	                    meetings and work.
	                  </p>
	                </div>
	              </Col>
	            </a>
	            <a href='https://aws.amazon.com/rds/' target="_blank"
	              rel="noopener noreferrer">
	              <Col sm={3}>
	                <div className='tools-card'>
	                  <img src={require(
	                    '../../assets/images/about/Amazon-RDS1.png')}
	                  className='img-responsive' alt='Slack logo'/>
	                  <h5>Amazon RDS</h5>
	                  <p>
	                    Used to host our backend database.
	                  </p>
	                </div>
	              </Col>
	            </a>
	            <a href='https://www.postgresql.org/' target="_blank"
	              rel="noopener noreferrer">
	              <Col sm={3}>
	                <div className='tools-card'>
	                  <img src={require('../../assets/images/about/post.png')}
	                    className='img-responsive' alt='Slack logo'/>
	                  <h5>PostgresSQL</h5>
	                  <p>
	                    Database management system used for our backend
	                    database
	                  </p>
	                </div>
	              </Col>
	            </a>
	            <a href='https://www.sqlalchemy.org/' target="_blank"
	              rel="noopener noreferrer">
	              <Col sm={3}>
	                <div className='tools-card'>
	                  <img src={require('../../assets/images/about/sqla.png')}
	                    className='img-responsive' alt='Slack logo'/>
	                  <h5>SQLAlchemy</h5>
	                  <p>
	                    Python SQL toolkit used to access our database
	                  </p>
	                </div>
	              </Col>
	            </a>
	            <a href='https://mochajs.org/' target="_blank"
	              rel="noopener noreferrer">
	              <Col sm={3}>
	                <div className='tools-card'>
	                  <img
	                    src={require('../../assets/images/about/mochajs.png')}
	                    className='img-responsive' alt='Slack logo'/>
	                  <h5>Mocha</h5>
	                  <p>
	                    JavaScript test framework.
	                  </p>
	                </div>
	              </Col>
	            </a>
	            <a href='https://www.seleniumhq.org/' target="_blank"
	              rel="noopener noreferrer">
	              <Col sm={3}>
	                <div className='tools-card'>
	                  <img
	                    src={require('../../assets/images/about/selenium.png')}
	                    className='img-responsive' alt='Slack logo'/>
	                  <h5>Selenium</h5>
	                  <p>
	                    Used to test our front-end routes.
	                  </p>
	                </div>
	              </Col>
	            </a>
	            <a href='https://www.travis-ci.com/' target="_blank"
	              rel="noopener noreferrer">
	              <Col sm={3}>
	                <div className='tools-card'>
	                  <img
	                    src={require('../../assets/images/about/travisci.png')}
	                    className='img-responsive' alt='Slack logo'/>
	                  <h5>Travis CI</h5>
	                  <p>
	                    Used for continuous integration of our project.
	                  </p>
	                </div>
	              </Col>
	            </a>
	          </Row>
	        </div>
		)
	}
}
