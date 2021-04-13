// Importing the modules
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

// Define the PORT
const PORT = 5000;

// express was initialized
const app = express();

// Defining the app.use parts
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(morgan("tiny"));
app.use(
  cors({
    origin: "http://localhost:3000/",
    credentials: true,
  })
);
app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser("Our little secret."));
app.use(passport.initialize());
app.use(passport.session());

// connecting to the mongoDB
mongoose.connect("mongodb://localhost/SkaraDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

// Requiring the models
const classroom = require("./models/classroomModel.js");
const student = require("./models/studentModel.js");
const teacher = require("./models/teacherModel.js");
const team = require("./models/teamModel.js");

// passport plug in of the students
// passport.use(
//   "local-student",
//   new localStrategy((username, password, done) => {
//     student.findOne({ username: username }, (err, currentStudent) => {
//       if (err) throw err;
//       if (!currentStudent) return done(null, student);
//       bcrypt.compare(password, currentStudent.password).then(function (result) {
//         if (result === true) {
//           return done(null, currentStudent);
//         } else {
//           return done(null, false);
//         }
//       });
//     });
//   })
// );

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  if (user != null) {
    done(null, user);
  }
});
// passport plug in of the teachers
passport.use(teacher.createStrategy());
passport.serializeUser(teacher.serializeUser());
passport.deserializeUser(teacher.deserializeUser());
// passport.use(student.createStrategy());
// passport.serializeUser(student.serializeUser());
// passport.deserializeUser(student.deserializeUser());

// Post request to the teacher signup route
app.post("/teachersignup", async function (req, res) {
  teacher.findOne(
    { username: req.body.username },
    async function (err, currentTeacher) {
      if (err) throw err;
      if (currentTeacher) {
        res
          .status(201)
          .json({ Text: "This email has already been registered." });
      }
      if (!currentTeacher) {
        if (req.body.password === "") {
          res.status(201).json({ Message: "Enter a valid password." });
        }
        const hashedPassword = await bcrypt.hash(req.body.pw, 10);
        const newTeacher = new teacher({
          username: req.body.username,
          pw: hashedPassword,
          fn: req.body.fn,
          classesEnrolled: [],
          invitesPending: [],
        });
        await newTeacher.save();
        res.status(200).json({ username: req.body.username });
      }
    }
  );
});

// handles login for teacher when they login
app.post("/teacherlogin", function (req, res) {
  teacher.findOne(
    { username: enteredDetails.username },
    function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          // bcrypt.compare(enteredPassword, foundUser.pw, function(err, result) {
          if (foundUser.pw === enteredDetails.pw) {
            console.log("user found");
            res.status(200).json({ username: enteredDetails.username });
          } else {
            console.log("Enter correct password");
          }
          // });
        } else {
          console.log("email id does not exist");
        }
      }
    }
  );
});

// Post request to the student signup route.
app.post("/studentsignup", async function (req, res) {
  student.findOne(
    { username: req.body.username },
    async function (err, currentStudent) {
      if (err) throw err;
      if (currentStudent) {
        res.status(201).json({ Text: "This SID has already been registered." });
      }
      if (!currentStudent) {
        if (req.body.password === "") {
          res.status(201).json({ Message: "Enter a valid password." });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newStudent = new student({
          username: req.body.username,
          password: hashedPassword,
          firstName: req.body.fn,
          lastName: req.body.ln,
          classesEnrolled: [],
        });
        await newStudent.save();
        res.status(200).json({ username: req.body.username });
      }
    }
  );
});

// Post request to the login route.
app.post("/studentlogin", function (req, res, next) {
  const currentStudent = new student({
    username: req.body.username,
    password: req.body.password,
  });
  passport.authenticate("local-student", (err, currentStudent, info) => {
    if (err) throw err;
    if (!currentStudent) res.status(201).json({ Text: "No such User exists." });
    else {
      req.logIn(currentStudent, (err) => {
        if (err) throw err;
        res.status(200).json({ Text: "Successfully Authenticated!!" });
      });
    }
  })(req, res, next);
});

// ..............................................................

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
  teacher.findOne(
    { username: req.params.username },
    function (err, foundTeacher) {
      if (err) {
        console.log(err);
      } else {
        const data = new classroom({
          className: req.body.className,
          classCode: makeid(6),
          teachers: [foundTeacher._id],
          announcements: [],
          teams: "606d6de3dcc36b45a8fe9091",
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
    }
  );
});

// stores announcement inside classroom model
app.post("/createAnnouncement/:username/:id", function (req, res) {
  const event = new Date();

  classroom.findOne({ classCode: req.params.id }, function (err, foundClass) {
    if (err) {
      console.log(err);
    } else {
      teacher.findOne(
        { username: req.params.username },
        function (err, foundTeacher) {
          const data = {
            author: foundTeacher.fn,
            text: req.body.announcement,
            time: event.toLocaleDateString("en-US"),
          };
          foundClass.announcements.push(data);
          foundClass.save(function (err) {
            if (!err) {
              console.log("Succesfully added announcement");
            }
          });
        }
      );
    }
  });
});

app.post("/addclass", function (req, res) {
  const sid = req.body.sid;
  const classCode = req.body.classCode;
  var query = student
    .findOne({ sid: sid })
    .populate("classesEnrolled")
    .exec(function (err, currentStudent) {
      if (err) {
        console.log(err);
      } else {
        var found = false;
        for (var i = 0; i < currentStudent.classesEnrolled.length; i++) {
          if (currentStudent.classesEnrolled[i].classCode === classCode) {
            found = true;
            break;
          }
        }
        if (found) {
          res.status(201).json({ result: "Class is already enrolled in" });
        } else {
          var nQuery = classroom.findOne(
            { classCode: classCode },
            function (e, currentClassroom) {
              if (e) {
                console.log(e);
              } else {
                if (currentClassroom) {
                  currentClassroom.studentsEnrolled.push(currentStudent);
                  currentStudent.classesEnrolled.push(currentClassroom);
                  currentStudent.save();
                  currentClassroom.save();
                  res.status(200).json({ text: "Success" });
                } else {
                  res.status(201).json({ text: "Class not found" });
                }
              }
            }
          );
        }
      }
    });
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
        res.status(200).json({ classesEnrolled: foundTeacher });
      }
    });
});

// display info of a particular class
app.get("/classpane/:username/:id", function (req, res) {
  classroom.findOne({ classCode: req.params.id }, function (err, foundClass) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({ class: foundClass });
    }
  });
});

app.get("/team/:username/:id", function (req, res) {
  classroom
    .findOne({ classCode: req.params.id })
    .populate("teams")
    .exec(function (err, foundClass) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({ teams: foundClass.teams });
      }
    });
});

// get request from the server based on the parameters to display dashboard
app.get("/user", function (req, res) {
  console.log(req.query);
  var q = student
    .findOne({ sid: req.query.sid })
    .populate("classesEnrolled")
    .exec(function (err, currentStudent) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(currentStudent);
      }
    });
});

// get the values associated with the classroom
app.get("/classroom", function (req, res) {
  var q = classroom
    .findOne({ classCode: req.query.code })
    .populate("teachers")
    .populate("studentsEnrolled")
    .populate({
      path: "announcements",
      populate: { path: "author" },
    })
    .populate("teamsAssociated")
    .exec(function (err, currentClassroom) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(currentClassroom);
      }
    });
});

// Listening to the port PORT.
app.listen(PORT, function () {
  console.log("Server is listening to port ", PORT);
});
