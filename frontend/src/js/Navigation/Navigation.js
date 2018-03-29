/* eslint-disable no-unused-vars */
import React, {Component} from 'react'
import {Navbar, Nav, NavItem, Button, FormGroup, FormControl} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
/* eslint-enable no-unused-vars */

import header from '../../assets/images/header.png'
import '../../assets/css/App.css'

export default class Navigation extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)

    this.state = {
      value: ''
    }
  }

  handleChange(e) {
    this.setState({value: e.target.value})
  }

  render () {
    return (
      <div>
        <Navbar fixedTop={true} inverse={true}>
          <Navbar.Header>
            <Navbar.Brand>
              <LinkContainer to="/">
                <img src={header} className="App-logo" alt="logo" />
              </LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/" exact={true}>
                <NavItem>Home</NavItem>
              </LinkContainer>
              <LinkContainer to="/representatives">
                <NavItem>Representatives</NavItem>
              </LinkContainer>
              <LinkContainer to="/parties">
                <NavItem>Parties</NavItem>
              </LinkContainer>
              <LinkContainer to="/districts">
                <NavItem>Districts</NavItem>
              </LinkContainer>
              <LinkContainer to="/about">
                <NavItem>About</NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              <Navbar.Form>
                <FormGroup>
                  <FormControl onChange={this.handleChange}
                    type="text" placeholder="Search" />
                </FormGroup>{' '}
                <LinkContainer to={`/search/${this.state.value}`}>
                  <Button type="submit">Submit</Button>
                </LinkContainer>
              </Navbar.Form>
            </Nav>
            </Navbar.Collapse>
		    </Navbar>
	        </div>
	);
  }
}
