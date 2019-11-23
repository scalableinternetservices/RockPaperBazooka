import React from 'react';
import { Badge, ListGroup, ListGroupItem } from 'reactstrap';
import Client from "../../Clients/Client";

class Messages extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        id: this.props.id,
        messages: [],
        users: new Map()
    };
  }

  componentDidMount() {
    this.getMessages();
  }

  componentWillUnmount() {
      clearTimeout(this.timeoutId);
  }

  getMessages = () => {
      Client.messages(this.state.id)
        .then(response => {
            console.log(response);
            const user_ids = [...new Set(response.data.map(message => message.user_id))];
            this.setState({ messages: response.data });
            this.getUserNames(user_ids);
        })
        .catch(console.log);
      this.timeoutId = setTimeout(this.getMessages, 2000);
  };

  getUserNames = (user_ids) => {
    user_ids.forEach(user_id => {
        if (!(this.state.users.get(user_id))) {
            Client.getUser(user_id)
                .then(response => {
                    const { users } = this.state;
                    console.log(response);
                    users.set(user_id, response.data.name);
                    this.setState({ users });
                })
                .catch(console.log);
        }
    });
  };

  render() {
    return (
        <div>
          <ListGroup>
            <ListGroupItem color="primary">Messages</ListGroupItem>
                {this.state.messages.map((message, index) => {
                    return (
                        <ListGroupItem key={message.id}>
                            <Badge>{this.state.users.get(message.user_id)}</Badge>: {message.content}
                        </ListGroupItem>
                    );
                })}
          </ListGroup>
        </div>
    );
  }
}

export default Messages;
