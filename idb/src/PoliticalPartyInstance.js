import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

export default class PoliticalPartyInstance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            error: false,
        }
    }

    render() {
        console.log("Rendering " + this.props.vals.name);
        return (
            <div className="Political-party">
                <div className="party-name">
                    <h1>{this.props.vals.name}</h1>
                </div>

                <div className="party-info">
                    <p>{this.props.vals.chair}</p>
                    <p>{this.props.vals.formation_date}</p>
                    <p>{this.props.vals.color}</p>
                </div>
            </div>
        );
    }
}
