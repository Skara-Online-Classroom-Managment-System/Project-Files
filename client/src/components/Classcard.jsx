import React from 'react'

export default function Classcard(props) {
  return (
    <div style="background: yellow">
      Hi this is the class card of {props.data.subject}
    </div>
  )
}
