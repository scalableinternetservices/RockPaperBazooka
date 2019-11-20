import React from 'react';
import Client from "../../Clients/Client";
import Messages from "../Messages/Show";
import MessageForm from "../Messages/Form";
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
            input_set: [],
            selectedMove: "",
            username1: "",
            username2: "",
            gameConfiguration: {}
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
                this.getUsernames();
                if(response.data.user2_id == null && this.props.userId !== response.data.user1_id){
                    let data = {
                        user2_id: this.props.userId,
                    }
                    this.setState({ username2: this.props.userName });
                    Client.joinMatch(response.data.id, data)
                        .then(response => {
                            console.log(response)
                        })
                }
                if(this.state.input_set.length === 0) {
                    Client.gameConfiguration(response.data.game_configuration_id)
                    .then(response => {
                        let input_set = response.data.input_set.split(" ")
                        this.setState({
                            input_set,
                            selectedMove: input_set[0],
                            gameConfiguration: response.data
                        })
                        console.log(response)
                    })
                }
                // this.getUserNames(user_ids)
            })
            .catch(console.log);
        setTimeout(this.getMatch, 2000);
    };

    getUsernames = () => {
        if (this.state.username1 === "") {
            Client.getUser(this.state.matchData.user1_id)
                .then(response => {
                    this.setState({ username1: response.data.name })
                })
                .catch(console.log);
        }
        if (this.state.matchData.user2_id !== null && this.state.username2 === "") {
            Client.getUser(this.state.matchData.user2_id)
                .then(response => {
                    this.setState({ username2: response.data.name });
                })
                .catch(console.log);
        }
    };

    playMove = e => {
        e.preventDefault();
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
				<Form style={{paddingBottom: '50px', margin: 'auto', width: '30%'}} onSubmit={this.playMove}>
                    {this.state.username2 === "" ? <h2>Waiting for Player 2 to join...</h2> : null}
                    <h3>Configuration: {this.state.gameConfiguration.name} ({this.state.gameConfiguration.num_matches} matches)</h3>
                    <h2>Play move</h2>
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
                <h2>Previous Moves</h2>
				<Table style={{marginBottom: '50px'}}>
                    <thead>
                        <tr>
                            <th>Move</th>
                            <th>{this.state.username1}</th>
                            <th>{this.state.username2 === "" ? 'Player 2' : this.state.username2}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items}
                    </tbody>
                </Table>
                <div style={{margin: 'auto', width: '50%'}}>
                    <Messages id={this.props.matchId} />
                    <MessageForm match_id={this.props.matchId} user_id={this.props.userId} />
                </div>
			</div>
		);
	}
}

export default Show;
