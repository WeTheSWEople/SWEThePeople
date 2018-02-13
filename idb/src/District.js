import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import header from './assets/images/header.png'
import './App.css';
import './District.css';
let state_json = require('./assets/data/state.json')
export default class Districts extends Component {
	constructor(props){
		super(props)
		this.state = {
			districts : 0,
			senator_count: 0,
			total_reps: 0,
            district_arr: [],
		}

	}
	componentWillMount(){
		let rep_json = require('./assets/data/rep_data/' + this.props.match.params.districtid + '.json')
		let senator_json = require('./assets/data/senate_data/' + this.props.match.params.districtid + '.json')
		let reps = this.state.total_reps
        var districts_list = []
		if(rep_json["status"] === "OK"){
			reps += rep_json["results"].length
            for (var i = 0; i < rep_json.results.length; i++) {
                var result = rep_json.results[i]
                var party = "Democratic"
                var cssColor = "light-blue"
                if (result["party"] === "R") {
                    party = "Republican"
                    cssColor = "light-red"
                } else if (result["party"] === "L") {
                    party = "Libertarian"
                    cssColor = "light-yellow"
                }

                districts_list.push({"district": result["district"],
                                     "party": party,
                                     "cssColor": cssColor,
                                     "rep_id": result["id"]})
                districts_list.sort(function(a, b) {
                    return parseInt(a.district) - parseInt(b.district)
                })
            }
			this.setState({districts: rep_json["results"].length,
                           total_reps: reps,
                           districts_arr: districts_list})
		}
		if(senator_json["status"] === "OK"){
			reps += senator_json["results"].length
			this.setState({senator_count: senator_json["results"].length, total_reps: reps})
		}
	}
  render() {
    
    let styles = {
        head: {
            paddingTop: "70px",
        }
    }

    let districts_grid = this.state.districts_arr.map(district =>
        <div class="col-sm-3 district-grid">
            <Link to={""}>
                <div class={"district-card " + district.cssColor}>
                    <h3>District {district.district}</h3>
                    <p>Party: {district.party}</p>
                </div>
            </Link>
        </div>
    )

	return (
        <div class="container" style={styles.head}>
            <h1 class="district-header">
                Districts of {state_json[this.props.match.params.districtid]}
            </h1>
            <div class="row">
                {districts_grid}
            </div>
        </div>
	);
  }
}
