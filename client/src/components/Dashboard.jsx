import React from 'react'
import axios from "axios";
import { useParams } from 'react-router-dom';
import Classcard from './Classcard.jsx';

export default function Dashboard() {

  const [studentData, setstudentData] = React.useState({});
  const { sid } = useParams();
 
  React.useEffect(() => {
    console.log(sid);
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
        console.log(studentData);
    })
  },[]);
  return (
    <div>
      { studentData.classesEnrolled.map(function(classroom,index){
        return (
          <Classcard key={index} objectId={classroom._id} />);
      })}
    </div>
  );
}
