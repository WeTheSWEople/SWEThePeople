import React, {Component} from 'react';
import { Link } from 'react-router-dom'

export default class Parties extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        var imgStyle = {
            width: "10%"
        }

        let mapping = Object.keys(this.props.party_data).map((key) =>
            <Link to={`/party/${this.props.party_data[key]["id"]}`} >
                <div key={key}>
                    <img src={require("./assets/images/parties/" + key + ".png")}
                           style={imgStyle}
                           alt={key} />
                    <h3>{key} Party</h3>
                    <p>
                        Number of reps: {this.props.party_data[key]["num_reps"]}
                    </p>
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
