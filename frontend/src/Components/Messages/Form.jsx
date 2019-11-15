import React from 'react';
import { Form, Button, Input } from 'reactstrap';
import Client from "../../Clients/Client";

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        match_id: this.props.match_id,
        user_id: this.props.user_id,
        content: ''
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
    this.setState({ content: "" });
  };

  onSubmit = e => {
    e.preventDefault();
    console.log(this.state);
    const message = {
        content: this.state.content,
        user_id: this.state.user_id,
        match_id: this.state.match_id
    };
    Client.createMessage(this.state.id, message)
      .then(response => {
        this.clearForm();
      })
      .catch(console.log);
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Input name='content' placeholder='message' value={this.state.content} onChange={this.onChange}></Input>
        <br />
        <Button type='submit' color='primary'>
          Send
        </Button>
      </Form>
    );
  }
}

export default MessageForm;
