// Importing the basic React Model
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Home.jsx';
import StudentLogin from "./Auth/StudentLogin.jsx";
import StudentSignup from "./Auth/StudentSignup.jsx";
import TeacherLogin from "./Auth/TeacherLogin.jsx";
import TeacherSignup from "./Auth/TeacherSignup.jsx";
// import Dashboard from './Dashboard.jsx';
import Classroom from './Classroom/Classroom_student.jsx';
import {Route} from 'react-router-dom';
import ClassPane from './Classroom/ClassPane';
import createAnnouncement from "./Announcements/CreateAnnouncement";
import TeamPane from "./TeamPane";
import Dashboard from "./Dashboard/dashboard";
import createClassroom from "./Classroom/createClassroom";


// Defining the App component
function App(){
  
  return (
    <div>
      <Route exact path="/" component={Home} />
      <Route exact path="/studentlogin" component={StudentLogin} />
      <Route exact path="/studentsignup" component={StudentSignup} />
      <Route exact path="/teacherlogin" component={TeacherLogin} />
      <Route exact path="/teachersignup" component={TeacherSignup} /> 
      <Route exact path="/student/:sid" component={Dashboard} />
      <Route exact path="/student/:sid/classroom/:code" component={Classroom} />  
      <Route exact path='/dashboard/:username' component={Dashboard}/>
      <Route exact path="/createClassroom/:username" component={createClassroom}/>
      <Route exact path="/createAnnouncement/:username/:id" component={createAnnouncement}/>
      <Route exact path="/classroom/:username/:id" component={ClassPane}/>
      <Route exact path="/teams/:username/:id" component={TeamPane}/>
    </div>
  );
}

export default App;