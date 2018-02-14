import React, { Component } from 'react';
import {GridList} from 'material-ui/GridList';
import RepresentativeInstance from './RepresentativeInstance'
import logo from './logo.svg';
import './App.css';
import './PoliticalPartyDetails.css';
import all_parties from './assets/all-parties.json';
import reps_info from './assets/all-reps-endpoint.json';
import {Timeline} from 'react-twitter-widgets';

export default class PoliticalPartyDetails extends Component {
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
        const styles = {
            divStyle: {
                paddingTop: "50px",
            },
            imgStyle: {
                width: "10%"
            },
            partyColor: {
                color: this.state.party["color"]
            }
        }


        var reps_grid = Object.keys(this.state.reps).map((key) =>
            <div class="col-sm-3 party-rep-card">
                <RepresentativeInstance key={key} rep={this.state.reps[key]} />
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
                            <h4><b>Office Location:</b></h4>
                            <h4>{this.state.party["office"]}</h4>
                            <iframe
                              width="353"
                              height="200"
                              frameborder="0" style={{border: "0"}}
                              src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyDOCxZVfWFVpzzAC8tEIi3ulzNzXbOdsyY&q=" + this.state.party["office"]} allowfullscreen>
                            </iframe>
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
                </div>
            </div>
        );
    }
}
