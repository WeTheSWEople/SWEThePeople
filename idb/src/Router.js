import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Splash from './Splash'
import About from './About'
import Representative from './Representative'


export default class DefaultRouter extends Component {
  render() {
    return (
		<BrowserRouter>
		<Switch>
       	<Route exact path="/" component={Splash}/>
		<Route path="/about" component={About}/>
    <Route path="/representative" component={Representative}/>
		</Switch>
   		</BrowserRouter>
    );
  }
}
