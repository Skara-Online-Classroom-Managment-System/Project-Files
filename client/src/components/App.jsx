// Importing the basic React Model
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Home.jsx';
import StudentLogin from "./Auth/StudentLogin.jsx";
import StudentSignup from "./Auth/StudentSignup.jsx";
import TeacherLogin from "./Auth/TeacherLogin.jsx";
import TeacherSignup from "./Auth/TeacherSignup.jsx";
import Dashboard from './Dashboard.jsx';
import Classroom from './Classroom.jsx';
import {Route} from 'react-router-dom';


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
    </div>
  );
}

export default App;