import React from "react";
import { Link } from "react-router-dom";

export default function Classcard(props) {
  const url = "/studentclassroom/" + props.data.className;

  return (
    <div>
      <Link to={url}>{props.data.className}</Link>
    </div>
  );
}
