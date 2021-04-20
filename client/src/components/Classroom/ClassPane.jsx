import axios from "axios";
import React from "react";
import {  useParams,useHistory } from "react-router-dom";

import Stream from "./Stream.jsx";
import ViewTeams from "../Team/ViewTeams.jsx";
import People from "./People.jsx";
import HomeNav from "../Home/HomeNav.jsx";
import Sidebar from "../Sidebar/sidebar_teacher.jsx";

function ClassPane(props) {
  const [selectedOption, setSelectedOption] = React.useState(1);
  const [classData, setClassData] = React.useState({});
  const { name } = useParams();
  const history=useHistory();
  React.useEffect(() => {
    axios({
      method: "POST",
      withCredentials: true,
      url: "http://localhost:5000/classroom/" + name,
    }).then((res) => {
      setClassData(res.data);
    });
  }, [classData.length,name]);

  function handleClick(event) {
    const name = event.target.name;
    var val = 1;
    if (name === "stream") {
      val = 1;
      // history.push("/classroom/stream")
    } else if (name === "people") {
      val = 2;
      // history.push("/classroom/people")
    } else {
      val = 3;
      // histo  ry.push("/classroom/team")
    }
    setSelectedOption(val);
  }
  return (
    <div>
      <HomeNav />
      <Sidebar />
      <ul className="nav justify-content-center">
        <li className="nav-item">
          <button className="nav-link" name="stream" onClick={handleClick}>
            Stream
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link" name="people" onClick={handleClick}>
            People
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link" name="teams" onClick={handleClick}>
            Teams
          </button>
        </li>
      </ul>
      {selectedOption === 1 ? <Stream data={classData} /> : null}
      {selectedOption === 2 ? <People data={classData} /> : null}
      {selectedOption === 3 ? <ViewTeams data={classData} /> : null}
    </div>

           
  );
}
export default ClassPane;
