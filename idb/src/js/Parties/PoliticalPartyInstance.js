import '../../assets/css/PoliticalPartyInstance.css';
import React, {Component} from 'react';
import { Link } from 'react-router-dom'

export default class Parties extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const styles = {
            imgStyle: {
                width: "50%"
            },
            itemHeader: {
                marginRight: "5px"
            }
        }

        let mapping = Object.keys(this.props.party_data).map((key) =>
            <Link to={`/party/${this.props.party_data[key]["name"]}`} >
                <div class="row party-index-card">
                    <div class="col-md-8 col-md-offset-2">
                        <div class="row">
                            <div class="col-md-6">
                                <div key={key} class="center-div">
                                    <img src={require("../../assets/images/parties/" + key + ".png")}
                                           className="img-responsive"
                                           style={styles.imgStyle}
                                           alt={key} />
                                </div>
                            </div>
                            <div class="col-md-6 party-index-name">
                                <h3>{key} Party</h3>
                                <p>
                                    <span style={styles.itemHeader}>
                                        Number of representatives:
                                    </span>
                                    {this.props.party_data[key]["num_reps"]}
                                </p>
                                <p>
                                    <span style={styles.itemHeader}>
                                        Party chair:
                                    </span>
                                    {this.props.party_data[key]["chair"]}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        )

        return (
            <div class="container">
                {mapping}
            </div>
        )
    }
}
