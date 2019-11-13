import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

function Show() {
  let messages = ['message 1', 'message 2', 'message 3', 'message 4'];
  return (
    <div>
      <ListGroup>
        <ListGroupItem color="primary">Messages</ListGroupItem>
            {messages.map((message, index) => {
                const color = index%2 === 0 ? 'light' : 'dark';
                return (<ListGroupItem color={color}> {message} </ListGroupItem>);
            })}
      </ListGroup>
    </div>
  );
}

export default Show;
