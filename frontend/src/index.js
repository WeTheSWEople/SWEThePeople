/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom'
import './assets/css/index.css'
import App from './js/App'
import registerServiceWorker from './js/registerServiceWorker'
import {BrowserRouter} from 'react-router-dom'
import {CookiesProvider} from 'react-cookie'
/* eslint-enable no-unused-vars */

ReactDOM.render(
  <BrowserRouter>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </BrowserRouter>,
  document.getElementById('root'))
registerServiceWorker()
