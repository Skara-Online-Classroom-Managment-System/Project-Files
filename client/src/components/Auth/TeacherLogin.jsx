import React from "react";
import { Redirect } from "react-router-dom";

export default function TeacherLogin() {
  const [details, setDetails] = React.useState({
    username: String,
    password: String,
  });
  const [redirect, setRedirect] = React.useState(false);
  async function handleSubmit() {
    const response = await fetch("http://localhost:5000/teacherlogin", {
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
    return <Redirect to="/teacherdashboard" />;
  }
  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setDetails(function (prev) {
      const newvals = {
        ...prev,
        [name]: value,
      };
      return newvals;
    });
  }
  return (
    <div>
      <form>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="username"
          value={details.username}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={details.password}
          onChange={handleChange}
        />
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
