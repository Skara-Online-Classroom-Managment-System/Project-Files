import React from "react";
import axios from 'axios';
import {useParams} from 'react-router-dom';
import TeamDetails from './RenderTeam';


function TeamPane(){
    const[teamData,setTeamData]=React.useState([]);
const {username,id}=useParams();
React.useEffect(()=>{
axios({
    method:"GET",
    url:"http://localhost:8080/team/"+username+"/"+id
}).then((res)=>{
    setTeamData(res.data.teams);
})
},[username,id]);
console.log(teamData);
    return(
    <div>
    <li>hello</li>
    {teamData.map((team,index)=>(
        <TeamDetails teamName={team.teamName} key={index} />
    ))}
    </div>
)
}

export default TeamPane;