import React from "react";

export default function CardStats({
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
      <div className='relative flex flex-col min-w-0 break-words bg-blueGray-700 rounded mx: 0 xl:mb-0 shadow-lg'>
        <div className='flex-auto p-4 mb-2 '>
          <div className='flex flex-wrap'>
            <div className='relative w-full pr-4 max-w-full flex-grow flex-1'>
              <span className='font-semibold uppercase text-5xl text-white'>
                {statTitle}
              </span>
            </div>
            <div className='relative w-auto pl-4 flex-initial'>
              <div
                className={
                  "text-bg-blueGray-700 p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full " +
                  "bg-blueGray-100"
                }
              >
                <i class='fa fa-book' aria-hidden='true'></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

