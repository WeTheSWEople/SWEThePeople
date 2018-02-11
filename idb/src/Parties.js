import React, {Component} from 'react';
import { Link } from 'react-router-dom'

export default class Parties extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let mapping = Object.keys(this.props.party_data).map((key) =>
            <Link to={`/party/${this.props.party_data[key][0]}`} >
                <div key={key}>
                    <h3>{key}</h3>
                    <p>{this.props.party_data[key][1]}</p>
                    <p>{this.props.party_data[key][2]}</p>
                    <p>{this.props.party_data[key][3]}</p>
                </div>
            </Link>
        )

        return (
            <div>
                {mapping}
            </div>
        )
    }
}
