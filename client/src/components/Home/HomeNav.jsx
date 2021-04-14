import React from 'react';
// import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

export default function HomeNav(props) {

  const logout=async()=>{
    await fetch("http://localhost:5000/logout", {
      method:"POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });
    props.setName("");
  }
  if(props.name){
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Skara Classroom Manager</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
        <Nav>Hi {props.name}</Nav>
          <Nav.Link href="#home">About</Nav.Link>
          <Nav.Link href="#link">Developers</Nav.Link>
          <Nav.Link href="/" onClick={logout}>LogOut</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );}
  else{
    return(
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