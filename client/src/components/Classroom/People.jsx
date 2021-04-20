import axios from "axios";
import React from "react";
import ClassPane from "../Classroom/ClassPane.jsx";

export default function People(props) {
    console.log(props.data,"people");
    const[data,setData]=React.useState({});
    React.useEffect(()=>{
      axios({
        method:"POST",
        data:props.data,
        withCredentials:true,
        url:"http://localhost:5000/people"
      }).then((res)=>{
        setData(res.data);
      })
    },[props.data]);
    
    console.log(data,"peopledata");
    let toshowteacher=null;
    if(data.teachers)
    {
      toshowteacher=data.teachers.map((currentTeacher,index)=>(
        <li>{currentTeacher.firstName}  (Instructor)</li>
      ))
    }
    let toshowstudent=null;
    if(data.studentsEnrolled){
      toshowstudent=data.studentsEnrolled.map((currentStudent,index)=>(
        <li>{currentStudent.firstName}</li>
      ))
    }

return (<div>
    <ClassPane/>
    {toshowteacher}
    {toshowstudent}
  </div>)
}
