import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
class Client {
  static users = () => {
    return axios.get("/users");
  };
  static getUser = id => {
    return axios.get(`/users/${id}`);
  };
  static deleteUser = id => {
    return axios.delete(`/users/${id}`);
  };
  static createUser = data => {
    return axios.post("/users", data);
  };
  static match = id => {
    return axios.get(`/matches/${id}`);
  };
  static matches = () => {
    return axios.get("/matches");
  };
  static createMatch = data => {
    return axios.post("/matches", data);
  };
  static gameConfiguration = (id) => {
    return axios.get(`/game_configurations/${id}`);
  };
  static gameConfigurations = () => {
    return axios.get("/game_configurations");
  };
  static gameConfiguration = id => {
    return axios.get(`/game_configurations/${id}`);
  };
  static createGameConfigurations = data => {
    return axios.post("/game_configurations", data);
  };
  static messages = id => {
    return axios.get(`/matches/${id}/messages`);
  };
  static createMessage = (id, data) => {
    return axios.post(`/matches/${id}/messages`, data);
  };
  static play = (id, player_id, game_input) => {
    return axios.patch(`/matches/${id}/play`, {
      player_id,
      game_input
    })
  }
}

export default Client;
