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
import StateInstance from '../src/js/Districts/StateInstance.js';
import PoliticalParty from '../src/js/Parties/PoliticalParty.js';
import PoliticalPartyDetails from '../src/js/Parties/PoliticalPartyDetails.js';

const rep = {
  "bills": [
    {
      "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-concurrent-resolution/101",
      "id": 7,
      "introduced_date": "2018-01-25",
      "latest_major_action": "Message on Senate action sent to the House.",
      "number": "H.CON.RES.101",
      "short_title": "Providing for a joint session of Congress to receive a message from the President.",
      "sponsor_id": "A000055"
    },
    {
      "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-bill/3268",
      "id": 8,
      "introduced_date": "2017-07-17",
      "latest_major_action": "Placed on the Union Calendar, Calendar No. 165.",
      "number": "H.R.3268",
      "short_title": "Agriculture, Rural Development, Food and Drug Administration, and Related Agencies Appropriations Act, 2018",
      "sponsor_id": "A000055"
    },
    {
      "congressdotgov_url": "https://www.congress.gov/bill/115th-congress/house-concurrent-resolution/26",
      "id": 9,
      "introduced_date": "2017-02-15",
      "latest_major_action": "Referred to the House Committee on Science, Space, and Technology.",
      "number": "H.CON.RES.26",
      "short_title": "To express the sense of Congress that the first launch of the Space Launch System should be named for Captain Eugene Andrew \"Gene\" Cernan.",
      "sponsor_id": "A000055"
    }
  ],
  "bioguide": "A000055",
  "district": "4",
  "firstname": "Robert",
  "image_uri": "https://theunitedstates.io/images/congress/225x275/A000055.jpg",
  "lastname": "Aderholt",
  "office": "235 Cannon House Office Building",
  "party_id": 2,
  "state": "AL",
  "twitter": "Robert_Aderholt",
  "url": "https://aderholt.house.gov",
  "votes_with_party_pct": 96.62,
  "youtube": "RobertAderholt"
};

const party = {
  "Democratic": {
    "path": "democratic_party",
    "name": "Democratic Party",
    "chair": "Tom Perez",
    "num_reps": "50",
  }
};

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

describe('RepresentativeInstance Component', () => {
  const instance = shallow(<RepresentativeInstance key={'A000055'} rep={rep} party_name={"Republican"}/>)

  it('displays correct picture of representative', () => {
    const { alt, src } = instance.find('img').props()
    assert.equal(instance.find('img.rep_img').length, 1)
    assert.equal(src, "https://theunitedstates.io/images/congress/225x275/A000055.jpg")
  })

  it('displays representative name and info', () => {
    expect(instance.find('h3.title').text()).to.equal("Robert Aderholt")
    expect(instance.find('h4.party').text()).to.equal("Republican")
    expect(instance.find('h4.district').text()).to.equal("AL - 4")
  })
})

describe('Representatives Component', () => {
  const representatives = shallow(<Representatives />)

  it('displays a loading spinner when no reps present', () => {
    expect(representatives.find('.loading')).to.have.length(1)
  })
})

describe('StateInstance Component', () => {
  const stateInstance = shallow(<StateInstance full_state={"California"} state={"CA"} num_reps={2}/>)

  it('displays correct picture of state', () => {
    const { alt, src } = stateInstance.find('img').props()
    assert.equal(stateInstance.find('img').length, 1)
    assert.equal(alt, "State")
  })

  it('displays correct state info', () => {
    expect(stateInstance.find('h3.title').text()).to.equal("California")
    expect(stateInstance.find('h4.party').text()).to.equal("Districts: 2")
  })
})

describe('PoliticalParty Component', () => {
  const politicalpartyInstance = shallow(<PoliticalParty />)

  it('displays nothing, because ready state is false', () => {
    expect(politicalpartyInstance.find('div.parties-container').children()).to.have.length(0)
  })
})
