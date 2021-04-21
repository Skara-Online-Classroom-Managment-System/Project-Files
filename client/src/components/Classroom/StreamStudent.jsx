import React from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
// import TextAreaAutoSize from "react-textarea-autosize";
import Announcement from "../Announcements/Announcement.jsx";
import ClassPane from "../Classroom/ClassPane";

export default function Stream(props) {
  const { name } = useParams();
  const [details, setDetails] = React.useState({
    announcement: String,
  });
  const [classData, setClassData] = React.useState({});
  const history = useHistory();
  React.useEffect(() => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/studentclassroom/" + name,
    }).then((res) => {
      setClassData(res.data);
    });
  }, [classData.length, name]);

  function handleChange(event) {
    const value = event.target.value;
    setDetails({
      announcement: value,
    });
  }
  let toshow = null;
  if (classData.announcements) {
    toshow = classData.announcements.map((a, index) => {
      return <Announcement data={a} key={index} />;
    });
  }

  return <div>{toshow}</div>;
}
