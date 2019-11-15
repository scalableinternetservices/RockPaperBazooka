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
  static matches = () => {
    return axios.get("/matches");
  };
  static createMatch = data => {
    return axios.post("/matches", data);
  };
  static gameConfigurations = () => {
    return axios.get("/game_configurations");
  };
  static createGameConfigurations = data => {
    return axios.post("/game_configurations", data);
  };
}

export default Client;
