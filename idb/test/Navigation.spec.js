// Include in every spec file
import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

// Import necessary components for spec
import Navigation from '../src/js/Navigation/Navigation';
import { NavItem } from 'react-bootstrap';

describe('Navigation Component', () => {
  it('renders logo', () => {
    const wrapper = shallow(<Navigation />)
    expect(wrapper.find('img')).to.have.length(1)
  })
  it('renders 5 NavItems', () => {
    const wrapper = shallow(<Navigation />)
    expect(wrapper.find(NavItem)).to.have.length(5)
  })
})
