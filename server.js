// Importing the modules
const express = require("express");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const morgan = require('morgan');
const path = require('path');
const cors = require("cors");

// Define the PORT
const PORT = 5000;

// express was initialized
const app = express();

// Defining the app.use parts
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(morgan('tiny'));
app.use(cors({
  origin: "http://localhost:3000/",
  credentials: true
}));
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// connecting to the mongoDB
mongoose.connect("mongodb://localhost/SkaraDB",{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Database connected');
});

// Requiring the models
const classroom = require('./models/classroomModel.js');
const student = require('./models/studentModel.js');
const teacher = require('./models/teacherModel.js');
const team = require('./models/teamModel.js');

// passport plug in of the students
passport.use(student.createStrategy());
passport.serializeUser(student.serializeUser());
passport.deserializeUser(student.deserializeUser());
// passport plug in of the teachers
passport.use(teacher.createStrategy());
passport.serializeUser(teacher.serializeUser());
passport.deserializeUser(teacher.deserializeUser());

// Post request to the teacher register route
app.post("/teachersignup", function(req, res) {
  
  teacher.register({
    fn: req.body.fn,
    username: req.body.username,
    classesEnrolled: [],
    invitesPending: []},req.body.pw,function(err,registeredTeacher){
    if(err){
      console.log(err);
    }
    else{
      passport.authenticate("local")(req,res,function(){
        res.status(200).json({"username":req.body.username});
          return;
        });
      }
    })      
});



// Post request to the register route.
app.post("/studentauth/register", function(req,res){

  student.register({
    username: req.body.sid,
    firstName: req.body.fn,
    lastName: req.body.ln
  }, req.body.password, function(err, currentStudent){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req, res, function(){
        console.log(req);
      });
    }
  });

// Creating a new student based on the details entered.
//   const studentData = new student({
//     firstName: req.body.fn,
//     lastName: req.body.ln,
//     sid: req.body.sid,
//     password: req.body.password,
//     classesEnrolled: []
//   });
//   // To check if the specified SID is registered or not.
//   const exist = student.count({sid: studentData.sid}, function(err, num){
//     if(err){
//       console.log(err);
//     }
//     else{
//       if(num === 0){
//         studentData.save(function(err, User){
//           if(err){
//             console.log(err);
//             res.send('There is an unexpected error. Try again!');
//           }
//           else{
//             res.send('You have been Logged in.')
//           }
//         });
//       }
//       else{
//         res.send("Sorry! This SID is already registered.")
//       }
//     }
//   });
})

// // ..........................................................

// // Post request to the login route.
app.post("/studentauth/login", function(req,res){
  const s = new student({
    username: req.body.sid,
    password: req.body.password
  });
  console.log(s);
  req.login(s, function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req, res, function(){
        console.log("hmmm");
        return;
      });
      res.json({"Hell":"Yeah"});
      return;
    }
  });
  // const enteredSid = req.body.sid;
  // const enteredPassword = req.body.password;
  // var query = student.findOne({sid: enteredSid}, function(err, currentStudent){
  //   if(err){
  //     res.send('<h1>Enter the correct details.</h1>');
  //   }
  //   else{
  //     if(currentStudent && currentStudent.sid === enteredSid && currentStudent.password === enteredPassword){
  //       res.json({sid: enteredSid});
  //     }
  //     else{
  //       res.send('<h1>Enter the correct details.</h1>');
  //     }
  //   }
  // });
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

// get the values associated with the classroom
app.get('/classroom', function(req, res){
  var q = classroom
            .findOne({classCode: req.query.code})
            .populate('teachers')
            .populate('studentsEnrolled')
            .populate({
              path: 'announcements',
              populate: {path: 'author'}
            })
            .populate('teamsAssociated')
            .exec(function(err, currentClassroom){
              if(err){
                res.send(err);
              }
              else{
                res.status(200).json(currentClassroom);
              }
            });
});

app.post('/addclass', function(req,res){
  const sid = req.body.sid;
  const classCode = req.body.classCode;
  var query = student.findOne({sid: sid})
                     .populate('classesEnrolled')
                     .exec(function(err, currentStudent){
                       if(err){
                         console.log(err);
                       }else{
                         var found = false;
                         for(var i = 0; i < currentStudent.classesEnrolled.length; i++){
                          if(currentStudent.classesEnrolled[i].classCode === classCode){
                            found = true;
                            break;
                          }
                         }
                         if(found){
                           res.status(201).json({"result":"Class is already enrolled in"});
                         }else{
                          var nQuery = classroom.findOne({classCode: classCode}, function(e, currentClassroom){
                            if(e){
                              console.log(e)
                            }else{
                              if(currentClassroom){
                                currentClassroom.studentsEnrolled.push(currentStudent);
                                currentStudent.classesEnrolled.push(currentClassroom);
                                currentStudent.save();
                                currentClassroom.save();
                                res.status(200).json({"text":"Success"});
                              }
                              else{
                                res.status(201).json({"text":"Class not found"})
                              }
                            }
                          })
                         }
                       }
                     })
});

