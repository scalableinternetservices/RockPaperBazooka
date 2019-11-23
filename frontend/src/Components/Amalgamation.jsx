import React from 'react';
import { Button } from 'reactstrap';
import {
    Link
  } from "react-router-dom";

import MatchTable from "./MatchTable/MatchTable"

class Amalgamation extends React.Component {

    render() {
        return (
            <>
                <Button style={{marginBottom: '50px'}} type="submit" color="primary">
                    <Link style={{color: 'white'}} to="/config_creator">Create a Configuration</Link>
                </Button>
                <br />
                <Button style={{marginBottom: '50px'}} type="submit" color="primary">
                    <Link style={{color: 'white'}} to="/create">Create a Match</Link>
                </Button>
                <MatchTable
                    updateCurrentMatch={this.props.updateCurrentMatch} userId={this.props.userId}
                />
            </>
        )
    }
}

export default Amalgamation;
