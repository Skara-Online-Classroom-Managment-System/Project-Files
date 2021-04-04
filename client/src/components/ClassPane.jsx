import { set } from 'mongoose'
import React from 'react'
import Classcard from './Classcard.jsx';

export default function ClassPane(props) {

  let classList = props.data.classesEnrolled;
    
  return (
    <div>
      {console.log(classList)/* {classList.map(function(classroom, ind){
        <Classcard data={classroom} key={ind} />;
      }) } */}
    </div>
  );
}
