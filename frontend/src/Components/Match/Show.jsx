import React from 'react';

function Show(props) {
  let matchId = props.matchId;
  return (
    <div>
      <p>Match id: {matchId}</p>
      <a href='matches/id/edit'>Edit</a> <br />
      <a href='matches/id/delete'>Delete</a>
    </div>
  );
}

export default Show;
