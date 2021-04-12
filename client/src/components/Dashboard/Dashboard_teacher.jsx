import React from 'react';
import {Link,useParams} from 'react-router-dom';
import axios from 'axios';
import Classcard from "../Classcard/Classcard";
function Dashboard(){
const [classesData,setClassesData]=React.useState({
  "classesEnrolled":[]
});

const {username}=useParams();

  React.useEffect(() => {
  axios({
    method: 'GET',
    url: 'http://localhost:5000/dashboard/'+username    // responseType: 'stream'
  })
    .then((res)=> {
      if(res.data.classesEnrolled.classesEnrolled.length!==classesData.classesEnrolled.length)
      {
      setClassesData(res.data.classesEnrolled);
      }
      // console.log(res.data.classesEnrolled);
    });
  },[classesData,username]);
    
  const url="/createClassroom/"+username;
    return(<div>
      <Link to={url}>
        <li>Create Classroom</li>
      </Link>
     
      {classesData.classesEnrolled.map((classroom,index)=>(
            <Classcard key={index} id={classroom.classCode} name={classroom.className}/>
        ))}
      </div>
    )
}

export default Dashboard;