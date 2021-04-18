import React from "react";
import axios from "axios";
import { Redirect, useParams } from "react-router-dom";

function CreateAnnouncement() {
  const { name } = useParams();
  const [details, setDetails] = React.useState({
    announcement: String,
  });
  const [redirect, setRedirect] = React.useState(false);
  function handleSubmit() {
    axios({
      method: "POST",
      data: {
        announcement: details.announcement,
      },
      withCredentials: true,
      url: "http://localhost:5000/createAnnouncement/" + name,
    }).then((res) => {
      console.log("hello");
      setRedirect(true);
    });
    if (redirect === true) {
      console.log("asdkljasdlkjasl:", redirect);
      return <Redirect to={"/classroom/" + name} />;
    }
  }

  function handleChange(event) {
    const value = event.target.value;
    setDetails({
      announcement: value,
    });
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Type</label>
        <input
          type="text"
          name="announcement"
          value={details.announcement}
          onChange={handleChange}
        />
        <button
          onClick={(event) => {
            event.preventDefault();
            handleSubmit();
            setDetails({
              announcement: "",
            });
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateAnnouncement;
