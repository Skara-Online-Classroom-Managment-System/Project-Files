import React from 'react'
import axios from "axios";
import { useParams } from 'react-router-dom';

import Classcard from "./Classcard.jsx";
import AddClass from "../AddClass.jsx";

export default function Dashboard() {

  const [studentData, setstudentData] = React.useState({"classesEnrolled":[]});
  const { sid } = useParams();
 
  React.useEffect(() => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/user",
      params: {
        sid: sid
      }
    }).then((res) => {
        const loadedData = res.data;
        setstudentData(loadedData);
    })
  },[studentData.length,sid]);

  return (
    <div>
      Hi this is the dashboard for student {studentData.sid}.
      {(studentData.classesEnrolled).map(function(classroom, ind){
        return (<Classcard sid={sid} data={classroom} key={ind} />);
      })}
      <AddClass />
    </div>
  );
}
