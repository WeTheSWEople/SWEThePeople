import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

export default class PoliticalPartyInstance extends Component {
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

    render() {
        console.log("hello world");
        return (
            <div className="Political-party">
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <h1 className="App-title">Welcome to React</h1>
                    </header>
                </div>

                <div className="party-name">
                    <h1>{this.props.vals.name}</h1>
                </div>

                <div className="party-info">
                    <p>{this.props.vals.chair}</p>
                    <p>{this.props.vals.formation_date}</p>
                    <div>
                        {this.props.vals.founders.map((item, index) => (
                            <p key={index}>{item}</p>
                        ))}
                    </div>
                    <p>{this.props.vals.color}</p>
                </div>
            </div>
        );
    }
}
