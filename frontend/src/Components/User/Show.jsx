import React from 'react';

function Show(props) {
  let user = props.user;
  return (
    <div>
      <p>Name: {user.name}</p>
      <a href='users/id/edit'>Edit</a> <br />
      <a href='users/id/delete'>Delete</a>
    </div>
  );
}

export default Show;
