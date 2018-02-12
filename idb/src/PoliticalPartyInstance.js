import React, { Component } from 'react';
import {GridList} from 'material-ui/GridList';
import RepresentativeInstance from './RepresentativeInstance'
import logo from './logo.svg';
import './App.css';
import './party.css';
import all_parties from './assets/all-parties.json';
import reps_info from './assets/all-reps-endpoint.json';
import {Timeline} from 'react-twitter-widgets';

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
            }
        })
        this.setState({reps: reps_map, ready: true})
    }

    render() {
        var divStyle = {
            paddingTop: "50px",
        }

        var imgStyle = {
            width: "10%"
        }

        var reps_grid = Object.keys(this.state.reps).map((key) =>
            <div class="col-sm-3 party-rep-card">
                <RepresentativeInstance key={key} rep={this.state.reps[key]} />
            </div>
        )

        const styles = {
            root: {
                display: 'flex',
                flexWrap: 'wrap',
                paddingTop: '50px',
                paddingLeft: '50px',
                paddingRight: '50px',
                justifyContent: 'space-around',
              },
              gridList: {
                    width: '80%',
                    height: '100%',
                    overflowY: 'auto',
              },
        };

        return (
            <div style={divStyle} className="App">
                <div class="container">
                    <div class="party-header">
                        <img src={require("./assets/images/parties/" +
                                          this.state.party["name"] + "-full.png")}
                             style={imgStyle}
                             alt={this.state.party["name"]} />
                        <h1>{this.state.party["name"]} Party</h1>
                    </div>

                    <div class="row">
                        <div class="col-md-4 col-md-offset-2">
                            <p>Party chair: {this.state.party["chair"]}</p>
                            <p>Formation date: {this.state.party["formation_date"]}</p>
                            <p>Party color: {this.state.party["color"]}</p>
                        </div>

                        <div class="col-md-4">
                            <Timeline
                                dataSource={{
                                  sourceType: 'profile',
                                  screenName: this.state.party["twitter_handle"]
                                }}
                                options={{
                                  username: this.state.party["twitter_handle"],
                                  height: '400'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div style={styles.root}>
                    <div style={styles.gridList}>
                        <h3 class="rep-header">Representatives:</h3>
                        <div class="row">
                            {reps_grid}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
