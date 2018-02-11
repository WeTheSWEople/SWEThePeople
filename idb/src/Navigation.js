import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'

import header from './assets/images/header.png'
import './App.css';

export default class Navigation extends Component {
  render() {
    return (
      <div>
        <Navbar fixedTop={true} inverse={true}>
          <Navbar.Header>
            <Navbar.Brand>
              <LinkContainer to="/">
                <img src={header} className="App-logo" alt="logo" />
              </LinkContainer>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <LinkContainer to="/" exact={true}>
              <NavItem>
                Home
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/about">
              <NavItem>
                About
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/representatives">
              <NavItem>
                Representatives
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/parties">
              <NavItem>
                Parties
              </NavItem>
            </LinkContainer>
          </Nav>
        </Navbar>
      </div>
    );
  }
}
