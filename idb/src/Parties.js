import React, {Component} from 'react';

export default class Parties extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log(this.props.party_data)
        let mapping = Object.keys(this.props.party_data).map((key) =>
            <div key={key}>
                <h3>{key}</h3>
                <p>{this.props.party_data[key][0]}</p>
                <p>{this.props.party_data[key][1]}</p>
                <p>{this.props.party_data[key][2]}</p>
            </div>
        )

        return (
            <div>
                {mapping}
            </div>
        )
    }
}
