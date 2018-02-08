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
        var republican = {name: "Republican Party",
                          chair: "Ronna Romney McDaniel",
                          formation_date: "March 20, 1854",
                          color: "Red"};

        var libertarian = {name: "Libertarian Party",
                           chair: "Wes Benedict",
                           formation_date: "December 11, 1971",
                           color: "Purple"};

        return (
            <div>
                <PoliticalPartyInstance vals={democratic}  />
                <PoliticalPartyInstance vals={republican}  />
                <PoliticalPartyInstance vals={libertarian} />
            </div>
        );
    }
}
