/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
/* eslint-enable no-unused-vars */

import About from './About/About.jsx'
import Alma from './Representatives/Alma.js'
import Districts from './Districts/Districts.jsx'
import DistrictsDetails from './Districts/DistrictDetails.jsx'
import PoliticalPartyDetails from './Parties/PoliticalPartyDetails'
import Representatives from './Representatives/Representatives'
import RepresentativeDetails from './Representatives/RepresentativeDetails'
import PoliticalParties from './Parties/PoliticalParties.js'
import Splash from './Splash/Splash'
import Search from './Search'
import NotFound from './NotFound'

/**
 * Router for client side routing of the frontend application
 */
export default class DefaultRouter extends Component {
  render () {
    return (
      <Switch>
        <Route exact path="/" component={Splash}/>
        <Route path="/about" component={About}/>
        <Route exact path="/representatives" component={Representatives}/>
        <Route path="/representatives/:bioguideid"
          component={RepresentativeDetails}/>
        <Route exact path="/districts" component={Districts}/>
        <Route path="/districts/:districtid/:districtnum"
          component={DistrictsDetails}/>
        <Route path="/parties" component={PoliticalParties} />
        <Route path="/party/:path" component={PoliticalPartyDetails} />
        <Route path="/search/:term" component={Search} />
        <Route path="/alma" component={Alma} />
        <Route component = {NotFound} status={404}/>
      </Switch>
    )
  }
}
