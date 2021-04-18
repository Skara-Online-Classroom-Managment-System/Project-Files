import React from "react";
import { Link } from "react-router-dom";
function Classcard(props) {
  const url = "/classroom/" + props.name;

  return (
    <div>
      <Link to={url}>{props.name}</Link>
      <li>{props.code}</li>
    </div>
  );
}

export default Classcard;
