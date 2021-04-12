import React from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

function TeacherRegister(){
    const history=useHistory();
    const [details,setDetails]=React.useState({
        fn:"",
        username:"",
        pw:"",
        classesEnrolled:[],
        invitesPending:[]  
    });
function handleSubmit(){
    axios({
        method:"POST",
        data:{
            fn:details.fn,
            username:details.username,
            pw:details.pw,
            classesEnrolled:[],
            invitesPending:[]
        },
        withCredentials:true,
       url:"http://localhost:5000/teachersignup",
    }).then((res)=>{
        var queryExtender=res.data.username;
        console.log(queryExtender);
        // history.push("/dashboard/"+queryExtender);
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


    return(
        <div>
    <form >
      <label htmlFor="fn">Name:</label>
      <input type="text" name="fn" value={details.fn} onChange={handleChange}/>
      <label htmlFor="email">Email:</label>
      <input type="email" name="username" value={details.username} onChange={handleChange}/>
      <label htmlFor="pw">Password:</label>
      <input type="password" name="pw" value={details.pw} onChange={handleChange}/>
      <button onClick={(event) => {
          
          event.preventDefault();
          handleSubmit();
          setDetails({
            fn: "",
            username: "",
            pw:"",
            classesEnrolled:[],
            invitesPending:[]
          });
          return;
        }}>Submit</button>
    </form>
        </div>
    )
}

export default TeacherRegister;