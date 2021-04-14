import React from "react";
import HomeNav from "./HomeNav.jsx";

export default function Home(props) {
  console.log(props.name,"home");
  return (
    <div>
      <HomeNav name={props.name} setName={props.setName}/>
    </div>
  );
}
