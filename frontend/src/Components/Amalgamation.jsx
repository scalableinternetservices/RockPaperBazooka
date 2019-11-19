import React from 'react';
// import ".MatchTable.css";
import {
    Link
  } from "react-router-dom";

import MatchTable from "./MatchTable/MatchTable"

class Amalgamation extends React.Component {

    render() {
        return (
            <>
                <Link to="/config_creator">Create a Configuration</Link>
                <Link to="/create">Create a Match</Link>
                <MatchTable
                    updateCurrentMatch={this.props.updateCurrentMatch}
                />
            </>
        )
    }
}

export default Amalgamation;
