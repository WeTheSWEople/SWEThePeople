// Include in every spec file
import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

// Import necessary components for spec
import Splash from '../src/js/Splash/Splash';
import Slider from 'react-slick';

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
