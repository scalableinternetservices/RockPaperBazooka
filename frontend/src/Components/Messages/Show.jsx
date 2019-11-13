import React from 'react';
import { Badge, ListGroup, ListGroupItem } from 'reactstrap';
import Client from "../../Clients/Client";

class Messages extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
<<<<<<< HEAD
        id: 1,
        messages: []
=======
        id: this.props.id,
        messages: [],
        users: new Map()
>>>>>>> bacc752... fixup connect messages to client
    };
  }

  componentDidMount() {
      Client.messages(this.state.id)
        .then(response => {
            console.log(response);
            this.setState({ messages: response.data });
        })
        .catch(console.log);
  }

  render() {
    const user_ids = [...new Set(this.state.messages.map(message => message.user_id))];
    return (
        <div className="test">
          <ListGroup>
            <ListGroupItem color="primary">Messages</ListGroupItem>
                {this.state.messages.map((message, index) => {
                    const color = user_ids[0] === message.user_id ? 'light' : 'dark';
                    return (<ListGroupItem key={message.id} style={{color: 'black'}} color={color}> <Badge>{message.user_id}</Badge>: {message.content} </ListGroupItem>);
                })}
          </ListGroup>
        </div>
    );
  }
}

export default Messages;
