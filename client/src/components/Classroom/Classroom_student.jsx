import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import StreamStudent from "./StreamStudent.jsx";
import TeamsStudent from "../Team/TeamsStudent.jsx";
import PeopleStudent from "./PeopleStudent.jsx";
import HomeNav from "../Home/HomeNav.jsx";
import Sidebar from "../Sidebar/sidebar_student.jsx";
import Spinner from "../Spinner/Spinner.js";

export default function Classroom() {
  const [selectedOption, setSelectedOption] = React.useState(1);
  const [classData, setClassData] = React.useState({});
  const { studentclassname } = useParams();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    console.log("UseEffect called inside the Classroom", selectedOption);
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/studentclassroom/" + studentclassname,
    }).then((res) => {
      setLoading(false);
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
  let gaba = <Spinner />;
  if (loading === false) {
    gaba = (
      <>
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
        {selectedOption === 1 ? <StreamStudent data={classData} /> : null}
        {selectedOption === 2 ? <PeopleStudent data={classData} /> : null}
        {selectedOption === 3 ? <TeamsStudent data={classData} /> : null}
      </>
    );
  }

  return (
    <div>
      <HomeNav />
      {gaba}
      {/* <Sidebar />
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
      {selectedOption === 1 ? <StreamStudent data={classData} /> : null}
      {selectedOption === 2 ? <PeopleStudent data={classData} /> : null}
      {selectedOption === 3 ? <TeamsStudent data={classData} /> : null} */}
    </div>
  );
}
