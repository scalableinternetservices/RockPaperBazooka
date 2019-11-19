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
                redirect: false
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
                response.data.forEach(element => {
                    user_ids.push(element.user1_id)
                    if(element.user2_id) {
                        user_ids.push(element.user2_id)
                    }
                })
                this.setState({ matches: response.data });
                this.getUserNames(user_ids)
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

    onClick = (matchId) => {
        this.props.updateCurrentMatch(matchId);
        this.setState({ redirect: true });
    };

    render() {
        const sortedMatches = this.state.matches.sort(function(a, b) {
            const order = a.user2_id === null ? -1 : 1;
            return order;
        });
        const items = []
        for (const [index, value] of sortedMatches.entries()) {
            items.push(
                <tr key={index}>
                    <td><Button className="button" type="submit" color="primary" onClick={() => {this.onClick(value.id)}}>{value.user2_id ? 'Spectate' : 'Join'}</Button></td>
                    <td>{this.state.users.get(value.user1_id)}</td>
                    <td>{this.state.users.get(value.user2_id)}</td>
                    <td>{value.game_configuration_id}</td>
                </tr>
            )
        }

        return (
            <div>
                {this.state.redirect ? <Redirect to='/match' /> : null}
                <h2>Matches</h2>
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
                        {items}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default MatchTable;
