// The initial import and inititalization of modules and their objects.
// Requiring and initializing the express object.
const express = require("express");
const app = express();
// Requiring the mongoose module and checking if the connection is actually made.
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/SkaraDB",{
  useNewUrlParser: true,
  useUnifiedTopology:true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Database connected');
});
// Requiring the morgan module.
const morgan = require('morgan');
// Requiring the path module. 
const path = require('path');
// Defining the PORT
const PORT = 5000;
// Use the HTML Logger (morgan).
app.use(morgan('tiny'));
// A kind of bodyParser. It makes the json objects available.
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))
// CORS error
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:3000/",
  credentials: true
}));

// ........................................................

// Requiring the models
const classroom = require('./models/classroomModel.js');
const student = require('./models/studentModel.js');
const teacher = require('./models/teacherModel.js');
const team = require('./models/teamModel.js');

// ........................................................

// Post request to the register route.
app.post("/register", function(req,res){
  // Creating a new student based on the details entered.
  const studentData = new student({
    firstName: req.body.fn,
    lastName: req.body.ln,
    sid: req.body.sid,
    password: req.body.password,
    classesEnrolled: []
  });
  // To check if the specified SID is registered or not.
  const exist = student.count({sid: studentData.sid}, function(err, num){
    if(err){
      console.log(err);
    }
    else{
      if(num === 0){
        studentData.save(function(err, User){
          if(err){
            console.log(err);
            res.send('There is an unexpected error. Try again!');
          }
          else{
            res.send('You have been Logged in.')
          }
        });
      }
      else{
        res.send("Sorry! This SID is already registered.")
      }
    }
  });
})

// ..........................................................

// Post request to the login route.
app.post("/login", function(req,res){
  const enteredSid = req.body.sid;
  const enteredPassword = req.body.password;
  var query = student.findOne({sid: enteredSid}, function(err, currentStudent){
    if(err){
      res.send('<h1>Enter the correct details.</h1>');
    }
    else{
      if(currentStudent && currentStudent.sid === enteredSid && currentStudent.password === enteredPassword){
        res.json({sid: enteredSid});
      }
      else{
        res.send('<h1>Enter the correct details.</h1>');
      }
    }
  });
})

// ..............................................................

// get request from the server based on the parameters to display dashboard
app.get('/user', function(req,res){
  console.log(req.query);
  var q = student
            .findOne({sid: req.query.sid})
            .populate('classesEnrolled')
            .exec(function(err, currentStudent){
              if(err){
                res.send(err);
              }
              else{
                res.status(200).json(currentStudent);
              }
            });
});

// Listening to the port PORT.
app.listen(PORT, function(){
  console.log("Server is listening to port ", PORT);
});
