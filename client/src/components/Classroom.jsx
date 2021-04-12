import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Stream from './Stream.jsx';
import Teams from './Teams.jsx';
import People from './People.jsx';

export default function Classroom() {

  const [selectedOption, setSelectedOption] = React.useState(1);
  const [classData, setClassData] = React.useState({});
  const { sid, code } = useParams();

  React.useEffect(() => {
    console.log("UseEffect called inside the Classroom", selectedOption);
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/classroom",
      params: {
        sid: sid,
        code: code
      }
    }).then((res) => {
        const loadedData = res.data;
        setClassData(loadedData);
    })
  },[selectedOption]);

  function handleClick(event){
    const name = event.target.name;
    var val = 1;
    if(name === "stream"){
      val = 1;
    }else if(name === "people"){
      val = 2;
    }else{
      val = 3;
    }
    setSelectedOption(val);
  }
  
  return (
    <div>
      Hello this is inside of a classroom.
      {selectedOption === 1 ? (<Stream data={classData} />) : null}
      {selectedOption === 2 ? (<People data={classData} />) : null}
      {selectedOption === 3 ? (<Teams data={classData} />) : null}
      <button name="stream" onClick={handleClick}>Stream</button>
      <button name="people" onClick={handleClick}>People</button>
      <button name="Teams" onClick={handleClick}>Teams</button>  
    </div>
  )
}
