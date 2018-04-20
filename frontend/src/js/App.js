/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import '../assets/css/App.css'
import DefaultRouter from './Router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Navigation from './Navigation/Navigation'
/* eslint-enable no-unused-vars */

export default class App extends Component {
  render () {
    return (
      // Material theme
      <MuiThemeProvider>
        {/* Navigation and Router structure for all components within app */}
        <div>
          <Navigation />
          <DefaultRouter />
        </div>
      </MuiThemeProvider>
    )
  }
}
