import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DefaultRouter from './Router'
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";


export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
      <div>
	  <DefaultRouter />
	  </div>
	  </MuiThemeProvider>
    );
  }
}
