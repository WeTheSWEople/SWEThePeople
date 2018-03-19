import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

// Import necessary components for spec
import Splash from '../src/js/Splash/Splash';
import Slider from 'react-slick';
import Navigation from '../src/js/Navigation/Navigation';
import { NavItem } from 'react-bootstrap';

describe('Splash Page Component', () => {
  it('renders header', () => {
    const wrapper = shallow(<Splash />)
    expect(wrapper.find('header').hasClass('App-header')).to.be.eql(true)
  })
  it('renders carousel', () => {
    const wrapper = shallow(<Splash />)
    expect(wrapper.find('.carousel-parent').exists()).to.eql(true)
  })
  it('renders images', () => {
    const wrapper = shallow(<Splash />)
    expect(wrapper.find('img')).to.have.length(3)
  })
})

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
