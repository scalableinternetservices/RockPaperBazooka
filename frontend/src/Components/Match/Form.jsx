import React from "react";
import Client from "../../Clients/Client";
import { Form, Button, Input } from "reactstrap";

class MatchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      game_configuration_id: 0,
      configurations: []
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: parseInt(e.target.value) });
  };

  onSubmit = e => {
    e.preventDefault();
    console.log(this.state);
    let data = {
      input_set_1: "",
      input_set_2: "",
      user1_id: this.props.userId,
      game_configuration_id: this.state.game_configuration_id,
    }
    Client.createMatch(data)
      .then(response => {
        console.log(response)
      })
      .catch(console.log)
  };

  componentDidMount() {
    Client.gameConfigurations()
      .then(response => {
        console.log(response)
        this.setState({
          configurations: response.data
        })
      })
      .catch(console.log);
  }

  render() {

    let makeOption = configuration => {
      return (
        <option value={configuration.id} key={configuration.id}>
          {configuration.name}
        </option>
      );
    };

    return (
      <Form onSubmit={this.onSubmit}>
        <Input
          name="game_configuration_id"
          type="select"
          onChange={this.onChange}
        >
          {this.state.configurations.map(makeOption)}
        </Input>
        <br />
        <Button type="submit" color="primary">
          Submit
        </Button>
      </Form>
    );
  }
}

export default MatchForm;
