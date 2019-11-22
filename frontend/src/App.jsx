import React from "react";
import "./App.css";
import GameConfigurationForm from "./Components/GameConfiguration/Form";
import UserForm from "./Components/User/Form";
import User from "./Components/User/Show";
import MatchForm from "./Components/Match/Form";
import Match from "./Components/Match/Show";
import Amalgamation from "./Components/Amalgamation"
import Header from "./Components/Header/Header";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

class App extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
          name: "",
          id: 2,
          currentMatchId: 3
      };
  }

  updateName = (name, id) => {
      this.setState({
        name,
        id
      });
  };

  updateCurrentMatch = (matchId) => {
      this.setState({ currentMatchId: matchId });
  };

  render() {
      return (
        <Router>
            <div className="App">
                <Header />
                <Switch>
                    <Route path="/config_creator">
                        <GameConfigurationForm /> <br />
                    </Route>
                    <Route path="/create">
                        <MatchForm
                            userId={this.state.id}
                            updateCurrentMatch={this.updateCurrentMatch}
                        />
                    </Route>
                    <Route path="/match">
                        <Match matchId={this.state.currentMatchId} userId={this.state.id} userName={this.state.name} />
                    </Route>
                    <Route path="/matches">
                        <Amalgamation updateCurrentMatch={this.updateCurrentMatch} userId={this.state.id}/>
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
