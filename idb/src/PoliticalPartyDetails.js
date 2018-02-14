import React, { Component } from 'react';
import {GridList} from 'material-ui/GridList';
import RepresentativeInstance from './RepresentativeInstance'
import logo from './logo.svg';
import './App.css';
import './PoliticalPartyDetails.css';
import all_parties from './assets/all-parties.json';
import reps_info from './assets/all-reps-endpoint.json';
import {Timeline} from 'react-twitter-widgets';
import StateInstance from './StateInstance.js';

let state_json = require("./assets/data/state.json")

export default class PoliticalPartyDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            error: false,
            party: {},
            num_reps: 0,
            reps: {},
            districts: []
        }
    }

    componentWillMount() {
        this.setState({ready: false})

        var this_party = {}
        console.log(this.props.match.params.name)
        for (var i = 0; i < all_parties.length; i++) {
            console.log(all_parties[i]["name"])
            if (all_parties[i]["name"].toUpperCase().startsWith(
                this.props.match.params.name.toUpperCase())) {
                this_party = all_parties[i]
            }
        }
        this.setState({party: this_party})

        var reps_map = {}
        var districts_arr = []
        var rep_count = 0
        Object.keys(reps_info).forEach(function (key){
            if (this_party["name"].startsWith(reps_info[key]["party"])) {
                reps_map[key] = reps_info[key]
                districts_arr.push(reps_info[key]["state"])
                rep_count += 1
            }
        })
        this.setState({num_reps: rep_count, reps: reps_map,
                       districts: districts_arr, ready: true})
    }

    render() {
        const styles = {
            divStyle: {
                paddingTop: "50px",
            },
            imgStyle: {
                width: "10%"
            },
            partyColor: {
                color: this.state.party["color"]
            },
            progressStyle: {
                width: ((this.state.num_reps / 3) * 100) + "%",
                backgroundImage: "none",
                backgroundColor: this.state.party["color"]
            }
        }

        var control_text = ""
        if (this.state.num_reps > 0) {
            control_text = this.state.num_reps + "/3"
        }

        var reps_grid = Object.keys(this.state.reps).map((key) =>
            <div class="col-sm-3 party-rep-card">
                <RepresentativeInstance key={key} rep={this.state.reps[key]} />
            </div>
        )

        var districts_grid = this.state.districts.map(district =>
            <div class="col-sm-3 party-rep-card">
                <StateInstance key={district}
                               full_state={state_json[district]}
                               state={district} />
            </div>
        )

        return (
            <div style={styles.divStyle} className="App">
                <div class="container">
                    <div class="party-header">
                        <img src={require("./assets/images/parties/" +
                                          this.state.party["name"] + "-full.png")}
                             style={styles.imgStyle}
                             alt={this.state.party["name"]} />
                        <h1>{this.state.party["name"]} Party</h1>
                    </div>

                    <div class="row party-info-top">
                        <div class="col-sm-5 col-sm-offset-1 party-info">
                            <p>
                                <span class="party-info-header">
                                    Party chair:
                                </span>
                                {this.state.party["chair"]}
                            </p>
                            <p>
                                <span class="party-info-header">
                                    Formation date:
                                </span>
                                {this.state.party["formation_date"]}
                            </p>
                            <p>
                                <span class="party-info-header">
                                    Party color:
                                </span>
                                <span style={styles.partyColor}>
                                    {this.state.party["color"]}
                                </span>
                            </p>
                            <p>
                                <span class="party-info-header">
                                    Website:
                                </span>
                                <a href={this.state.party["website"]}>
                                    {this.state.party["website"]}
                                </a>
                            </p>
                            <p class="party-info-header">House Control:</p>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar"
                                     style={styles.progressStyle}
                                     aria-valuenow="50" aria-valuemin="0"
                                     aria-valuemax="435">
                                    {control_text}
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-5">
                            <Timeline
                                dataSource={{
                                  sourceType: 'profile',
                                  screenName: this.state.party["twitter_handle"]
                                }}
                                options={{
                                  username: this.state.party["twitter_handle"],
                                  height: '300'
                                }}
                            />
                            <iframe
                              width="353"
                              height="200"
                              src={"http://www.youtube.com/embed?max-results=1&controls=0&showinfo=0&rel=0&listType=user_uploads&list=" + this.state.party["youtube"]}
                              frameborder="10" allowfullscreen >
                            </iframe>
                        </div>

                    </div>
                    <div>
                        <h3 class="rep-header">Representatives</h3>
                        <div class="row">
                            {reps_grid}
                        </div>
                    </div>

                    <div>
                        <h3 class="rep-header">Districts</h3>
                        <div class="row">
                            {districts_grid}
                        </div>
                    </div>

                  <div>
                      <h4><b>Office Location:</b></h4>
                      <h4>{this.state.party["office"]}</h4>
                      <iframe
                        width="353"
                        height="200"
                        frameborder="0" style={{border: "0"}}
                        src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyDOCxZVfWFVpzzAC8tEIi3ulzNzXbOdsyY&q=" + this.state.party["office"]} allowfullscreen>
                      </iframe>          
                  </div>
                </div>
            </div>
        );
    }
}
