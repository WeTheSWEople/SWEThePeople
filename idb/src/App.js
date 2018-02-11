import React, { Component } from 'react';
import './App.css';
import DefaultRouter from './Router'
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Navigation from './Navigation'

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
