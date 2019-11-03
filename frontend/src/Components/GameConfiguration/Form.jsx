import React from 'react';
import { Form, Button, Input } from 'reactstrap';

class ConfigForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', numMatches: 0, inputSet: '' };
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
        <Input name='name' placeholder='name' onChange={this.onChange}></Input>
        <br />
        <Input
          name='numMatches'
          type='number'
          placeholder='number of matches'
          onChange={this.onChange}
        ></Input>
        <br />
        <Input
          name='inputSet'
          placeholder='input set'
          onChange={this.onChange}
        ></Input>
        <br />
        <Button type='submit' color='primary'>
          Submit
        </Button>
      </Form>
    );
  }
}

export default ConfigForm;
