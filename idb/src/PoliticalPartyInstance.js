import React, { Component } from 'react';
import {GridList} from 'material-ui/GridList';
import RepresentativeInstance from './RepresentativeInstance'
import logo from './logo.svg';
import './App.css';
import all_parties from './assets/all-parties.json';
import reps_info from './assets/bioguide-endpoint.json';

export default class PoliticalPartyInstance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            error: false,
            party: {},
            reps: {}
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
        this.setState({party: this_party})

        var reps_map = {}
        Object.keys(reps_info).forEach(function (key){
            if (this_party["name"].startsWith(reps_info[key]["party"])) {
                reps_map[key] = reps_info[key]

                // TODO: way to not have to explicitly state?
                reps_map[key]["firstName"] = reps_map[key]["first-name"]
                reps_map[key]["lastName"] = reps_map[key]["last-name"]
            }
        })
        this.setState({reps: reps_map, ready: true})
    }

    render() {
        var divStyle = {
            paddingTop: "50px",
            textAlign: "center"
        }

        var reps_grid = Object.keys(this.state.reps).map((key) =>
            <RepresentativeInstance key={key} rep={this.state.reps[key]} />
        )

        return (
            <div style={divStyle}>
                <h2>{this.state.party["name"]} Party</h2>
                <p>Party chair: {this.state.party["chair"]}</p>
                <p>Formation date: {this.state.party["formation_date"]}</p>
                <p>Party color: {this.state.party["color"]}</p>

                <GridList cellHeight={400} cols={5}>
                    {reps_grid}
                </GridList>
            </div>
        );
    }
}
