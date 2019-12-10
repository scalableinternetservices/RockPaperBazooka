import React from "react";
import Client from "../../Clients/Client";
import { Button, Input, Table } from "reactstrap";
import { Redirect } from "react-router-dom";

class MatchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configurations: [],
      redirect: false,
      pageNumber: 1,
      pageInput: 1
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: parseInt(e.target.value) });
  };

  onChange2 = e => {
    if (e.target.type === "number") {
      this.setState({ [e.target.name]: parseInt(e.target.value) });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  setPageNumber = () => {
      this.setState({ pageNumber: this.state.pageInput})
      Client.gameConfigurations(this.state.pageInput)
        .then(response => {
          console.log(response)
          this.setState({
            configurations: response.data,
          })
        })
        .catch(console.log);
  }

  onSubmit = (configurationId) => {
    console.log(this.state);
    let data = {
      input_set_1: "",
      input_set_2: "",
      user1_id: this.props.userId,
      game_configuration_id: configurationId,
    }

    Client.createMatch(data)
      .then(response => {
        this.props.updateCurrentMatch(response.data.match.id)
        this.setState({ redirect: true})
      })
      .catch(console.log)
  };

  componentDidMount() {
    Client.gameConfigurations(this.state.pageNumber)
      .then(response => {
        console.log(response)
        this.setState({
          configurations: response.data,
        })
      })
      .catch(console.log);
  }

  render() {

    const configurations = []
    for (const [index, value] of this.state.configurations.entries()) {
        configurations.push(
            <tr key={index}>
                <td>{value.name}</td>
                <td><Button className="button" type="submit" color="primary" onClick={() => {this.onSubmit(value.id)}}>Create</Button></td>
            </tr>
        )
    }

    return (
      <>
        {this.state.redirect ? <Redirect to='/match' /> : null}
        <h2>Create Match</h2>
        <div className="pageNumber">
            <h3>Page</h3>
            <Input
              name="pageInput"
              onChange={this.onChange2}
              value={this.state.pageInput}
              className="myInput"
            />
            <Button className='myButton' type="submit" color="primary" onClick={this.setPageNumber}>
              Submit
            </Button>
        </div>
        <div style={{margin: 'auto', width: '50%'}}>
            <Table>
                <thead>
                    <tr>
                        <th>Configuration</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {configurations}
                </tbody>
            </Table>
        </div>
      </>
    );
  }
}

export default MatchForm;
