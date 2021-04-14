import React from "react";
import { Redirect } from "react-router-dom";

export default function Classcard(props) {
  const [redirect, setRedirect] = React.useState(false);

  function handleClick(event) {
    const pos = props.pos;
    setRedirect(true);
  }
  if (redirect) {
    return <Redirect to={"classroom/" + props.pos} />;
  }
  return (
    <div style={{ background: "yellow" }}>
      Hi this is the class card of {props.data.className}
      <button name={props.data.classCode} onClick={handleClick}>
        Enter this class
      </button>
    </div>
  );
}
