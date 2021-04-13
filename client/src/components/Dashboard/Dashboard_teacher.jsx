import React from 'react';
import {Link,useParams,useHistory} from 'react-router-dom';
import axios from 'axios';
import Classcard from "../Classcard/Classcard";
function Dashboard(){
const [classesData,setClassesData]=React.useState({
  "classesEnrolled":[]
});

const {username}=useParams();
const history=useHistory();
  React.useEffect(() => {
  axios({
    method: 'GET',
    url: 'http://localhost:5000/dashboard/'+username    // responseType: 'stream'
  })
    .then((res)=> {
      console.log(res,"dashboard");
      // if(res.data.classesEnrolled.classesEnrolled.length!==classesData.classesEnrolled.length)
      // {
      // setClassesData(res.data.classesEnrolled);
      // }
      // console.log(res.data.classesEnrolled);
    });
  },[classesData,username]);

  function handleClick(){
    axios({
      method: 'GET',
      url: 'http://localhost:5000/logout'    // responseType: 'stream'
    }).then((res)=>{
      history.push("/");
    })
  }
    
  const url="/createClassroom/"+username;
    return(<div>
      <Link to={url}>
        <li>Create Classroom</li>
      </Link>
      <button onClick={handleClick}>LogOut</button>
     
      {classesData.classesEnrolled.map((classroom,index)=>(
            <Classcard key={index} id={classroom.classCode} name={classroom.className}/>
        ))}
      </div>
    )
}

export default Dashboard;