import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PoliticalPartyInstance from './PoliticalPartyInstance.js';
import all_parties from './assets/all-parties.json';
import reps_info from './assets/all-reps-endpoint.json';

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
            parties_map[all_parties[i]["name"]] = {
                    name: all_parties[i]["name"],
                    color: all_parties[i]["color"],
                    num_reps: 0}
        }

        Object.keys(reps_info).forEach(function(rep_key) {
            Object.keys(parties_map).forEach(function(party_key) {
                if (party_key.startsWith(reps_info[rep_key]["party"])) {
                    parties_map[party_key]["num_reps"] += 1
                }
            })
        })

        this.setState({parties: parties_map, ready: true})
    }

    render() {
        let parties = null
        if (this.state.ready) {
            parties = <PoliticalPartyInstance
                        party_data = {this.state.parties} />
        }

        let divStyle = {
            paddingTop: "70px"
        }

        return (
            <div style={divStyle}>
                {parties}
            </div>
        );
    }
}
