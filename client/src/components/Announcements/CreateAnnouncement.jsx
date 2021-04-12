import React from 'react';
import axios from 'axios';
import {useHistory,useParams} from 'react-router-dom';

function CreateAnnouncement(){
  const {username,id}=useParams();
  const [details,setDetails]=React.useState(
    {
      announcement:String,
    }
  )
  const history=useHistory();
  
  function handleSubmit(){
    axios({
      method:"POST",
      data:{
        announcement:details.announcement
      },
      withCredentials:true,
      url:"http://localhost:8080/createAnnouncement/"+username+"/"+id
    }).then((res)=>{
    console.log("hello")
    });
    history.push("/classroom/"+username+"/"+id);
  }
  
  
  function handleChange(event){
    const value=event.target.value;
    setDetails({
        announcement:value 
    })
  }
  
  return(
    <div>
        <form>
          <label htmlFor='name'>Type</label>
          <input type="text" name="announcement" value={details.announcement} onChange={handleChange}/>
          <button
          onClick={(event)=>{
            event.preventDefault();
            handleSubmit();
            setDetails({
              announcement:""
            });
          }
          }>Submit</button>
        </form>
    </div>
    )
}

export default CreateAnnouncement;