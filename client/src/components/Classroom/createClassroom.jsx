import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

function CreateClassroom() {
  const [details, setDetails] = React.useState({
    className: String,
  });
  const history = useHistory();

  function handleSubmit() {
    axios({
      method: "POST",
      data: {
        className: details.className,
      },
      withCredentials: true,
      url: "http://localhost:5000/createClassroom",
    }).then((res) => {
      console.log("hello");
    });
    history.push("/teacherdashboard");
  }

  function handleChange(event) {
    const value = event.target.value;
    setDetails({
      className: value,
    });
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Classroom Name:</label>
        <input
          type="text"
          name="className"
          value={details.className}
          onChange={handleChange}
        />
        <button
          onClick={(event) => {
            event.preventDefault();
            handleSubmit();
            setDetails({
              className: "",
            });
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateClassroom;
