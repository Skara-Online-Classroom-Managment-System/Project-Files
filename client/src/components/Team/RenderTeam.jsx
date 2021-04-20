import axios from "axios";
import React from "react";
import IndTeam from "./IndividualTeam.jsx";
import { useHistory } from "react-router-dom";
import ClassPane from "../Classroom/ClassPane";

export default function RenderTeam(props) {
  const [team, setTeam] = React.useState({});
  const history = useHistory();
  function handleClick() {
    axios({
      method: "POST",
      data: props.data,
      withCredentials: true,
      url: "http://localhost:5000/individualTeam",
    }).then((res) => {
      console.log("insode handle click");
      setTeam(res.data);
      // history.push("/"+props.data.teamName);
    });
  }

  return (
    <div>
      <ClassPane />
      <button onClick={handleClick}>{props.data.teamName}</button>
      <IndTeam data={team} />
    </div>
  );
}
