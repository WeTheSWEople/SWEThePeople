import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom'
import Splash from './Splash'
import About from './About'
import PoliticalParty from './PoliticalParty'
import PoliticalPartyDetails from './PoliticalPartyDetails'
import Representatives from './Representatives'
import RepresentativeDetails from './RepresentativeDetails'
import Districts from './District'
import AllDistricts from './AllDistricts'
import DistrictsDetails from './DistrictDetails'


export default class DefaultRouter extends Component {
  render() {
	return (
		<Switch>
		   <Route exact path="/" component={Splash}/>
			<Route path="/about" component={About}/>
		<Route exact path="/representatives" component={Representatives}/>
			<Route path="/representatives/:bioguideid" component={RepresentativeDetails}/>
		<Route exact path="/districts" component={AllDistricts}/>
			<Route exact path="/districts/:districtid" component={Districts}/>
			<Route path="/districts/:districtid/:districtnum" component={DistrictsDetails}/>

		<Route path="/parties" component={PoliticalParty} />
			<Route path="/party/:name" component={PoliticalPartyDetails} />
		</Switch>
	);
  }
}
