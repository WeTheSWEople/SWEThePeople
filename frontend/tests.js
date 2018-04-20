import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

// Import necessary components for spec
import Splash from './src/js/Splash/Splash';
import Slider from 'react-slick';
import Navigation from './src/js/Navigation/Navigation';
import { NavItem } from 'react-bootstrap';
import RepresentativeDetails from './src/js/Representatives/RepresentativeDetails.js';
import RepresentativeInstance from './src/js/Representatives/RepresentativeInstance.js';
import Representatives from './src/js/Representatives/Representatives.js';
import StateInstance from './src/js/Districts/StateInstance.js';
import PoliticalPartyDetails from './src/js/Parties/PoliticalPartyDetails.js';
import NotFound from './src/js/NotFound.js';
import DistrictGrid from './src/js/Districts/DistrictGrid.js';
import Search from './src/js/Search.js';
import RepresentativeFilter from './src/js/Representatives/RepresentativeFilter.js';
import PoliticalPartyFilter from './src/js/Parties/PoliticalPartyFilter.js';
import DistrictFilter from './src/js/Districts/DistrictFilter.js';

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

const params = {
  "districtid": "AL01"
};

const California = {
  "name": "California",
  "usps_abbreviation": "CA",
  "districts": [
    1, 2, 3
  ],
}

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
    expect(instance.find('img.rep_img')).to.have.length(1)
    expect(src).to.eql("https://theunitedstates.io/images/congress/225x275/A000055.jpg")
  })

  it('displays representative name and info', () => {
    expect(instance.find('h3.title').text()).to.equal("Robert Aderholt")
    expect(instance.find('h4.party').text()).to.equal("Republican")
    expect(instance.find('h4.district').text()).to.equal("AL-4")
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
    expect(stateInstance.find('img')).to.have.length(1)
    expect(alt).to.eql("State")
  })

  it('displays correct state info', () => {
    expect(stateInstance.find('h3.title').text()).to.equal("California")
    expect(stateInstance.find('h4.party').text()).to.equal("Districts: 2")
  })
})


describe('NotFound Component', () => {
  const notfoundInstance = shallow(<NotFound />)

  it('displays a 404 page', () => {
    expect(notfoundInstance.find('h3').text()).to.equal("404 page not found")
    expect(notfoundInstance.find('p').text()).to.equal("We are sorry but the page you are looking for does not exist.")
  })
})

describe('DistrictGrid Component', () => {
  const alldistrictInstance = shallow(<DistrictGrid />)

  it('loading district', () => {
    expect(alldistrictInstance.find('.filter-grid-center').children()).to.have.length(1)
  })

  it('invalid district, data not found', () => {
    alldistrictInstance.setState({districts: -1})
    expect(alldistrictInstance.update().find('p').text()).to.equal("Data Not Found")
  })

  it('no districts found', () => {
    alldistrictInstance.setState({districts: -2})
    expect(alldistrictInstance.update().find('h1').text()).to.equal("No districts found, try a different filter.")
  })
})

describe('Search Component', () => {
  const searchInstance = shallow(<Search match={{params: {term: "01"}}}/>)

  it('no search', () => {
    expect(searchInstance.find('.search-container').children()).to.have.length(1)
  })

  it('no results', () => {
    searchInstance.setState({all_results: {test: "test"}, party_counts: {paul_ryan: "test"}})
    expect(searchInstance.update().find('.search-container').children()).to.have.length(1)
  })
})

describe('RepresentativeFilter Component', () => {
  const representativefilterInstance = render(<RepresentativeFilter
    states={{ all_states: [{name: "Texas"}] }}
    parties={{all_parties: [{name: "Democratic"}] }}
    buttonHandler={() => {return {state: {name: "Texas"}}}} />)

  it('find state filter', () => {
    expect(representativefilterInstance.find('.state-filter').length).to.equal(1)
  })

  it('find party filter', () => {
    expect(representativefilterInstance.find('.party-filter').length).to.equal(1)
  })

  it('find vote filter', () => {
    expect(representativefilterInstance.find('.vote-filter').length).to.equal(1)
  })

  it('find lastname filter', () => {
    expect(representativefilterInstance.find('.lastname-filter').length).to.equal(1)
  })

  it('find sort', () => {
    expect(representativefilterInstance.find('.sort').length).to.equal(1)
  })
})

describe('PoliticalPartyFilter Component', () => {
  const polpartyInstance = render(<PoliticalPartyFilter
    buttonHandler={() => {return {state: {name: "Texas"}}}} />)

  it('find social filter', () => {
    expect(polpartyInstance.find('.social-filter').length).to.equal(1)
  })

  it('find color filter', () => {
    expect(polpartyInstance.find('.color-filter').length).to.equal(1)
  })

  it('find name filter', () => {
    expect(polpartyInstance.find('.name-filter').length).to.equal(1)
  })

  it('find sort', () => {
    expect(polpartyInstance.find('.sort').length).to.equal(1)
  })
})

describe('DistrictFilter Component', () => {
  const polpartyInstance = render(<DistrictFilter
    states={{name: "Texas"}}
    buttonHandler={() => {return {state: {name: "Texas"}}}} />)

  it('find state filter', () => {
    expect(polpartyInstance.find('.state-filter').length).to.equal(1)
  })

  it('find population filter', () => {
    expect(polpartyInstance.find('.pop-filter').length).to.equal(1)
  })

  it('find age filter', () => {
    expect(polpartyInstance.find('.age-filter').length).to.equal(1)
  })

  it('find sort', () => {
    expect(polpartyInstance.find('.sort').length).to.equal(1)
  })
})
