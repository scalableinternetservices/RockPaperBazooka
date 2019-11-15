import React from "react";
import "./App.css";
import GameConfigurationForm from "./Components/GameConfiguration/Form";
import GameConfiguration from "./Components/GameConfiguration/Show";
import UserForm from "./Components/User/Form";
import User from "./Components/User/Show";
import MatchForm from "./Components/Match/Form";
import Match from "./Components/Match/Show";
import MatchTable from "./Components/MatchTable/MatchTable"
import Messages from "./Components/Messages/Show";
import MessageForm from "./Components/Messages/Form";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

class App extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
          name: ""
      };
  }

  updateName = (name) => {
      this.setState({ name });
  }

  render() {
      return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/configuration">
                        <GameConfiguration gameConfiguration={{}} />
                        <GameConfigurationForm /> <br />
                    </Route>
                    <Route path="/messages">
                        <Messages id={1} />
                        <MessageForm match_id={1} user_id={1} /> <br />
                    </Route>
                    <Route path="/match">
                        <Match match={{ game_configuration_id: 0 }} />
                        <MatchForm /> <br />
                    </Route>
                    <Route path="/user">
                        <User user={{ name: this.state.name }} />
                    </Route>
                    <Route path="/">
                        <UserForm updateName={this.updateName} />
                    </Route>
                </Switch>
            </div>
        </Router>
      );
  }
}

export default App;
