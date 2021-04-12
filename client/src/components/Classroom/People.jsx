import React from 'react';
import ClassPerson from "./ClassPerson.jsx";

export default function People(props) {

  let toshow = null;
  if(props.data.announcements)
  {
    console.log(props.data.announcements);
    toshow = props.data.studentsEnrolled.map((a,index) => 
      (<ClassPerson name={a.firstName+a.lastName} sid={a.sid} key={index} />)
    );
  }
  return (
    <div>
      {toshow}
    </div>
  )
}
