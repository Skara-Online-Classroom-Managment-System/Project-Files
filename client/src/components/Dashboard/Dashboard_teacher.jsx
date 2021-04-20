import React from "react";
import { Link ,useHistory} from "react-router-dom";
import axios from "axios";
import Classcard from "../Classcard/Classcard";
import HomeNav from "../Home/HomeNav";
import SideBar from "../Sidebar/sidebar_teacher.jsx";

function Dashboard() {
  const [classesData, setClassesData] = React.useState({
    classesEnrolled: [],
  });
  const history=useHistory();
  React.useEffect(() => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/teacherdashboard",
    }).then((res) => {
      setClassesData(res.data);
      // history.push("/teacherdashboard");
    });
  }, [classesData.length]);

  let toshow=null;
  if(classesData.classesEnrolled){
    toshow=classesData.classesEnrolled.map((classroom, index) => (
      <Classcard
        key={index}
        id={classroom._id}
        code={classroom.classCode}
        name={classroom.className}
      />
    ))
  }

  const url = "/createClassroom";
  return (
    <div>
      <HomeNav />
      <SideBar />
      <Link to={url}>
        <li>Create Classroom</li>
      </Link>

      {toshow}
    </div>
  );
}

export default Dashboard;
