/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
/* eslint-enable no-unused-vars */

import About from './About/About'
import AllDistricts from './Districts/AllDistricts'
import Districts from './Districts/District'
import DistrictsDetails from './Districts/DistrictDetails'
import PoliticalParty from './Parties/PoliticalParty'
import PoliticalPartyDetails from './Parties/PoliticalPartyDetails'
import Representatives from './Representatives/Representatives'
import RepresentativeDetails from './Representatives/RepresentativeDetails'
import Splash from './Splash/Splash'
import NotFound from './NotFound'

export default class DefaultRouter extends Component {
  render () {
    
    return (
      <Switch>
        <Route exact path="/" component={Splash}/>
        <Route path="/about" component={About}/>
        <Route exact path="/representatives" component={Representatives}/>
        <Route path="/representatives/:bioguideid"
          component={RepresentativeDetails}/>
        <Route exact path="/districts" component={AllDistricts}/>
        <Route exact path="/districts/:districtid" component={Districts}/>
        <Route path="/districts/:districtid/:districtnum"
          component={DistrictsDetails}/>
        <Route path="/parties" component={PoliticalParty} />
        <Route path="/party/:path" component={PoliticalPartyDetails} />
        <Route component = {NotFound} status={404}/>
      </Switch>
    )
  }
}
