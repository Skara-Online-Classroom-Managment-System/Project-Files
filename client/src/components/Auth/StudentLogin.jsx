import axios from "axios";
import { Redirect } from "react-router-dom";
import React from "react";

function Login() {
  const [details, setDetails] = React.useState({
    username: "",
    password: "",
  });
  const [redirect, setRedirect] = React.useState(false);

  async function handleSubmit() {
    const response = await fetch("http://localhost:5000/studentlogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...details,
      }),
    });
    const content = await response.json();
    if (response.status === 201) {
      console.log(content);
    } else {
      setRedirect(true);
      console.log(content);
    }
  }

  if (redirect) {
    return <Redirect to="/studentdashboard" />;
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
      <form>
        <div>
          <label for="username">SID: </label>
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
        <button
          onClick={(event) => {
            event.preventDefault();
            handleSubmit();
            setDetails({
              username: "",
              password: "",
            });
            return;
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
