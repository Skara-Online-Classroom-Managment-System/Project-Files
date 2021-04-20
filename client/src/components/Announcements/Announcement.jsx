import React from 'react'

export default function Announcement(props) {

  return (
    <div>
         
      <h3>{props.data.text}</h3>
      <h5>{props.data.author}</h5>
      <h6>{props.data.time}</h6>
     

    </div>
  )
}
