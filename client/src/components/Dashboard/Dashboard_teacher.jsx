import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Classcard from "../Classcard/Classcard";
import HomeNav from "../Home/HomeNav";
import SideBar from "../Sidebar/sidebar_teacher.jsx";

function Dashboard() {
  const [classesData, setClassesData] = React.useState({
    classesEnrolled: [],
  });
  React.useEffect(() => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/teacherdashboard",
    }).then((res) => {
      setClassesData(res.data);
    });
  }, [classesData.length]);

  const url = "/createClassroom";
  return (
    <div>
      <HomeNav />
      <SideBar />
      <Link to={url}>
        <li>Create Classroom</li>
      </Link>

      {classesData.classesEnrolled.map((classroom, index) => (
        <Classcard
          key={index}
          id={classroom._id}
          code={classroom.classCode}
          name={classroom.className}
        />
      ))}
    </div>
  );
}

export default Dashboard;