//////////////////////////////////////////////////////////////////////////
app.get("/dashboard/:username", function (req, res) {
  teacher
  .findOne({ username: req.params.username })
  .populate("classesEnrolled")
  .exec(function (err, foundTeacher) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({ "classesEnrolled": foundTeacher });
    }
  });
});

// display info of a particular class
app.get("/classpane/:username/:id",function(req,res){
  classroom.findOne({classCode:req.params.id},function(err,foundClass){
    if(err){
      console.log(err);
    }
    else{
      res.status(200).json({"class":foundClass});
    }
  })
})

app.get("/team/:username/:id",function(req,res){
  classroom
  .findOne({classCode:req.params.id})
  .populate("teams")
  .exec(function(err,foundClass){
    if(err){
      console.log(err)
    }else{
      res.status(200).json({"teams":foundClass.teams});
    }
  })
})

//handles post request when users login or registered
app.post("/teacher_register", function (req, res) {
    
  const data = new teacher({
    fn: req.body.fn,
    username: req.body.username,
    pw: req.body.password,
    classesEnrolled: [],
    invitesPending: []
  });
  
  // teacher.register({username:req.body.username},req.body.pw,function(err,registeredTeacher){
  //   if(err){
  //     console.log(err);
  //   }
  //   else{
  //     // passport.authenticate("local")(req,res,function(){
        teacher.findOne({ username: req.body.username }, function (err, foundTeacher) {
          if (err) {
            console.log(err);
          } else {
            if (foundTeacher) {
              console.log("Email already exists. Try another account.");
              // res.redirect("/login");
            } 
            else{
              data.save(function (err) {
                if (!err) {
                  res.status(200).json({ username: req.body.username });    
                }
              });
              
            }
          }
        });
      // })
  //   }
  // })
  
      
});
//handles login information
app.post("/login", function (req, res) {
  
  // const enteredDetails=new teacher({
  //   username:req.body.username,
  //   pw:req.body.password
  // })
  
  // req.login(enteredDetails,function(err){
  //   if(err){
  //     console.log(err);
  //   }
  //   else{
  //      passport.authenticate("local")(req,res,function(){
  //        if(err){
  //          console.log(err);
  //        }
  //        else{
  //        }
  //      })
  //   }
  // })
  teacher.findOne({ username: enteredDetails.username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser){  
        // bcrypt.compare(enteredPassword, foundUser.pw, function(err, result) {
          if(foundUser.pw===enteredDetails.pw){
          console.log("user found");
          res.status(200).json({ username: enteredDeatails.username });
        }
          else{
            console.log("Enter correct password");
          }
        // });    
      }
     else {
       console.log("email id does not exist")
      }
    }
  });
});

//storing name and id of a classroom
function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
//creates classroom inside classroom model and link it with teacher id
app.post("/createclassroom/:username", function (req, res) {
  
  teacher.findOne({ username: req.params.username }, function (err, foundTeacher) {
    if (err) {
      console.log(err);
    } else {
      const data = new classroom({
        className: req.body.className,
        classCode: makeid(6),
        teachers: [foundTeacher._id],
        announcements: [],
        teams:"606d6de3dcc36b45a8fe9091"
      });
      data.save(function (err, result) {
        if (!err) {
          foundTeacher.classesEnrolled.push(result._id);
          foundTeacher.save(function (err) {
            if (!err) {
              console.log("teacher updated");
            }
          });
        }
      });
    }
  });
});

// stores announcement inside classroom model 
app.post("/createAnnouncement/:username/:id",function(req,res){
  const event = new Date();

  classroom.findOne({ classCode: req.params.id }, function (err, foundClass) {
    if (err) {
      console.log(err);
    } else {
      teacher.findOne({username:req.params.username},function(err,foundTeacher){
        const data={
          author:foundTeacher.fn,
          text:req.body.announcement,
          time:event.toLocaleDateString('en-US')
        }
        foundClass.announcements.push(data);
        foundClass.save(function(err){
          if (!err) {
            console.log("Succesfully added announcement");   
          }
        })
      })
    }
  });
})

// Listening to the port PORT.
app.listen(PORT, function(){
  console.log("Server is listening to port ", PORT);
});
