// Importing the basic React Model
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./Home/Home.jsx";
import StudentLogin from "./Auth/StudentLogin.jsx";
import StudentSignup from "./Auth/StudentSignup.jsx";
import TeacherLogin from "./Auth/TeacherLogin.jsx";
import TeacherSignup from "./Auth/TeacherSignup.jsx";
import DashboardStudent from "./Dashboard/Dashboard_student.jsx";
import DashboardTeacher from "./Dashboard/Dashboard_teacher.jsx";
import ClassroomStudent from "./Classroom/Classroom_student.jsx";
import createClassroom from "./Classroom/createClassroom";
import ClassPane from "./Classroom/ClassPane";

// Defining the App component
function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/studentlogin" component={StudentLogin} />
          <Route exact path="/studentsignup" component={StudentSignup} />
          <Route exact path="/teacherlogin" component={TeacherLogin} />
          <Route exact path="/teachersignup" component={TeacherSignup} />
          <Route exact path="/studentdashboard/" component={DashboardStudent} />
          <Route
            exact
            path="/studentclassroom/:studentclassname"
            component={ClassroomStudent}
          />
          <Route exact path="/teacherdashboard" component={DashboardTeacher} />
          <Route exact path="/createClassroom" component={createClassroom} />
          <Route exact path="/classroom/:name" component={ClassPane} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
