import React from "react";
import axios from "axios";

import HomeNav from "../Home/HomeNav.jsx";
import Classcard from "../Classcard/Classcard_Student.jsx";
import AddClass from "../Classroom/AddClass.jsx";
import Sidebar from "../Sidebar/sidebar_student.jsx";

export default function Dashboard() {
  const [studentData, setstudentData] = React.useState({ classesEnrolled: [] });

  React.useEffect(() => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/studentdashboard",
    }).then((res) => {
      const loadedData = res.data;
      setstudentData(loadedData);
    });
  }, [studentData.length]);

  return (
    <div>
      <HomeNav />
      Hi this is the dashboard for student {studentData.username}.
      {studentData.classesEnrolled.map(function (classroom, ind) {
        return <Classcard data={classroom} pos={ind} key={ind} />;
      })}
      <AddClass />
    </div>
  );
}
