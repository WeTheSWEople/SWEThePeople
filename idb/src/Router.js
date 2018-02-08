import React, { Component } from 'react'
import {Route, Switch, Link} from 'react-router-dom'
import Splash from './Splash'
import About from './About'

export default class DefaultRouter extends Component {
  render() {
    return (
			<Switch>
				<Route exact path="/" component={Splash}/>
				<Route path="/about" component={About}/>
			</Switch>
    );
  }
}
