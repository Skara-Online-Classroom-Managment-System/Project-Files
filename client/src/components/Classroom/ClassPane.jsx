import axios from "axios";
import React from "react";
import { Link, useParams } from "react-router-dom";
import Announcement from "../Announcements/RenderAnnouncement";
function ClassPane(props) {
  const [classData, setClassData] = React.useState({});
  const { name } = useParams();
  React.useEffect(() => {
    axios({
      method: "POST",
      withCredentials: true,
      url: "http://localhost:5000/classroom/" + name,
    }).then((res) => {
      console.log("Classcard: ", res.data);
      setClassData(res.data);
    });
  }, [classData.length]);
  console.log(classData, "classPane");
  return (
    <div>
      <Link to={"/createAnnouncement/" + name}>
        <li>Create Announcement</li>
      </Link>
      <Link to={"/teams/" + name}>
        <li>Teams</li>
      </Link>

      {/* {classData.announcements.map((obj,index)=>{
         return(
<Announcement author={obj.author} text={obj.text} time={obj.time} key={index} />
        )})} */}
    </div>
  );
}
export default ClassPane;
