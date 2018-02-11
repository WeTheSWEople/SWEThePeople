import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom'
import Splash from './Splash'
import About from './About'
import Representatives from './Representatives'
import RepresentativeDetails from './RepresentativeDetails'
import Districts from './District'
import AllDistricts from './AllDistricts'

export default class DefaultRouter extends Component {
  render() {
	return (
		<Switch>
		   <Route exact path="/" component={Splash}/>
			<Route path="/about" component={About}/>
		<Route exact path="/representatives" component={Representatives}/>
			<Route path="/representatives/:bioguideid" component={RepresentativeDetails}/>
		<Route exact path="/districts" component={AllDistricts}/>
			<Route path="/districts/:districtid" component={Districts}/>
	</Switch>
	);
  }
}
