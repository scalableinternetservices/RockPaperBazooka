import React from "react";
import "./App.css";
import GameConfigurationForm from "./Components/GameConfiguration/Form";
import GameConfiguration from "./Components/GameConfiguration/Show";
import UserForm from "./Components/User/Form";
import User from "./Components/User/Show";
import MatchForm from "./Components/Match/Form";
import Match from "./Components/Match/Show";
<<<<<<< HEAD
import MatchTable from "./Components/MatchTable/MatchTable"
=======
import Messages from "./Components/Messages/Show";
import MessageForm from "./Components/Messages/Form";
>>>>>>> at - show messaging on main page for now

function App() {
  return (
    <div className="App">
      <MatchTable />
      <Match match={{ game_configuration_id: 0 }} />
      <MatchForm /> <br />
      <Messages id={1} />
      <MessageForm match_id={1} user_id={1} /> <br />
      <GameConfiguration gameConfiguration={{}} />
      <GameConfigurationForm /> <br />
      <User user={{ name: "Scotty McGee" }} />
      <UserForm />
    </div>
  );
}

export default App;
