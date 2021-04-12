import React from 'react'

export default function Announcement(props) {
  return (
    <div>
      <h3>{props.text}</h3>
      <h5>{props.author}</h5>
      <h6>{props.time}</h6>
    </div>
  )
}
