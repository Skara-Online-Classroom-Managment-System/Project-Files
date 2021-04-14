import axios from "axios";
import { BrowserRouter, useHistory } from "react-router-dom";
import React from "react";

function Login() {
  const history = useHistory();

  const [details, setDetails] = React.useState({
    username: "",
    password: "",
  });

  function handleSubmit() {
    axios({
      method: "POST",
      data: {
        username: details.username,
        password: details.password,
      },
      withCredentials: true,
      url: "http://localhost:5000/studentlogin",
    }).then((res) => {
      console.log(res);
      // var queryExtender = res.data.username;
      history.push('/student/' + res.data.username);
    });
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
          <label for="fn">SID: </label>
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
