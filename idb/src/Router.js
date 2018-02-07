import React, { Component } from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Splash from './Splash'
import About from './About'
import PoliticalParty from './PolitcalParty'


export default class DefaultRouter extends Component {
  render() {
    return (
		<BrowserRouter>
		<Switch>
       	<Route exact path="/" component={Splash}/>
		<Route path="/about" component={About}/>
        <Route path="/politicalparty" component={PoliticalParty} />
		</Switch>
   		</BrowserRouter>
    );
  }
}
