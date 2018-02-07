import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Splash from './Splash'
import About from './About'


export default class DefaultRouter extends Component {
  render() {
    return (
		<BrowserRouter>
		<Switch>
       	<Route exact path="/" component={Splash}/>
		<Route path="/about" component={About}/>
		</Switch>
   		</BrowserRouter>
    );
  }
}
