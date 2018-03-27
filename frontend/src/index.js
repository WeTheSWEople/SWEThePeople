/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom'
import './assets/css/index.css'
import App from './js/App'
import registerServiceWorker from './src/js/registerServiceWorker'
import {BrowserRouter} from 'react-router-dom'
/* eslint-enable no-unused-vars */

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>,
  document.getElementById('root'))
registerServiceWorker()
