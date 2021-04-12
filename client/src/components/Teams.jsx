import React from 'react'

import ViewTeams from './ViewTeams.jsx';
import TeacherChat from './TeacherChat.jsx';
import TeamChat from './TeamChat.jsx';

export default function Teams(props) {
  const [data, selectedData] = React.useState(props.data);
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
      {selectedOption === 1 ? <ViewTeams /> : null}
      {selectedOption === 2 ? <TeacherChat /> : null}
      {selectedOption === 3 ? <TeamChat /> : null}
      <button onClick={handleClick} data={data} name="viewTeams">View Teams</button>
      <button onClick={handleClick} data={data} name="teacherChat">Teacher Chat</button>
      <button onClick={handleClick} data={data} name="teamChat">Team Chat</button>
      {/* <SubmitPortal /> */}
    </div>
  )
}
