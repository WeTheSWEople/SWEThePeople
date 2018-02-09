import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom'
import Splash from './Splash'
import About from './About'
import PoliticalParty from './PoliticalParty'
import Representatives from './Representatives'
import RepresentativeDetails from './RepresentativeDetails'

export default class DefaultRouter extends Component {
  render() {
    return (
		<Switch>
       	<Route exact path="/" component={Splash}/>
		    <Route path="/about" component={About}/>
        <Route exact path="/representatives" component={Representatives}/>
		    <Route path="/representatives/:bioguideid" component={RepresentativeDetails}/>
    </Switch>
    );
  }
}
