import React from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
export default function CardStats({
  announcementPos,
  statSubtitle,
  statTitle,
  statPercent,
  statPercentColor,
  statDescripiron,
  statIconName,
  statIconColor,
}) {
  return (
    <>
      <div className='relative flex flex-col min-w-0 break-words bg-white rounded mb-10 xl:mb-0 shadow-lg'>
        <div className='flex-auto p-2'>
          <div className='flex flex-wrap'>
            <div className='relative w-full max-w-full flex-grow flex-1'>
              <h5 className='text-blueGray-400 uppercase font-bold text-xs'>
                {statSubtitle + " : " + statPercent}
              </h5>
              <span className='font-semibold text-l text-blueGray-700'>
                {statTitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// CardStats.defaultProps = {
//   statSubtitle: "Traffic",
//   statTitle: "350,897",
//   statArrow: "up",
//   statPercent: "3.48",
//   statPercentColor: "text-emerald-500",
//   statDescripiron: "Since last month",
//   statIconName: "far fa-chart-bar",
//   statIconColor: "bg-red-500",
// };

// CardStats.propTypes = {
//   statSubtitle: PropTypes.string,
//   statTitle: PropTypes.string,
//   statArrow: PropTypes.oneOf(["up", "down"]),
//   statPercent: PropTypes.string,
//   // can be any of the text color utilities
//   // from tailwindcss
//   statPercentColor: PropTypes.string,
//   statDescripiron: PropTypes.string,
//   statIconName: PropTypes.string,
//   // can be any of the background color utilities
//   // from tailwindcss
//   statIconColor: PropTypes.string,
// };
