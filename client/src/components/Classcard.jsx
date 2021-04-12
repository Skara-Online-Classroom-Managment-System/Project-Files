import React from 'react'
import { useHistory } from 'react-router-dom';

export default function Classcard(props) {

  const history = useHistory();

  function handleClick(event){
    const code = event.target.name;
    history.push(props.sid + '/classroom/' + code)
  }
  return (
    <div style={{"background": "yellow"}}>
      Hi this is the class card of {props.data.subject}
      <button name={props.data.classCode} onClick={handleClick}>Enter this class</button>
    </div>
  )
}
