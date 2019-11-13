import React from "react";
import { Form, Button, Input } from "reactstrap";

class MatchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { game_configuration_id: 0 };
  }

  onChange = e => {
    if (e.target.type === "number") {
      this.setState({ [e.target.name]: parseInt(e.target.value) });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  onSubmit = e => {
    e.preventDefault();
    console.log(this.state);
  };

  render() {
    let configurations = [
      { id: 0, name: "Rock Paper Scissors" },
      { id: 1, name: "Rock Paper Bazooka" }
    ];

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
          {configurations.map(makeOption)}
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
