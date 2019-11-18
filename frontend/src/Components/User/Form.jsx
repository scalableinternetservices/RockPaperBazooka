import React from "react";
import "./Form.css";
import { Form, Button, Input } from "reactstrap";
import Client from "../../Clients/Client";
import {
  Redirect
} from "react-router-dom";

class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        name: "",
        loggedIn: false
    };
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
        this.props.updateName(this.state.name);
        this.clearForm();
        this.setState({ loggedIn: true });
      })
      .catch(error => {
        if (error.response.data.name[0] === 'has already been taken') {
            this.props.updateName(this.state.name);
            this.clearForm();
            this.setState({ loggedIn: true });
        }
    });
  };

  render() {
    return (
      <div className="form">
          {this.state.loggedIn ? <Redirect to='/matches' /> : null}
          <h2>Login</h2>
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
      </div>
    );
  }
}

export default UserForm;
