import React from 'react';

function Show(props) {
  let user = props.user;
  return (
    <div>
      <p>Name: {user.name}</p>
    </div>
  );
}

export default Show;
