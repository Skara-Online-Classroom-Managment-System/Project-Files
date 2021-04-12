// Importing the basic React Model
import React from 'react';
import {Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Home/Home.jsx';
import StudentLogin from "./Auth/StudentLogin.jsx";
import StudentSignup from "./Auth/StudentSignup.jsx";
import TeacherLogin from "./Auth/TeacherLogin.jsx";
import TeacherSignup from "./Auth/TeacherSignup.jsx";
import Dashboard_student from './Dashboard/Dashboard_student.jsx';
import Dashboard_teacher from "./Dashboard/Dashboard_teacher.jsx";
import Classroom_Student from './Classroom/Classroom_student.jsx';
import createClassroom from "./Classroom/createClassroom";
import createAnnouncement from "./Announcements/CreateAnnouncement";
import ClassPane from './Classroom/ClassPane';
import TeamPane from "./Team/TeamPane";



// Defining the App component
function App(){
  
  return (
    <div>
      <Route exact path="/" component={Home} />
      <Route exact path="/studentlogin" component={StudentLogin} />
      <Route exact path="/studentsignup" component={StudentSignup} />
      <Route exact path="/teacherlogin" component={TeacherLogin} />
      <Route exact path="/teachersignup" component={TeacherSignup} /> 
      <Route exact path="/student/:sid" component={Dashboard_student} />
      <Route exact path="/student/:sid/classroom/:code" component={Classroom_Student} />  
      <Route exact path='/dashboard/:username' component={Dashboard_teacher}/>
      <Route exact path="/createClassroom/:username" component={createClassroom}/>
      <Route exact path="/createAnnouncement/:username/:id" component={createAnnouncement}/>
      <Route exact path="/classroom/:username/:id" component={ClassPane}/>
      <Route exact path="/teams/:username/:id" component={TeamPane}/>
    </div>
  );
}

export default App;