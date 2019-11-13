import React from 'react';

function Show(props) {
  let match = props.match;
  return (
    <div>
      <p>Configuration id: {match.game_configuration_id}</p>
      <a href='matches/id/edit'>Edit</a> <br />
      <a href='matches/id/delete'>Delete</a>
    </div>
  );
}

export default Show;
