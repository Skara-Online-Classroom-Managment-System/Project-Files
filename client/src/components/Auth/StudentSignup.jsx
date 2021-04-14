import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

export default function Register() {
  const [details, setDetails] = React.useState({
    fn: "",
    ln: "",
    username: "",
    pw: "",
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
          <label for="fn">First Name: </label>
          <input
            type="text"
            name="fn"
            value={details.fn}
            onChange={handleChange}
          />
        </div>
        <div>
          <label for="ln">Last Name: </label>
          <input
            type="text"
            name="ln"
            value={details.ln}
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
          <label for="pw">Password: </label>
          <input
            type="password"
            name="pw"
            value={details.pw}
            onChange={handleChange}
          />
        </div>
        <div>
          <label for="cpw">Confirm Password: </label>
          <input
            type="password"
            name="cpw"
            value={details.pw}
            onChange={handleChange}
          />
        </div>
        <button
          onClick={(event) => {
            event.preventDefault();
            handleSubmit();
            setDetails({
              fn: "",
              ln: "",
              username: "",
              pw: "",
            });
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
