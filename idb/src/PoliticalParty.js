import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Parties from './Parties.js';
import all_parties from './assets/all-parties.json';
import reps_info from './assets/bioguide-endpoint.json';

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
            parties_map[all_parties[i]["name"]] = [
                    all_parties[i]["id"],
                    all_parties[i]["chair"],
                    all_parties[i]["formation_date"],
                    all_parties[i]["color"],
                    0]
        }

        Object.keys(reps_info).forEach(function(rep_key) {
            Object.keys(parties_map).forEach(function(party_key) {
                if (party_key.startsWith(reps_info[rep_key]["party"])) {
                    parties_map[party_key][4] += 1
                }
            })
        })

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
