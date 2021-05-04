import React from "react";
import {  withRouter } from "react-router-dom";


const CardStats = ({
  announcementPos,
  statSubtitle,
  statTitle,
  statPercent,
  statPercentColor,
  statDescripiron,
  statIconName,
  statIconColor,
}) => {
  
  return (
    <>
      <div className='relative flex flex-col min-w-0 break-words bg-white rounded mb-10 xl:mb-0 shadow-lg'>
        <div className='flex-auto p-4 '>
          <div className='flex flex-wrap'>
            <div className='relative w-full pr-4 max-w-full flex-grow flex-1'>
              
              <span className='font-semibold text-xl text-blueGray-700'>
                {statTitle}
              </span>
              <h5 className='text-sm text-blueGray-400 mt-4'>
                {statSubtitle}
              </h5>
            </div>
            <div className='relative w-auto pl-4 flex-initial'>
              <div
                className={
                  "text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full " +
                  statIconColor
                }
              >
                  <i className={statIconName}></i>
                
              </div>
            </div>
          </div>
          <p className='text-sm text-blueGray-400 mt-4'>
            <span className={statPercentColor + " mr-2"}>
              <a className="hover:text-blueGray-700" href={statPercent} target="_blank"><strong>{statPercent} </strong></a>
            </span>
            <span className='whitespace-nowrap'>{statDescripiron}</span>
          </p>
        </div>
      </div>
    </>
  );
};
export default withRouter(CardStats);
