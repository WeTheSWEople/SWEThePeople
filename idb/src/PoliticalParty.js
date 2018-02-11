import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import all_parties from './assets/all-parties.json';
import Parties from './Parties.js';

var request = require("request");

export default class PoliticalParty extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            error: false,
            parties: {}
        }
    }

    componentWillMount() {
        this.setState({ready: false})

        var parties_map = {}
        for (var i = 0; i < all_parties.length; i++) {
            parties_map[all_parties[i]["name"]] = [all_parties[i]["chair"],
                    [all_parties[i]["formation_date"]],
                    [all_parties[i]["color"]]]
        }
        this.setState({parties: parties_map, ready: true})
    }

    render() {
        let parties = null
        if (this.state.ready) {
            parties = <Parties party_data = {this.state.parties} />
        }

        let divStyle = {
            paddingTop: "50px"
        }

        return (
            <div style={divStyle}>
                {parties}
            </div>
        );
    }
}
