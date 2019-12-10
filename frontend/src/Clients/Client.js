import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";
class Client {
  static users = () => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.get("/users");
  };
  static getUser = id => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.get(`/users/${id}`);
  };
  static deleteUser = id => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.delete(`/users/${id}`);
  };
  static createUser = data => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.post("/users", data);
  };
  static login = name => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.post("/login", { name });
  }
  static match = id => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.get(`/matches/${id}`);
  };
  static matches = (pageNum) => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.get(`/matches/?page=${pageNum}`);
  };
  static createMatch = data => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.post("/matches", data);
  };
  static joinMatch = (id, data) => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.patch(`/matches/${id}/join`, data)
  }
  static gameConfiguration = (id) => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.get(`/game_configurations/${id}`);
  };
  static gameConfigurations = (pageNum) => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.get(`/game_configurations/?page=${pageNum}`);
  };
  static gameConfiguration = id => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.get(`/game_configurations/${id}`);
  };
  static createGameConfigurations = data => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.post("/game_configurations", data);
  };
  static messages = id => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.get(`/matches/${id}/messages`);
  };
  static createMessage = (id, data) => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.post(`/matches/${id}/messages`, data);
  };
  static play = (id, player_id, game_input) => {
      axios.defaults.baseURL = localStorage.getItem("url");
    return axios.patch(`/matches/${id}/play`, {
      player_id,
      game_input
    })
  }
  static determineWinner = (player1moves, player2moves, items) => {
      let victor = 0;
      player1moves.forEach((player1move, index) => {
          const player2move = player2moves[index];
          const player1moveIndex = items.indexOf(player1move);
          const player2moveIndex = items.indexOf(player2move);
          if ((player1moveIndex + 1)%items.length === player2moveIndex) {
              victor--;
          } else if ((player2moveIndex + 1)%items.length === player1moveIndex) {
              victor++;
          }
      });
      return victor;
  }
  static isGameOver = (player1moves, player2moves, num_matches) => {
      return (player1moves.length === num_matches && player2moves.length === num_matches);
  }
}

export default Client;
