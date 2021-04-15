// Importing the modules
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");

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
    secret: "secret",
    cookie: { maxAge: 12 * 60 * 60 * 60 * 1000 },
    saveUninitialized: false,
    resave: true,
  })
);

app.use(cookieParser());

// connecting to the mongoDB
mongoose.connect("mongodb://localhost:27017/SkaraDB", {
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

app.get("/logout", function (req, res) {
  req.session.value = "NA";
  req.session.destroy();
  console.log("cookie deleted");
});

app.get("/user", async (req, res) => {
  const cookie = req.session.value;
  const claims = jwt.verify(cookie, "secret");
  console.log(claims);
  if (claims.type === 1) {
    student.findOne({ _id: claims._id }, function (err, currentStudent) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(currentStudent);
      }
    });
  }
});

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
          fn: req.body.fn,
          classesEnrolled: [],
          invitesPending: [],
          username: req.body.username,
          pw: hashedPassword,
        });
        await newTeacher.save();
        res.status(200).json({ username: req.body.username });
      }
    }
  );
});

// handles login for teacher when they login
app.post("/teacherlogin", function (req, res, next) {
  const enteredDetails = {
    username: req.body.username,
    pw: req.body.password,
  };
  teacher.findOne(
    { username: enteredDetails.username },
    async function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          await bcrypt.compare(
            enteredDetails.pw,
            foundUser.pw,
            function (err, result) {
              if (result === true) {
                console.log("user found");
                const token = jwt.sign(
                  { _id: foundUser._id, type: 1 },
                  "secret"
                );
                res.cookie("jwt", token, {
                  httpOnly: true,
                  maxAge: 24 * 60 * 60 * 1000,
                });
                res.status(200).json({ username: enteredDetails.username });
              } else {
                console.log("Enter correct password");
              }
            }
          );
        } else {
          console.log("email id does not exist");
        }
      }
    }
  );
});

// Post request to the student signup route.
app.post("/studentsignup", function (req, res) {
  student.findOne(
    { username: req.body.username },
    function (err, currentStudent) {
      if (err) {
        console.log(err);
      }
      if (currentStudent) {
        res.status(201).json({ Text: "This SID has already been registered." });
      }
      if (!currentStudent) {
        if (req.body.password === "") {
          res.status(201).json({ Message: "Enter a valid password." });
        }
        bcrypt.hash(req.body.pw, 10, function (err, hashedPassword) {
          if (err) {
            console.log(err);
          }
          const newStudent = new student({
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.fn,
            lastName: req.body.ln,
            classesEnrolled: [],
          });
          newStudent.save();
        });
        res.status(200).json({ username: req.body.username });
      }
    }
  );
});

// Post request to the login route.
app.post("/studentlogin", function (req, res) {
  const enteredDetails = {
    username: req.body.username,
    password: req.body.password,
  };
  student.findOne(
    { username: enteredDetails.username },
    async function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          await bcrypt.compare(
            enteredDetails.password,
            foundUser.password,
            function (err, result) {
              if (result === true) {
                console.log("user found");
                const token = jwt.sign(
                  { _id: foundUser._id, type: 1 },
                  "secret"
                );
                req.session.value = token;
                console.log(req.session.value);
                res.status(200).json({ username: enteredDetails.username });
              } else {
                console.log("Enter correct password");
              }
            }
          );
        } else {
          console.log("sid does not exist");
        }
      }
    }
  );
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
  const cookie = req.session.value;
  const claims = jwt.verify(cookie, "secret");
  if (!claims || claims.type === 2) {
    res.status(404).json({ message: "Unauthorized" });
  }
  const classCode = req.body.classCode;
  var query = student
    .findOne({ _id: claims._id })
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
                  // console.log(currentClassroom.studentsEnrolled);
                  // console.log(currentStudent.classesEnrolled);
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
  console.log(req.session);
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

// get request from the server based on the parameters to display dashboard
app.get("/studentdashboard", function (req, res) {
  const cookie = req.session.value;
  const claims = jwt.verify(cookie, "secret");
  if (!claims) {
    res.status(404).json({ message: "Unauthorized" });
  }
  var q = student
    .findOne({ _id: claims._id })
    .populate("classesEnrolled")
    .exec(function (err, currentStudent) {
      if (err) {
        res.send(err);
      } else {
        var { _id, password, ...details } = currentStudent._doc;
        console.log(details);
        res.status(200).json(details);
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
