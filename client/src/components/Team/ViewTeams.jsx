import React from "react";
import axios from "axios";
// import { useParams } from "react-router-dom";
import RenderTeam from "./RenderTeam";
import ClassPane from "../Classroom/ClassPane";
function TeamPane(props) {
  const [teamData, setTeamData] = React.useState({});
  console.log(props.data.classCode);
  React.useEffect(() => {
    axios({
      method: "POST",
      data: props.data,
      withCredentials: true,
      url: "http://localhost:5000/teams",
    }).then((res) => {
      console.log(res.data, "view");
      setTeamData(res.data);
    });
  }, [teamData.length, props.data]);

  let toshow = null;
  if (teamData.teams) {
    toshow = teamData.teams.map((currentTeam, index) => (
      <RenderTeam data={currentTeam} />
    ));
  }

  return (
    <div>
      <ClassPane />
      {toshow}
    </div>
  );
}

export default TeamPane;
