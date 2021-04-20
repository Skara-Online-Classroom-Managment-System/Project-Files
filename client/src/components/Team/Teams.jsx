import React from "react";

import ViewTeams from "./ViewTeams.jsx";
import TeacherChat from "../Chat/TeacherChat.jsx";
import TeamChat from "../Chat/TeamChat.jsx";

export default function Teams(props) {
  const [data, selectedData] = React.useState(props.data);
  const [selectedOption, setSelectedOption] = React.useState(1);

  console.log(props.data);

  function handleClick(event) {
    event.preventDefault();
    const name = event.target.name;
    if (name === "viewTeams") {
      setSelectedOption(1);
    } else if (name === "teacherChat") {
      setSelectedOption(2);
    } else {
      setSelectedOption(3);
    }
  }

  return (
    <div>
      <ul className="nav justify-content-center">
        <li className="nav-item">
          <button
            type="button"
            className="btn btn-outline-dark btn-sm"
            onClick={handleClick}
            data={data}
            name="viewTeams"
          >
            View Teams
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className="btn btn-outline-dark btn-sm"
            onClick={handleClick}
            data={data}
            name="teacherChat"
          >
            Teacher Chat
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className="btn btn-outline-dark btn-sm"
            onClick={handleClick}
            data={data}
            name="teamChat"
          >
            Team Chat
          </button>
        </li>
      </ul>
      {/* <SubmitPortal /> */}
      {selectedOption === 1 ? <ViewTeams data={props.data} /> : null}
      {selectedOption === 2 ? <TeacherChat /> : null}
      {selectedOption === 3 ? <TeamChat /> : null}
    </div>
  );
}
