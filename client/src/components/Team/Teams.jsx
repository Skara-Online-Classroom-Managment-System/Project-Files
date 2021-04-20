import React from 'react'

import ViewTeams from './ViewTeams.jsx';
import TeacherChat from '../Chat/TeacherChat.jsx';
import TeamChat from '../Chat/TeamChat.jsx';

export default function Teams(props) {
  const data=props.data;
  // const [data, selectedData] = React.useState(props.data);
  const [selectedOption, setSelectedOption] = React.useState(1);

  function handleClick(event) {
    event.preventDefault();
    const name = event.target.name;
    if(name === "viewTeams"){
      setSelectedOption(1);
    }else if(name === "teacherChat"){
      setSelectedOption(2);
    }else{
      setSelectedOption(3);
    }
  }

  return (
    <div>
    <button onClick={handleClick}  name="viewTeams">View Teams</button>
    <button onClick={handleClick}  name="teacherChat">Teacher Chat</button>
    <button onClick={handleClick}  name="teamChat">Team Chat</button>
      {selectedOption === 1 ? <ViewTeams data={data} /> : null}
      {selectedOption === 2 ? <TeacherChat data={data}/> : null}
      {selectedOption === 3 ? <TeamChat data={data}/> : null}
      {/* <SubmitPortal /> */}
    </div>
  )
}
