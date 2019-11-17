import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Client from "../../Clients/Client";

class Show extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            configurationId: this.props.gameConfigurationId,
            configuration: {}
        };
    }

    componentDidMount() {
        Client.gameConfiguration(this.state.configurationId)
          .then(response => {
              console.log(response);
              this.setState({ configuration: response.data });
          })
          .catch(console.log);
    }

    render() {
      return (
        <div>
            <ListGroup>
              <ListGroupItem>Name: {this.state.configuration.name}</ListGroupItem>
              <ListGroupItem>Number of Matches: {this.state.configuration.num_matches}</ListGroupItem>
              <ListGroupItem>Input Set: {this.state.configuration.input_set}</ListGroupItem>
            </ListGroup>
        </div>
      );
    }
}

export default Show;
