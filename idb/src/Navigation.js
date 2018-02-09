import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'

export default class Navigation extends Component {
  render() {
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <LinkContainer to="/">
                <a>Swe The People</a>
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
          </Nav>
        </Navbar>
      </div>
    );
  }
}


