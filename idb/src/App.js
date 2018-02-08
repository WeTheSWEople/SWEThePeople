import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DefaultRouter from './Router'
import Navigation from './Navigation'

export default class App extends Component {
  render() {
    return (
      <div>
        <Navigation />
        <DefaultRouter />
      </div>
    );
  }
}
