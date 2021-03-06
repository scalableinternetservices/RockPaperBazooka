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
            gameConfiguration: {},
            finalScore: 0,
            isGameOver: false,
            lastPlayedMove: ""
		}
	}

	componentDidMount() {
        this.getMatch();
    }

	getMatch = () => {
        Client.match(this.props.matchId)
            .then(response => {
                let player1moves = response.data.match.input_set_1 ? response.data.match.input_set_1.trim().split(" ") : [];
                let player2moves = response.data.match.input_set_2 ? response.data.match.input_set_2.trim().split(" ") : [];
                this.setState({
					matchData: response.data.match,
					numMoves: Math.min(player1moves.length, player2moves.length),
					player1moves,
                    player2moves,
                    username1: response.data.match.user1.name,
                    username2: response.data.match.user2 ? response.data.match.user2.name : "",
                });
                if(response.data.match.user2_id == null && this.props.userId !== response.data.match.user1_id){
                    let data = {
                        user2_id: this.props.userId,
                    }
                    this.setState({ username2: this.props.userName });
                    Client.joinMatch(response.data.match.id, data)
                        .then(response => {
                            console.log(response)
                        })
                }
                if(this.state.input_set.length === 0) {
                    Client.gameConfiguration(response.data.match.game_configuration_id)
                    .then(response => {
                        let input_set = response.data.input_set.trim().split(" ")
                        this.setState({
                            input_set,
                            selectedMove: input_set[0],
                            gameConfiguration: response.data
                        })
                        console.log(response)
                    })
                }
                if (Client.isGameOver(this.state.player1moves, this.state.player2moves, this.state.gameConfiguration.num_matches)) {
                    const victor = Client.determineWinner(this.state.player1moves, this.state.player2moves, this.state.input_set);
                    this.setState({
                        finalScore: victor,
                        isGameOver: true
                    });
                }
            })
            .catch(console.log);
        setTimeout(this.getMatch, 2000);
    };

    playMove = e => {
        e.preventDefault();
        Client.play(this.props.matchId, this.props.userId, this.state.selectedMove)
            .then(response => {
                this.setState({ lastPlayedMove: this.state.selectedMove });
            })
            .catch(error => {
                alert(error.response.data.error);
            });
    };

    onChange = e => {
          this.setState({ selectedMove: e.target.value });
      };

	render() {
		const items = []
        for (let i = this.state.numMoves-1; i >= 0; i--) {
            items.push(
                <tr>
                    <td>{i + 1}</td>
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

        const winBanner = [];
        if (this.state.finalScore > 0) {
            winBanner.push(<h1>{this.state.username1} Won!</h1>);
        } else if (this.state.finalScore < 0) {
            winBanner.push(<h1>{this.state.username2} Won!</h1>);
        } else {
            winBanner.push(<h1>Draw!</h1>);
        }

		return (
			<div>
                {this.state.isGameOver ? winBanner : null}
                {this.state.username2 === "" ? <h2>Waiting for Player 2 to join...</h2> : null}
                <h3>Configuration: {this.state.gameConfiguration.name} ({this.state.gameConfiguration.num_matches} matches)</h3>
				<Form style={{paddingBottom: '50px', margin: 'auto', width: '30%'}} onSubmit={this.playMove}>
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
                <h4>Last submitted move: {this.state.lastPlayedMove}</h4>
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
