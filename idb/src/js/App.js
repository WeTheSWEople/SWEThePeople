import React, { Component } from 'react';
import '../assets/css/App.css';
import DefaultRouter from './Router'
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Navigation from './Navigation/Navigation'

export default class App extends Component {
  render() {
	return (
	  <MuiThemeProvider>
			<div>
				<Navigation />
				<DefaultRouter />
			</div>
	  </MuiThemeProvider>
	);
  }
}
