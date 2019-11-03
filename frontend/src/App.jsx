import React from 'react';
import logo from './logo.svg';
import './App.css';
import GameConfigurationForm from './Components/GameConfiguration/Form';
import GameConfiguration from './Components/GameConfiguration/Show';
import UserForm from './Components/User/Form';
import User from './Components/User/Show';
import MatchForm from './Components/Match/Form';
import Match from './Components/Match/Show';
function App() {
  return (
    <div className='App'>
      <Match match={{ game_configuration_id: 0 }} />
      <MatchForm /> <br />
      <GameConfiguration gameConfiguration={{}} />
      <GameConfigurationForm /> <br />
      <User user={{ name: 'Scotty McGee' }} />
      <UserForm />
    </div>
  );
}

export default App;
