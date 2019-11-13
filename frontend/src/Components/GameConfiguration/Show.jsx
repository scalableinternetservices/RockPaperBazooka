import React from 'react';

function Show(props) {
  let config = props.gameConfiguration;
  config.name = 'Rock Paper Scissors';
  config.numMatches = 5;
  config.inputSet = 'rock paper scissors';
  return (
    <div>
      <p>Name: {config.name}</p>
      <p>Number of Matches: {config.numMatches}</p>
      <p>Input Set: {config.inputSet}</p>
      <a href='gameConfigurations/id/edit'>Edit</a> <br />
      <a href='gameConfigurations/id/delete'>Delete</a>
    </div>
  );
}

export default Show;
