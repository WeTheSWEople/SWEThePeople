import React from 'react';
import { expect, assert } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

// Import necessary components for spec
import Splash from '../src/js/Splash/Splash';
import Slider from 'react-slick';
import Navigation from '../src/js/Navigation/Navigation';
import { NavItem } from 'react-bootstrap';
import RepresentativeDetails from '../src/js/Representatives/RepresentativeDetails.js';
import RepresentativeInstance from '../src/js/Representatives/RepresentativeInstance.js';
import allReps from '../src/assets/bioguide-endpoint.json';
import Representatives from '../src/js/Representatives/Representatives.js';
import StateInstance from '../src/js/Representatives/StateInstance.js';
import PoliticalParty from '../src/js/Parties/PoliticalParty.js';
import PoliticalPartyDetails from '../src/js/Parties/PoliticalPartyDetails.js';

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

// describe('RepresentativeDetails Component', () => {
//   it('renders bill mappings', () => {
//     const wrapper = shallow(<RepresentativeDetails />)
//     // expect(wrapper.find()
//   })
// })

describe('RepresentativeInstance Component', () => {
  const instance = shallow(<RepresentativeInstance rep={allReps['R000570']}/>)

  it('displays correct picture of representative', () => {
    const { alt, src } = instance.find('img').props()
    assert.equal(instance.find('img').length, 1)
    assert.equal(alt, "Paul")
    assert.equal(src, "https://theunitedstates.io/images/congress/225x275/R000570.jpg")
  })
  it('displays representative name and info', () => {
    expect(instance.find('.title').text()).to.equal("Paul Ryan")
    expect(instance.find('.party').text()).to.equal("Republican")
    expect(instance.find('.district').text()).to.equal("WI - 1")
  })
})

describe('Representatives Component', () => {
  const representatives = shallow(<Representatives />)

  it('displays a grid of representatives', () => {
    expect(representatives.find('div.grid-container').children()).to.have.length(1)
    expect(representatives.find('.gridlist-container').children()).to.have.length(4)
  })
})

describe('StateInstance Component', () => {
  const stateInstance = shallow(<StateInstance full_state={"California"} state={"CA"}/>)

  it('displays correct picture of state', () => {
    const { alt, src } = stateInstance.find('img').props()
    assert.equal(stateInstance.find('img').length, 1)
    assert.equal(alt, "State")
  })

  it('displays correct state info', () => {
    expect(stateInstance.find('h3.title').text()).to.equal("California")
    expect(stateInstance.find('h4.party').text()).to.equal("Districts: 2")
    expect(stateInstance.find('h4.district').text()).to.equal("Senators: 2")
  })
})

describe('PoliticalParty Component', () => {
  const politicalpartyInstance = shallow(<PoliticalParty />)

  it('displays grid of political parties', () => {
    expect(politicalpartyInstance.find('div.parties-container').children()).to.have.length(1)
  })
})

// describe('PoliticalPartyDetails Component', () => {
//   const politicalpartydetailsInstance = shallow(<PoliticalPartyDetails />)

//   it('displays details of political party', () => {
//     expect(politicalpartydetailsInstance.find('div.party-info').children()).to.have.length(1)
//   })
// })

