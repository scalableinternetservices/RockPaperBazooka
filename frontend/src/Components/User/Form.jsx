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
        loggedIn: false,
        url: "http://app1t3microdbt3micro.2iscm2mqr5.us-west-2.elasticbeanstalk.com/"
    };
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
    localStorage.setItem("url", this.state.url);
    Client.login(this.state.name)
      .then(response => {
        this.props.updateName(this.state.name, response.data.id);
        this.clearForm();
        this.setState({ loggedIn: true });

      })
      .catch(error => {
        alert("Shouldn't be possible to get there")
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
            <Input
              name="url"
              placeholder="url"
              onChange={this.onChange}
              value={this.state.url}
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
