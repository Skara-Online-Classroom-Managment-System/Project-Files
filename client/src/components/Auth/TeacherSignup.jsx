import React from "react";
// import axios from "axios";
import { Redirect } from "react-router-dom";

function TeacherRegister() {
  const [details, setDetails] = React.useState({
    fn: "",
    username: "",
    pw: "",
    classesEnrolled: [],
    invitesPending: [],
  });
  const [redirect, setRedirect] = React.useState(false);

  async function handleSubmit() {
    const response = await fetch("http://localhost:5000/teachersignup", {
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
    return <Redirect to={"/teacherdashboard"} />;
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
        <label htmlFor="fn">Name:</label>
        <input
          type="text"
          name="fn"
          value={details.fn}
          onChange={handleChange}
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="username"
          value={details.username}
          onChange={handleChange}
        />
        <label htmlFor="pw">Password:</label>
        <input
          type="password"
          name="pw"
          value={details.pw}
          onChange={handleChange}
        />
        <button
          onClick={(event) => {
            event.preventDefault();
            handleSubmit();
            setDetails({
              fn: "",
              username: "",
              pw: "",
              classesEnrolled: [],
              invitesPending: [],
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

export default TeacherRegister;
