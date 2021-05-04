import React from "react";
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
