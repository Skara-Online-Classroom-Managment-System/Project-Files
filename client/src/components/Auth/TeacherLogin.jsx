import axios from 'axios';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function TeacherLogin(){

  const [details,setDetails]=React.useState({
    username:String,
    password:String
  });

  const history=useHistory();
  function handleSubmit(){
    axios({
      method:"POST",
      data:{
        username:details.username,
        password:details.password
      },
      withCredentials:true,
      url:"http://localhost:5000/teacherlogin"
    }).then((res) => {
        var queryExtender=res.data.username;
        history.push("/dashboard/" + queryExtender);
    });
  }
  function handleChange(event){
    const name=event.target.name;
    const value=event.target.value;
    setDetails(function(prev){
      const newvals={
        ...prev,
        [name]:value
    };
    return newvals;
    });
}
    return (
    <div>
    <form>
    <label htmlFor="email">Email:</label>
    <input type="email" name="username" value={details.username} onChange={handleChange}/>
    <label htmlFor="password">Password</label>
    <input type="text" name="password" value={details.password} onChange={handleChange}/>
    <button onClick={(event)=>{
      event.preventDefault();
      handleSubmit()
      setDetails({
        username:"",
        password:""
      });
return;
    }
    }>Submit</button>
    </form>
  </div>);
};