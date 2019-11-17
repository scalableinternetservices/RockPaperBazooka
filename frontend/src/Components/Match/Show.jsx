import React from 'react';
import Client from "../../Clients/Client";
import { Table } from 'reactstrap'

class Show extends React.Component {
  	constructor(props){
		super(props);
		this.state = {
			matchData: {},
			player1moves: [],
			player2moves: [],
			numMoves: 0
		}
	}

	componentDidMount() {
		this.getMatch();
	}

	getMatch = () => {
        Client.match(this.props.matchId)
            .then(response => {
                console.log(response);
                let player1moves = response.data.input_set_1.split(" ")
                let player2moves = response.data.input_set_2.split(" ")
                this.setState({ 
					matchData: response.data,
					numMoves: Math.max(player1moves.length, player2moves.length),
					player1moves,
					player2moves 
				});
                // this.getUserNames(user_ids)
            })
            .catch(console.log);
        setTimeout(this.getMatch, 2000);
    };

	render() {
		const items = []
        for (let i = this.state.numMoves-1; i > 0; i--) {
            items.push(
                <tr>
                    <td>{i}</td>
                    <td>{this.state.player1moves[i]}</td>
                    <td>{this.state.player2moves[i]}</td>
                </tr>
            )
        }

		return (
			<div>
				<p>Match id: {this.props.matchId}</p>
				<Table>
                    <thead>
                        <tr>
                            <th>Move</th>
                            <th>Player 1</th>
                            <th>Player 2</th>
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

export default Show;
