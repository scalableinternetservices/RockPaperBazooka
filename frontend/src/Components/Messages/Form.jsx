import React from 'react';
import { Form, Button, Input } from 'reactstrap';

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: '' };
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
    // this.props.onSubmit();
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Input name='message' placeholder='message' onChange={this.onChange}></Input>
        <br />
        <Button type='submit' color='primary'>
          Send
        </Button>
      </Form>
    );
  }
}

export default MessageForm;
