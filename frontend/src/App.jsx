import React from 'react';
import logo from './logo.svg';
import './App.css';
import GameConfigurationForm from './Components/GameConfiguration/Form';
import GameConfiguration from './Components/GameConfiguration/Show';
import UserForm from './Components/User/Form';
import User from './Components/User/Show';
function App() {
  return (
    <div className='App'>
      <GameConfiguration gameConfiguration={{}} />
      <GameConfigurationForm />
      <User user={{ name: 'Scotty McGee' }} />
      <UserForm />
    </div>
  );
}

export default App;
