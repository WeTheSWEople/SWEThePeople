import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import RepresentativeInstance from './RepresentativeInstance';
import reps_endpoint from './assets/bioguide-endpoint.json';

let state_json = require("./assets/data/state.json")

export default class DistrictDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ready: false,
            error: false,
            state: "",
            district: "",
            rep: {},
        }
    }

    componentWillMount() {
        this.setState({ready: false})

        let rep_json = require("./assets/data/rep_data/" +
                               this.props.match.params.state).results
        var rep_info = null
        for (var i = 0; i < rep_json.length; i++) {
            console.log(rep_json[i].district)
            if (rep_json[i].district === this.props.match.params.district) {
                rep_info = reps_endpoint[rep_json[i].id]
                break
            }
        }

        let param_district = this.props.match.params.district
        var district_name = "District " + this.props.match.params.district
        if (param_district === "At-Large") {
            district_name = "At-Large District"
        }

        this.setState({rep: rep_info,
                       state: state_json[this.props.match.params.state],
                       district: district_name,
                       ready: true})
    }

    render() {
        let styles = {
            header: {
                paddingTop: "70px"
            }
        }

        return (
            <div style={styles.header} className="container">
                <h1>
                    {this.state.state} {this.state.district}
                </h1>

                <div className="row">
                    <div className="col-sm-4 col-sm-offset-2">
                        <RepresentativeInstance rep={this.state.rep} />
                    </div>
                    <div className="col-sm-4">
                    </div>
                </div>
            </div>
        )
    }
}
