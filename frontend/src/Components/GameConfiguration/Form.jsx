import React from 'react';
import { Form, Button, Input } from 'reactstrap';
import { Redirect } from "react-router-dom";
import Client from "../../Clients/Client";

class ConfigForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        name: '',
        num_matches: 0,
        input_set: '',
        redirect: false
    };
  }

  onChange = e => {
    if (e.target.type === 'number') {
      this.setState({ [e.target.name]: parseInt(e.target.value) });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  onSubmit = e => {
    e.preventDefault();
    console.log(this.state);
    Client.createGameConfigurations(this.state)
      .then(response => {
        this.setState({ redirect: true})
        console.log(response);
      })
      .catch(console.log);
  };

  render() {
    return (
      <>
        {this.state.redirect ? <Redirect to='/matches' /> : null}
        <h2>Create Configuration</h2>
        <Form onSubmit={this.onSubmit}>
          <Input name='name' placeholder='name' onChange={this.onChange}></Input>
          <br />
          <Input
            name='num_matches'
            type='number'
            placeholder='number of matches'
            onChange={this.onChange}
          ></Input>
          <br />
          <Input
            name='input_set'
            placeholder='input set'
            onChange={this.onChange}
          ></Input>
          <br />
          <Button type='submit' color='primary'>
            Submit
          </Button>
        </Form>
      </>
    );
  }
}

export default ConfigForm;
