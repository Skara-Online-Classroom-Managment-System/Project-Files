import react from "react";
import ClassPane from "../Classroom/ClassPane";

export default function IndividualTeam(props) {
  console.log(props.data);
  return (
    <div>
      <ClassPane/>
      <li>{props.data.teamName}</li>
    </div>
  );
}
