import React from 'react';

function Show() {
  let messages = ['message 1', 'message 2', 'message 3', 'message 4'];
  return (
    <div>
      {messages.map(message => <p>{message}</p>)}
    </div>
  );
}

export default Show;
