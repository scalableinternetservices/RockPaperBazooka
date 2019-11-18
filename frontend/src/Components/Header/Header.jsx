import React from 'react';
import "./Header.css";
import {
  Navbar,
  Nav,
  NavItem
} from 'reactstrap';

class Header extends React.Component {

    render() {
      return (
        <div className="header">
          <Navbar color="light" light expand="md">
              <Nav className="mx-auto" navbar>
                <NavItem>
                    <h1>RockPaperBazooka</h1>
                </NavItem>
              </Nav>
          </Navbar>
        </div>
      );
  }
}

export default Header;
