import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import Stream from "./Stream.jsx";
import Teams from "../Team/Teams.jsx";
import People from "./People.jsx";
import HomeNav from "../Home/HomeNav.jsx";
import Sidebar from "../Sidebar/sidebar_student.jsx";

export default function Classroom() {
  const [selectedOption, setSelectedOption] = React.useState(1);
  const [classData, setClassData] = React.useState({});
  const { studentclassname } = useParams();

  React.useEffect(() => {
    console.log("UseEffect called inside the Classroom", selectedOption);
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/studentclassroom/" + studentclassname,
    }).then((res) => {
      const loadedData = res.data;
      setClassData(loadedData);
    });
  }, [selectedOption, classData.length]);

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

  return (
    <div>
      <HomeNav />
      <Sidebar />
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
  );
}
