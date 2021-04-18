import axios from "axios";
import React from "react";
import { Link, useParams } from "react-router-dom";

import Stream from "./Stream.jsx";
import Teams from "../Team/Teams.jsx";
import People from "./People.jsx";
import HomeNav from "../Home/HomeNav.jsx";
import Sidebar from "../Sidebar/sidebar_teacher.jsx";

function ClassPane(props) {
  const [selectedOption, setSelectedOption] = React.useState(1);
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

  function handleClick(event) {
    const name = event.target.name;
    var val = 1;
    if (name === "stream") {
      val = 1;
    } else if (name === "people") {
      val = 2;
    } else {
      val = 3;
    }
    setSelectedOption(val);
  }

  console.log(classData, "classPane");
  return (
    <div>
      <HomeNav />
      <Sidebar />
      <Link to={"/createAnnouncement/" + name}>
        <li>Create Announcement</li>
      </Link>
      <ul className="nav justify-content-center">
        <li className="nav-item">
          <a className="nav-link" name="stream" onClick={handleClick}>
            Stream
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" name="people" onClick={handleClick}>
            People
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" name="teams" onClick={handleClick}>
            Teams
          </a>
        </li>
      </ul>
      {selectedOption === 1 ? <Stream data={classData} /> : null}
      {selectedOption === 2 ? <People data={classData} /> : null}
      {selectedOption === 3 ? <Teams data={classData} /> : null}
    </div>

    //       {/* {classData.announcements.map((obj,index)=>{
    //          return(
    // <Announcement author={obj.author} text={obj.text} time={obj.time} key={index} />
    //         )})} */}
  );
}
export default ClassPane;
