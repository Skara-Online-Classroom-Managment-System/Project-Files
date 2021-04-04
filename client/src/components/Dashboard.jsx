import React from 'react'
import axios from "axios";
import { useParams } from 'react-router-dom';

import ClassPane from "./ClassPane.jsx";
import OptionsPane from "./OptionsPane.jsx";

export default function Dashboard() {

  const [studentData, setstudentData] = React.useState({});
  const [selectedOption, setSelectedOption] = React.useState(1);
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
  },[]);

  return (
    <div>
      Hi this is the dashboard for student {studentData.sid}.
      <ClassPane data={studentData} />
      <OptionsPane data={studentData} select={selectedOption} />
    </div>
  );
}
