import React from 'react';
import '../assets/css/App.css'

// Basic 404 page for not found pages
const NotFound = () =>
  <div className='App'>
  	<header className='App-header-white'></header>
    <h3 style={{paddingTop: '50vh'}}>404 page not found</h3>
    <p>We are sorry but the page you are looking for does not exist.</p>
  </div>

export default NotFound;
