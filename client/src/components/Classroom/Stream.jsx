import React from "react";
import Announcement from "../Announcements/Announcement.jsx";

export default function Stream(props) {
  {
    console.log(props.data);
  }
  let toshow = null;
  if (props.data.announcements) {
    toshow = props.data.announcements.map((a, index) => {
      return <Announcement data={a} key={index} />;
    });
  }
  return <div>{toshow}</div>;
}
