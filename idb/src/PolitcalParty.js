import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var request = require("request");

export default class PoliticalParty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            error: false,
            name: "",
            chair: "",
            formation_date: "",
            color: "",
        }
    }

    componentWillMount() {
        this.setState({ready: false})

        this.setState({name: "Democratic Party",
                       chair: "John Doe",
                       formation_date: "July 4, 1776",
                       color: "Blue"});
    }

    render() {
        return (
            <div className="Political-party">
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <h1 className="App-title">Welcome to React</h1>
                    </header>
                </div>

                <div className="party-name">
                    <h1>{this.state.name}</h1>
                </div>

                <div className="party-info">
                    <p>{this.state.chair}</p>
                    <p>{this.state.formation_date}</p>
                    <p>{this.state.color}</p>
                </div>
            </div>
        );
    }
}
