import axios from 'axios';
import React from 'react';
import {useParams,Link} from 'react-router-dom';
import Announcement from "../Announcements/RenderAnnouncement";
 function ClassPane(){
    const{username,id}=useParams();
    const[classData,setClassData]=React.useState([]);
    React.useEffect(()=>{
    axios.get('http://localhost:5000/classpane/'+username+"/"+id)
    .then((res)=>{
        if(res.data.class.announcements.length!==classData.length)
      {
        setClassData(res.data.class.announcements);
      }
    })
    },[classData,username,id])
  const url2="/teams/"+username+"/"+id;
  const url="/createAnnouncement/"+username+"/"+id;
    return(<div>
        <Link to={url}>
        <li>Create Announcement</li>
        </Link>
        <Link to={url2}>
        <li>Teams</li>
        </Link>
        {classData.map((obj,index)=>{
         return(
<Announcement author={obj.author} text={obj.text} time={obj.time} key={index} />
        )})}
        </div>
    )
}
export default ClassPane;