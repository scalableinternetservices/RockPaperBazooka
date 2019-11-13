import React from 'react';
import { Badge, ListGroup, ListGroupItem } from 'reactstrap';

function Show() {
  let messages = [
      {content: 'message 1', user_id: 1},
      {content: 'message 2', user_id: 1},
      {content: 'message 3', user_id: 2},
      {content: 'message 4', user_id: 1}
  ];
  const user_ids = [...new Set(messages.map(message => message.user_id))];
  return (
    <div className="test">
      <ListGroup>
        <ListGroupItem color="primary">Messages</ListGroupItem>
            {messages.map((message, index) => {
                const color = user_ids[0] === message.user_id ? 'light' : 'dark';
                return (<ListGroupItem style={{color: 'black'}} color={color}> <Badge>{message.user_id}</Badge>: {message.content} </ListGroupItem>);
            })}
      </ListGroup>
    </div>
  );
}

export default Show;
