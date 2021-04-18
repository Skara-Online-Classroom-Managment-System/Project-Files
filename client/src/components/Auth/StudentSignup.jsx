import React from "react";
import { Redirect } from "react-router-dom";

export default function Register() {
  const [details, setDetails] = React.useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    cpw: "",
  });
  const [redirect, setRedirect] = React.useState(false);

  async function handleSubmit() {
    const response = await fetch("http://localhost:5000/studentsignup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...details,
      }),
    });
    const content = await response.json();
    if (response.status === 201) {
      console.log(content);
    } else {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Redirect to={"/studentlogin"} />;
  }

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setDetails(function (prev) {
      const newVal = {
        ...prev,
        [name]: value,
      };
      return newVal;
    });
  }
  return (
    <div>
      <h2>Sign Up as a Student</h2>
      <form>
        <div>
          <label for="firstName">First Name: </label>
          <input
            type="text"
            name="firstName"
            value={details.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label for="lastName">Last Name: </label>
          <input
            type="text"
            name="lastName"
            value={details.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label for="username">Student ID: </label>
          <input
            type="text"
            name="username"
            value={details.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label for="password">Password: </label>
          <input
            type="password"
            name="password"
            value={details.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label for="cpw">Confirm Password: </label>
          <input
            type="password"
            name="cpw"
            value={details.password}
            onChange={handleChange}
          />
        </div>
        <button
          onClick={(event) => {
            event.preventDefault();
            handleSubmit();
            setDetails({
              firstName: "",
              lastName: "",
              username: "",
              password: "",
            });
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
