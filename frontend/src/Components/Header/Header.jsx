import React from 'react';
import "./Header.css";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem
} from 'reactstrap';
import { Link } from 'react-router-dom';

class Header extends React.Component {

    render() {
      return (
        <div className="header">
          <Navbar color="light" light expand="md">
            <NavbarBrand style={{fontSize: '40px'}}>
                <Link style={{color: 'black'}} to="/login">
                    RockPaperBazooka
                </Link>
            </NavbarBrand>
              <Nav className="ml-auto" navbar>
                <NavItem>
                    <Link style={{fontSize: '24px', paddingRight: '50px'}}to="/matches">Matches</Link>
                </NavItem>
                <NavItem>
                    <Link style={{fontSize: '24px', paddingRight: '50px'}}to="/user">User</Link>
                </NavItem>
              </Nav>
          </Navbar>
        </div>
      );
  }
}

export default Header;
