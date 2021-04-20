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
const MongoStore = require("connect-mongo");

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

app.use(cookieParser());

// connecting to the mongoDB
mongoose.connect("mongodb://localhost:27017/SkaraDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

const sessionStore = new MongoStore({
  mongoUrl: "mongodb://localhost:27017/SkaraDB",
  mongooseConnection: mongoose.connection,
  collection: "sessions",
  ttl: 24 * 60 * 60 * 1000,
});

app.use(
  session({
    secret: "secret",
    store: sessionStore,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: false,
    resave: true,
  })
);

// Requiring the models
const classroom = require("./models/classroomModel.js");
const student = require("./models/studentModel.js");
const teacher = require("./models/teacherModel.js");
const team = require("./models/teamModel.js");

// a post route to the logout functionality
app.get("/logout", function (req, res) {
  req.session.value = "NA";
  req.session.destroy();
  console.log("cookie deleted");
});

// a user route to render the nav bar
app.get("/user", async (req, res) => {
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, "secret");
    if (claims.type === 1) {
      student.findOne({ _id: claims._id }, function (err, currentStudent) {
        if (err) {
          console.log(err);
        } else {
          var { _id, password, ...details } = currentStudent._doc;
          res.status(200).json(details);
        }
      });
    } else if (claims.type === 2) {
      teacher.findOne({ _id: claims._id }, function (err, currentTeacher) {
        if (err) {
          console.log(err);
        } else {
          var { _id, pw, ...details } = currentTeacher._doc;
          res.status(200).json(details);
        }
      });
    }
  } catch (error) {
    console.log(error);
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
          firstName: req.body.firstName,
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
                  { _id: foundUser._id, type: 2 },
                  "secret"
                );
                req.session.value = token;
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
    async function (err, currentStudent) {
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
        bcrypt.hash(req.body.password, 10, function (err, hashedPassword) {
          if (err) {
            console.log(err);
          }
          const newStudent = new student({
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            classesEnrolled: [],
          });
          newStudent.save();
          console.log(newStudent);
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
app.post("/createclassroom", function (req, res) {
  try {
    const cookie = req.session.value;
    console.log("createClassrooom:", cookie);
    const claims = jwt.verify(cookie, "secret");
    teacher.findOne({ _id: claims._id }, function (err, foundTeacher) {
      if (err) {
        console.log(err);
      } else {
        console.log("insode function of create classroom");
        const data = new classroom({
          className: req.body.className,
          classCode: makeid(6),
          teachers: [],
          announcements: [],
          teams: [],
        });
        data.teachers.push(foundTeacher._id);
        data.save(function (err, result) {
          console.log(result);
          if (!err) {
            foundTeacher.classesEnrolled.push(result._id);
            foundTeacher.save(function (err) {
              if (!err) {
                console.log("teacher updated");
              }
            });
          } else {
            console.log(" result:", err);
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// stores announcement inside classroom model
app.post("/createAnnouncement/:name/", function (req, res) {
  try {
    const event = new Date();
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, "secret");
    classroom.findOne(
      { className: req.params.name },
      function (err, foundClass) {
        if (err) {
          console.log(err);
        } else {
          teacher.findOne(
            { _id: foundClass.teachers[0] },
            async function (err, foundTeacher) {
              const data = {
                author: foundTeacher.firstName,
                text: req.body.announcement,
                time: event.toLocaleDateString("en-US"),
              };
              foundClass.announcements.push(data);
              await foundClass.save(function (err) {
                if (!err) {
                  res
                    .status(200)
                    .json({ msg: "Succesfully added announcement" });
                }
              });
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
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

app.get("/teacherdashboard", function (req, res) {
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, "secret");
    if (!claims) {
      res.status(404).json({ message: "Unauthorized" });
    }
    console.log(claims);
    var q = teacher
      .findOne({ _id: claims._id })
      .populate("classesEnrolled")
      .exec(function (err, foundTeacher) {
        if (err) {
          console.log(err);
        } else {
          var { _id, pw, ...details } = foundTeacher._doc;
          res.status(200).json(details);
        }
      });
  } catch (e) {
    return res.status(404).json({ message: "Unauthorized" });
  }
});

// get request from the server based on the parameters to display dashboard
app.get("/studentdashboard", function (req, res) {
  try {
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
          res.status(200).json(details);
        }
      });
  } catch (e) {
    return res.status(404).json({ message: "Unauthorized" });
  }
});

app.get("/studentclassroom/:name", function (req, res) {
  try {
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
          currentStudent.classesEnrolled.map((currentClass, index) => {
            if (currentClass.className === req.params.name) {
              res.status(200).json(currentClass);
            }
          });
        }
      });
  } catch (err) {
    console.log(err);
  }
});
// get the values associated with the teacher classroom
app.post("/classroom/:name", function (req, res) {
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, "secret");
    if (!claims) {
      res.status(404).json({ message: "Unauthorized" });
    }

    var q = teacher
      .findOne({ _id: claims._id })
      .populate("classesEnrolled")
      .exec(async function (err, currentTeacher) {
        if (err) {
          res.send(err);
        } else {
          await currentTeacher.classesEnrolled.map((currentClass, index) => {
            if (currentClass.className === req.params.name) {
              return res.status(200).json(currentClass);
            }
          });
        }
      });
  } catch (err) {
    console.log(err);
  }
});

app.get("/stream", function (req, res) {
  const cookie = req.session.value;
  console.log(req.session);
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
  var q = classroom
    .findOne({ classCode: req.query.pos })
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

app.get("/people", function (req, res) {
  const cookie = req.session.value;
  console.log(req.session);
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
  var q = classroom
    .findOne({ classCode: req.query.pos })
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

app.get("/teams", function (req, res) {
  const cookie = req.session.value;
  console.log(req.session);
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
  var q = classroom
    .findOne({ classCode: req.query.pos })
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
