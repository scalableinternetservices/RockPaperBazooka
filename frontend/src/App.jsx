import React from 'react';
import logo from './logo.svg';
import './App.css';
import GameConfigurationForm from './Components/GameConfiguration/Form';
import GameConfiguration from './Components/GameConfiguration/Show';

function App() {
  return (
    <div className='App'>
      <GameConfiguration gameConfiguration={{}} />
      <GameConfigurationForm />
    </div>
  );
}

export default App;
