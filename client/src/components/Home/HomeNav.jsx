import React from "react";
// import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import axios from "axios";

export default function HomeNav(props) {
  const [userData, setUserData] = React.useState({});
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  React.useEffect(() => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/user",
    }).then((res) => {
      // if (res.status !== 200) {
      const loadedData = res.data;
      setUserData(loadedData);
      console.log(loadedData);
      setIsLoggedIn(true);
      // }
    });
  }, [userData.length]);

  async function handleLogOut() {
    const response = await fetch("http://localhost:5000/logout", {
      method: "GET",
      credentials: "include",
    });
    const content = await response.json();
  }
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Skara Classroom Manager</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">About</Nav.Link>
          <Nav.Link href="#link">Developers</Nav.Link>
          {isLoggedIn ? null : (
            <NavDropdown title="Login" id="basic-nav-dropdown">
              <NavDropdown.Item href="/teacherlogin">
                Login as Teacher
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/studentlogin">
                Login as Student
              </NavDropdown.Item>
            </NavDropdown>
          )}
          {isLoggedIn ? null : (
            <NavDropdown title="Sign Up" id="basic-nav-dropdown">
              <NavDropdown.Item href="/teachersignup">
                Sign Up as Teacher
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/studentsignup">
                Sign Up as Student
              </NavDropdown.Item>
            </NavDropdown>
          )}
          {isLoggedIn ? <Nav.Link>Hi {userData.firstName}</Nav.Link> : null}
          {isLoggedIn ? (
            <Nav.Link onClick={handleLogOut}>Log Out</Nav.Link>
          ) : null}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
