import React from 'react';
// import { useHistory } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

export default function HomeNav(props) {
  const [name,setName]=React.useState(props.name);
  if(name){
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Skara Classroom Manager</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
        <Nav>Hi{name}</Nav>
          <Nav.Link href="#home">About</Nav.Link>
          <Nav.Link href="#link">Developers</Nav.Link>
          <Nav.Link href="#link">LogOut</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );}
  else{
    (
      <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Skara Classroom Manager</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">About</Nav.Link>
          <Nav.Link href="#link">Developers</Nav.Link>
          <NavDropdown title="Login" id="basic-nav-dropdown">
            <NavDropdown.Item href="/teacherlogin">Login as Teacher</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/studentlogin">Login as Student</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Sign Up" id="basic-nav-dropdown">
            <NavDropdown.Item href="/teachersignup">Sign Up as Teacher</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/studentsignup">Sign Up as Student</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    )
  }
}