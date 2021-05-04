import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useParams } from "react-router-dom";

// components

import CardClassTitle from "./CardClassTitle.js";

export default function CardTable({ color }) {
  const [classData, setclassData] = React.useState({});
  const { pos } = useParams();
  React.useEffect(() => {
    axios({
      method: "GET",
      withCredentials: true,
      url: "/classroom",
      params: {
        pos: pos,
      },
    }).then((res) => {
      console.log(res.data.classData);
      setclassData(res.data.classData);
    });
  }, [classData.length]);
  console.log(classData, "cardTable");

  let toshowteacher = null;
  if (classData.teachers) {
    toshowteacher = classData.teachers.map((currentTeacher, index) => (
      <th className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center'>
        <i class='far fa-user'></i>{" "}
        <span
          className={
            "ml-3 font-bold " +
            (color === "light" ? "text-blueGray-600" : "text-white")
          }
        >
          {currentTeacher.firstName + " " + currentTeacher.lastName}
        </span>
      </th>
    ));
  }
  let toshowstudent = null;
  if (classData.studentsEnrolled) {
    toshowstudent = classData.studentsEnrolled.map((currentStudent, index) => (
      <th className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center'>
        <i class='far fa-user'></i>{" "}
        <span
          className={
            "ml-3 font-bold " +
            +(color === "light" ? "text-blueGray-600" : "text-white")
          }
        >
          {currentStudent.firstName + " " + currentStudent.lastName}
        </span>
      </th>
    ));
  }
  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full lg:w-11/12 xl:w-11/12 px-4 mb-5 '>
          <CardClassTitle
            statTitle={classData.className}
            statArrow='up'
            statPercentColor='text-emerald-200'
            statIconColor='bg-transparent'
          />
        </div>
      </div>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className='rounded-t mb-0 px-4 py-3 border-0'>
          <div className='flex flex-wrap items-center'>
            <div className='relative w-full px-4 max-w-full flex-grow flex-1'>
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                People
              </h3>
            </div>
          </div>
        </div>
        {
          <div className='block w-full overflow-x-auto'>
            <table className='items-center w-full bg-transparent border-collapse'>
              <thead>
                <tr>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Teachers
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>{toshowteacher}</tr>
              </tbody>
              <thead>
                <tr>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    Students
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>{toshowstudent}</tr>
              </tbody>
            </table>
          </div>
        }
      </div>
    </>
  );
}

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
