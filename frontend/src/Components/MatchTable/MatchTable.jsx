import React from 'react';
import Client from "../../Clients/Client";
import { Table } from 'reactstrap'

class MatchTable extends React.Component{
    constructor(props){
            super(props)
            this.state = {
                matches: []
            }
            Client.matches()
                .then((response) => {
                    console.log(response)
                    this.setState({
                        matches: response.data
                    })
                })
                .then(console.log);
    }  

    render() {

        const items = []
        for (const [index, value] of this.state.matches.entries()) {
            items.push(
                <tr>
                    <th scope="row">{index}</th>
                    <td>{value.user1_id}</td>
                    <td>{value.user2_id}</td>
                    <td>{value.game_configuration_id}</td>
                </tr>
            )
        }

        return (
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Player 1</th>
                        <th>Player 2</th>
                        <th>Configuration</th>
                    </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </Table>
        );
    }
}

export default MatchTable;
