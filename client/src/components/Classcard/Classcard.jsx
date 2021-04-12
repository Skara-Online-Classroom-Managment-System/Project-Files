// import axios from 'axios';
import React from 'react';
import {Link,useParams} from 'react-router-dom';
function Classcard(props){

    const{username}=useParams();
    const url="/classroom/"+username+"/"+props.id;
    return(
    <div>
        <Link to={url}>
        <li>{props.name}</li>
        </Link> 
        <li>{props.id}</li>
    </div>
)
}

export default Classcard;