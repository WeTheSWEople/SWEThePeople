import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './assets/css/index.css'
import App from './js/App'
import registerServiceWorker from './js/registerServiceWorker'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'))
registerServiceWorker()
