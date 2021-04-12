import React from 'react'
import Announcement from '../Announcements/Announcement.jsx';

export default function Stream(props) {
  let toshow = null;
  if(props.data.announcements)
  {
    console.log(props.data.announcements);
    toshow = props.data.announcements.map((a,index) => 
      (<Announcement time={a.time} text={a.text} author={a.author.teacherID} key={index} />)
    );
  }
  return (
    <div>
      {toshow}
    </div>
  )
}