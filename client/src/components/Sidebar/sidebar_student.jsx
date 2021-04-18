import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
// import sidebarData  from './sidebarData';
import "./sidebar.css";
import { IconContext } from "react-icons";
import axios from "axios";

// const sidebarData=require("./sidebarData");
function Sidebar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const [classData, setclassData] = useState({
    classesEnrolled: [],
  });

  React.useEffect(() => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/studentdashboard",
    }).then((res) => {
      setclassData(res.data);
    });
  }, [classData.length]);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {classData.classesEnrolled.map((item, index) => {
              return (
                <li key={index} className="nav-text">
                  <Link to={"/studentclassroom/" + item.className}>
                    <span>{item.className}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Sidebar;
