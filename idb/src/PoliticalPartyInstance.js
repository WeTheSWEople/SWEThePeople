import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import all_parties from './assets/all-parties.json';

export default class PoliticalPartyInstance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            error: false,
            party: {}
        }
    }

    componentWillMount() {
        this.setState({ready: false})

        var this_party = {}
        for (var i = 0; i < all_parties.length; i++) {
            if (all_parties[i]["id"] == this.props.match.params.id) {
                this_party = all_parties[i]
            }
        }
        this.setState({party: this_party, ready: true})
    }

    render() {
        var divStyle = {
            paddingTop: "50px",
            textAlign: "center"
        }

        return (
            <div style={divStyle}>
                <h2>{this.state.party["name"]}</h2>
                <p>{this.state.party["chair"]}</p>
                <p>{this.state.party["formation_date"]}</p>
                <p>{this.state.party["color"]}</p>
            </div>
        );
    }
}
