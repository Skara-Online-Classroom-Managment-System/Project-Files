import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

export default function AddClass() {
  const [codeEntered, setCodeEntered] = React.useState("");
  const [redirect, setRedirect] = React.useState(false);

  function handleChange(event) {
    event.preventDefault();
    const val = event.target.value;
    setCodeEntered(val);
  }

  function handleClick() {
    axios({
      method: "POST",
      withCredentials: true,
      url: "http://localhost:5000/addclass",
      data: {
        classCode: codeEntered,
      },
    }).then((res) => {
      const loadedData = res.data;
      console.log(loadedData);
      // if (res.status === 200) {
      //   setRedirect = true;
      // }
    });
  }

  if (redirect) {
    return <Redirect to="/studentDashboard" />;
  }

  return (
    <div>
      <form>
        <label htmlFor="classCode">Enter the class code.</label>
        <input
          type="text"
          name="classCode"
          value={codeEntered}
          onChange={handleChange}
        />
        <button
          onClick={(event) => {
            event.preventDefault();
            handleClick();
          }}
        >
          Submit Code
        </button>
      </form>
    </div>
  );
}
