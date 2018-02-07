import React, { Component } from 'react';
import PoliticalPartyInstance from './PoliticalPartyInstance';
import logo from './logo.svg';
import './App.css';

var request = require("request");

export default class PoliticalParty extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var democratic = {name: "Democratic Party",
                          chair: "Tom Perez",
                          founders: ["Andrew Jackson", "Martin Van Buren"],
                          formation_date: "January 8, 1828",
                          color: "Blue"}

        return (
            <PoliticalPartyInstance vals={democratic} />
        );
    }
}
