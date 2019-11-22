import React from 'react';
import "./MatchTable.css"
import Client from "../../Clients/Client";
import { Button, Table } from 'reactstrap'
import {
  Redirect
} from "react-router-dom";

class MatchTable extends React.Component{
    constructor(props){
            super(props)
            this.state = {
                matches: [],
                users: new Map(),
                redirect: false,
                configurations: new Map()
            }
    }

    componentDidMount() {
        this.getMatches()
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutId);
    }

    getMatches = () => {
        Client.matches()
            .then(response => {
                console.log(response);
                const user_ids = []
                const configuration_ids = [];
                response.data.forEach(element => {
                    configuration_ids.push(element.game_configuration_id);
                    user_ids.push(element.user1_id)
                    if(element.user2_id) {
                        user_ids.push(element.user2_id)
                    }
                })
                this.setState({ matches: response.data });
                this.getUserNames(user_ids);
                this.getConfigurations(configuration_ids);
            })
            .catch(console.log);
        this.timeoutId = setTimeout(this.getMatches, 2000);
    };

    getUserNames = (user_ids) => {
        user_ids.forEach(user_id => {
            if (!(this.state.users.get(user_id))) {
                Client.getUser(user_id)
                    .then(response => {
                        const { users } = this.state;
                        console.log(response);
                        users.set(user_id, response.data.name);
                        this.setState({ users });
                    })
                    .catch(console.log);
            }
        });
      };

    getConfigurations = (configuration_ids) => {
        configuration_ids.forEach(configuration_id => {
            if (!(this.state.configurations.get(configuration_id))) {
                Client.gameConfiguration(configuration_id)
                    .then(response => {
                        const { configurations } = this.state;
                        console.log(response);
                        configurations.set(configuration_id, response.data);
                        this.setState({ configurations });
                    })
                    .catch(console.log);
            }
        });
    }

    onClick = (matchId) => {
        this.props.updateCurrentMatch(matchId);
        this.setState({ redirect: true });
    };

    render() {
        const sortedMatches = this.state.matches.sort(function(a, b) {
            let order = 1;
            if (a.user2_id === null && b.user2_id !== null) {
                order = -1;
            } else if (a.user2_id !== null && b.user2_id === null ) {
                order = 1;
            }
            return order;
        });
        const itemsMine = []
        const itemsOther = []
        for (const [index, value] of sortedMatches.entries()) {
            const player1moves = value.input_set_1 ? value.input_set_1.trim().split(" ") : [];
            const player2moves = value.input_set_2 ? value.input_set_2.trim().split(" ") : [];
            const configuration = this.state.configurations.get(value.game_configuration_id);
            if (configuration && !Client.isGameOver(player1moves, player2moves, configuration)) {
                debugger;
                if(value.user1_id === this.props.userId || value.user2_id === this.props.userId){
                    itemsMine.push(
                        <tr key={index}>
                            <td><Button className="button" type="submit" color="primary" onClick={() => {this.onClick(value.id)}}>Resume</Button></td>
                            <td>{this.state.users.get(value.user1_id)}</td>
                            <td>{this.state.users.get(value.user2_id)}</td>
                            <td>{configuration ? configuration.name : null}</td>
                        </tr>
                    )
                } else {
                    itemsOther.push(
                        <tr key={index}>
                            <td><Button className="button" type="submit" color="primary" onClick={() => {this.onClick(value.id)}}>{value.user2_id ? 'Spectate' : 'Join'}</Button></td>
                            <td>{this.state.users.get(value.user1_id)}</td>
                            <td>{this.state.users.get(value.user2_id)}</td>
                            <td>{configuration ? configuration.name : null}</td>
                        </tr>
                    )
                }
            }
        }

        return (
            <div>
                {this.state.redirect ? <Redirect to='/match' /> : null}
                <h2>Your Current Matches</h2>
                <Table>
                    <thead>
                        <tr>
                            <th>Join / Spectate</th>
                            <th>Player 1</th>
                            <th>Player 2</th>
                            <th>Configuration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsMine}
                    </tbody>
                </Table>
                <h2>Other Current Matches</h2>
                <Table>
                    <thead>
                        <tr>
                            <th>Join / Spectate</th>
                            <th>Player 1</th>
                            <th>Player 2</th>
                            <th>Configuration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsOther}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default MatchTable;
