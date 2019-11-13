import React from "react";
import { Form, Button, Input } from "reactstrap";
import Client from "../../Clients/Client";

class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };
    Client.users()
      .then(console.log)
      .catch(console.log);
  }

  onChange = e => {
    if (e.target.type === "number") {
      this.setState({ [e.target.name]: parseInt(e.target.value) });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  clearForm = () => {
    this.setState({ name: "" });
  };

  onSubmit = e => {
    e.preventDefault();
    console.log(this.state);
    Client.createUser(this.state)
      .then(response => {
        console.log("It works!");
        this.clearForm();
      })
      .catch(console.log);
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Input
          name="name"
          placeholder="name"
          onChange={this.onChange}
          value={this.state.name}
        ></Input>
        <br />
        <Button type="submit" color="primary">
          Submit
        </Button>
      </Form>
    );
  }
}

export default UserForm;
