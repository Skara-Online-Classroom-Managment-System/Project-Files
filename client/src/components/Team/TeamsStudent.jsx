import React from "react";

export default function TeamsStudent(props) {
  console.log(props.data);
  function handleClick(event) {
    const name = event.target.name;
    console.log(name);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className="btn btn-success btn-sm"
        name="viewTeams"
      >
        View Teams
      </button>
      <button
        type="button"
        onClick={handleClick}
        className="btn btn-success btn-sm"
        name="teacherChat"
      >
        Teacher Chat
      </button>
      <button
        type="button"
        onClick={handleClick}
        className="btn btn-success btn-sm"
        name="teamChat"
      >
        Team Chat
      </button>
    </div>
  );
}
