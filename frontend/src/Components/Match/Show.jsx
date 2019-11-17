import React from 'react';
import Client from "../../Clients/Client";
import { Form, Button, Input } from "reactstrap";
import { Table } from 'reactstrap'

class Show extends React.Component {
  	constructor(props){
		super(props);
		this.state = {
			matchData: {},
			player1moves: [],
			player2moves: [],
            numMoves: 0,
            input_set: ["fluff", "fluff", "invalid"],
            selectedMove: "fluff" 
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

    playMove = e => {
        e.preventDefault();
        debugger;
        Client.play(this.props.matchId, this.props.userId, this.state.selectedMove)
    };

    onChange = e => {
          this.setState({ selectedMove: e.target.value });
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

        let makeOption = item => {
            return (
              <option value={item}>
                {item}
              </option>
            );
          };

		return (
			<div>
				<Form onSubmit={this.playMove}>
                    <Input
                        name="game_configuration_id"
                        type="select"
                        onChange={this.onChange}
                    >
                        {this.state.input_set.map(makeOption)}
                    </Input>
                    <br />
                    <Button type="submit" color="primary">
                        Submit Move
                    </Button>
                </Form>
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
