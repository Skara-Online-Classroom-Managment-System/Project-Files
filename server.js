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
const dotenv = require("dotenv");
dotenv.config();
// Define the PORT
const PORT = process.env.PORT || 5000;

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
const CONNECTION_URL = process.env.MONGO_URI;
// connecting to the mongoDB
mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

const key = process.env.key;
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: CONNECTION_URL,
      mongooseConnection: mongoose.connection,
      collection: "sessions",
      ttl: 24 * 60 * 60 * 1000,
    }),
    secret: key,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: false,
    resave: true,
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Requiring the models
const classroom = require("./models/classroomModel.js");
const student = require("./models/studentModel.js");
const teacher = require("./models/teacherModel.js");
const team = require("./models/teamModel.js");
const { createBrotliCompress } = require("zlib");

// a post route to the logout functionality
app.post("/logout", function (req, res) {
  req.session.value = "NA";
  req.session.destroy();
  res.status(200).json({ msg: "logout successfully" });
});

// a user route to render the nav bar
app.get("/user", async (req, res) => {
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    if (claims.type === 1) {
      student.findOne({ _id: claims._id }, function (err, currentStudent) {
        if (err) {
          console.log(err);
        } else {
          if (currentStudent) {
            var { _id, password, ...details } = currentStudent._doc;
            res.status(200).json(details);
          }
        }
      });
    }
    if (claims.type === 2) {
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
          .json({ msg: "This email has already been registered." });
      }
      if (!currentTeacher) {
        if (req.body.password === "") {
          res.status(201).json({ msg: "Enter a valid password." });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newTeacher = new teacher({
          firstName: req.body.firstName,
          classesEnrolled: [],
          invitesPending: [],
          username: req.body.username,
          password: hashedPassword,
          lastName: req.body.lastName,
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
    password: req.body.password,
  };
  teacher.findOne(
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
                const token = jwt.sign({ _id: foundUser._id, type: 2 }, key);
                req.session.value = token;
                res.status(200).json({ username: enteredDetails.username });
              } else {
                res.status(201).json({ msg: "Enter correct password" });
              }
            }
          );
        } else {
          res.status(201).json({ msg: "email id does not exist" });
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
        res.status(201).json({ msg: "This SID has already been registered." });
      }
      if (!currentStudent) {
        if (req.body.password === "") {
          res.status(201).json({ msg: "Enter a valid password." });
        }
        await bcrypt.hash(
          req.body.password,
          10,
          async function (err, hashedPassword) {
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
            await newStudent.save();
          }
        );
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
                const token = jwt.sign({ _id: foundUser._id, type: 1 }, key);
                req.session.value = token;
                return res
                  .status(200)
                  .json({ username: enteredDetails.username });
              } else {
                return res.status(201).json({ msg: "invalid credentials" });
              }
            }
          );
        } else {
          res.status(201).json({ msg: "invalid credentials" });
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

    const claims = jwt.verify(cookie, key);
    teacher.findOne({ _id: claims._id }, function (err, foundTeacher) {
      if (err) {
        console.log(err);
      } else {
        const data = new classroom({
          className: req.body.className,
          classCode: makeid(6),
          teachers: [],
          announcements: [],
          teams: [],
        });
        data.teachers.push(foundTeacher._id);
        data.save(function (err, result) {
          if (!err) {
            foundTeacher.classesEnrolled.push(result._id);
            foundTeacher.save(function (err) {
              if (!err) {
                res.status(200).json({ msg: "teacher updated" });
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
app.post("/createAnnouncement/:pos", function (req, res) {
  try {
    const event = new Date();
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    teacher
      .findOne({ _id: claims._id })
      .populate("classesEnrolled")
      .exec(async function (err, foundTeacher) {
        if (err) {
          console.log(err);
        } else {
          const foundClass = foundTeacher.classesEnrolled[req.params.pos];
          const data = {
            author: claims._id,
            text: req.body.announcement,
            time: event.toLocaleDateString("en-US"),
          };
          foundClass.announcements.push(data);
          await foundClass.save(function (err) {
            if (!err) {
              res.status(200).json({ class: foundClass });
            }
          });
        }
      });
  } catch (err) {
    console.log(err);
  }
});

app.post("/addclass", function (req, res) {
  const cookie = req.session.value;
  const claims = jwt.verify(cookie, key);
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
          if (
            currentStudent.classesEnrolled[i].classCode.toString() ===
            classCode.toString()
          ) {
            found = true;
            break;
          }
        }
        if (found) {
          res.status(200).json({ result: "Class is already enrolled in" });
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
                  res.status(200).json({ result: "Success" });
                } else {
                  res.status(200).json({ result: "Class not found" });
                }
              }
            }
          );
        }
      }
    });
});

app.get("/dashboard", function (req, res) {
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    if (!claims) {
      res.status(404).json({ message: "Unauthorized" });
    }
    if (claims.type === 2) {
      var q = teacher
        .findOne({ _id: claims._id })
        .populate("classesEnrolled")
        .exec(function (err, foundTeacher) {
          if (err) {
            console.log(err);
          } else {
            var { _id, password, ...details } = foundTeacher._doc;
            return res
              .status(200)
              .json({ details: details, type: claims.type });
          }
        });
    }
    if (claims.type === 1) {
      var q = student
        .findOne({ _id: claims._id })
        .populate("classesEnrolled")
        .populate({
          path: "classesEnrolled",
          populate: { path: "teachers" },
        })
        .exec(function (err, currentStudent) {
          if (err) {
            res.send(err);
          } else {
            var { _id, password, ...details } = currentStudent._doc;
            res.status(200).json({ details: details, type: claims.type });
          }
        });
    }
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: e });
  }
});

app.get("/classroom", function (req, res) {
  const pos = req.query.pos;
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    if (!claims) {
      res.status(404).json({ message: "Unauthorized" });
    }
    if (claims.type === 2) {
      var q = teacher
        .findOne({ _id: claims._id })
        .populate("classesEnrolled")
        .exec(function (err, currentStudent) {
          if (err) {
            res.send(err);
          } else {
            const currentID = currentStudent.classesEnrolled[pos]._id;
            const query = classroom
              .findOne({ _id: currentID })
              .populate("announcements")
              .populate("classesEnrolled")
              .populate("announcements")
              .populate({
                path: "announcements",
                populate: { path: "author" },
              })
              .populate("teachers")
              .populate("studentsEnrolled")
              .exec(function (err, currentClass) {
                if (err) {
                  console.log(err);
                } else {
                  res.status(200).json({
                    classData: currentClass,
                    type: 2,
                  });
                }
              });
          }
        });
    }
    if (claims.type === 1) {
      var q = student
        .findOne({ _id: claims._id })
        .populate("classesEnrolled")
        .exec(function (err, currentStudent) {
          if (err) {
            res.send(err);
          } else {
            const currentID = currentStudent.classesEnrolled[pos]._id;
            const query = classroom
              .findOne({ _id: currentID })
              .populate("announcements")
              .populate("classesEnrolled")
              .populate("announcements")
              .populate({
                path: "announcements",
                populate: { path: "author" },
              })
              .populate("teachers")
              .populate("studentsEnrolled")
              .exec(function (err, currentClass) {
                if (err) {
                  console.log(err);
                } else {
                  res.status(200).json({
                    classData: currentClass,
                    type: 1,
                  });
                }
              });
          }
        });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/stream", function (req, res) {
  const cookie = req.session.value;
  const claims = jwt.verify(cookie, key);
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

app.post("/people", function (req, res) {
  var q = classroom
    .findOne({ classCode: req.body.classCode })
    .populate("teachers")
    .populate("studentsEnrolled")
    .populate("teams")
    .exec(function (err, currentClassroom) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json(currentClassroom);
      }
    });
});

app.get("/teams", async function (req, res) {
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    if (!claims) {
      res.status(201).json({ msg: "unauthorized" });
    }
    if (claims.type === 1) {
      student
        .findOne({ _id: claims._id })
        .populate("classesEnrolled")
        .populate({
          path: "classesEnrolled",
          populate: { path: "teams" },
        })
        .populate({
          path: "classesEnrolled",
          populate: { path: "teams", populate: { path: "members" } },
        })
        .exec(function (err, currentStudent) {
          if (
            currentStudent.classesEnrolled[req.query.pos].teams.length !== 0
          ) {
            var found = false;
            let fteam;
            currentStudent.classesEnrolled[req.query.pos].teams.map(
              (currentTeam, index) => {
                if (currentTeam.members) {
                  currentTeam.members.map((currentMemberId) => {
                    if (
                      currentMemberId._id.toString() === claims._id.toString()
                    ) {
                      found = true;
                      fteam = currentTeam;
                    }
                  });
                }
              }
            );
            if (found) {
              res.status(200).json({ teamData: fteam, type: claims.type });
            } else {
              res.status(200).json({ type: claims.type });
            }
          } else {
            res.status(200).json({ teamData: null, type: claims.type });
          }
        });
    }
    if (claims.type === 2) {
      teacher
        .findOne({ _id: claims._id })
        .populate("classesEnrolled")
        .populate({
          path: "classesEnrolled",
          populate: { path: "teams" },
        })
        .populate({
          path: "classesEnrolled",
          populate: { path: "teams", populate: { path: "members" } },
        })
        .exec(function (err, currentTeacher) {
          if (currentTeacher.classesEnrolled[req.query.pos].teams) {
            res.status(200).json({
              teamData: currentTeacher.classesEnrolled[req.query.pos].teams,
              type: claims.type,
            });
          } else {
            res.status(200).json({ msg: "no teams in the class" });
          }
        });
    }
  } catch (e) {
    console.log(e);
  }
});

function maketeamCode(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
app.post("/classroom/createteam", (req, res) => {
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    if (!claims) {
      res.status(201).json({ msg: "unauthorized" });
    }
    student
      .findOne({ _id: claims._id })
      .populate("classesEnrolled")
      .exec(async (err, currentStudent) => {
        const data = new team({
          teamName: req.body.name,
          teamCode: maketeamCode(6),
          members: claims._id,
          teamChat: [],
          teacherChat: [],
          projectLink: "",
        });

        currentStudent.classesEnrolled[req.body.pos].teams.push(data);
        await currentStudent.classesEnrolled[req.body.pos].save();

        await data.save();
        res.status(200).json({ msg: "ok" });
      });
  } catch (e) {
    console.log(e);
  }
});

app.post("/classroom/jointeam", (req, res) => {
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    if (!claims) {
      res.status(200).json({ result: "unauthorized" });
    }
    student
      .findOne({ _id: claims._id })
      .populate("classesEnrolled")
      .populate({
        path: "classesEnrolled",
        populate: { path: "teams" },
      })

      .exec((err, currentStudent) => {
        const currentClass = currentStudent.classesEnrolled[req.body.pos];
        if (currentClass.teams) {
          var found = false;

          currentClass.teams.map((currentTeam, index) => {
            if (currentTeam.members) {
              currentTeam.members.map((currentMember, index) => {
                if (currentMember._id.toString() === claims._id.toString()) {
                  found = true;
                }
              });
            }
          });
          if (found) {
            res.status(200).json({ result: "already a member" });
          } else {
            team.findOne(
              { teamCode: req.body.teamCode },
              (err, currentTeam) => {
                if (err) {
                  console.log(err);
                } else {
                  if (currentTeam) {
                    currentTeam.members.push(claims._id);
                    currentTeam.save();
                    res
                      .status(200)
                      .json({ result: "successfully joined team" });
                  } else {
                    res.status(200).json({ result: "no such team exists" });
                  }
                }
              }
            );
          }
        }
      });
  } catch (e) {
    console.log(e);
  }
});

app.post("/createChat", (req, res) => {
  try {
    const event = new Date();
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    student
      .findOne({ _id: claims._id })
      .populate("classesEnrolled")
      .populate({
        path: "classesEnrolled",
        populate: { path: "teams" },
      })
      .exec(async function (err, foundStudent) {
        if (err) {
          console.log(err);
        } else {
          const foundClass = foundStudent.classesEnrolled[req.body.pos];
          foundClass.teams.map(async (currentTeam, index) => {
            if (currentTeam._id.toString() === req.body.id.toString()) {
              const data = {
                author: {
                  name: foundStudent.firstName,
                  id: claims._id,
                },
                text: req.body.message,
                time: event.toLocaleTimeString("en-US"),
              };
              currentTeam.teamChat.push(data);
              await currentTeam.save(function (err) {
                if (!err) {
                  res.status(200).json({ class: currentTeam });
                }
              });
            }
          });
        }
      });
  } catch (err) {
    console.log(err);
  }
});

app.post("/teacherchat", (req, res) => {
  try {
    const event = new Date();
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    if (claims.type === 1) {
      student
        .findOne({ _id: claims._id })
        .populate("classesEnrolled")
        .populate({
          path: "classesEnrolled",
          populate: { path: "teams" },
        })
        .exec(async function (err, foundStudent) {
          if (err) {
            console.log(err);
          } else {
            const foundClass = foundStudent.classesEnrolled[req.body.pos];
            foundClass.teams.map(async (currentTeam, index) => {
              if (currentTeam._id.toString() === req.body.id.toString()) {
                const data = {
                  author: {
                    name: foundStudent.firstName,
                    id: claims._id,
                  },
                  text: req.body.message,
                  time: event.toLocaleTimeString("en-US"),
                };
                currentTeam.teacherChat.push(data);
                await currentTeam.save(function (err, result) {
                  if (!err) {
                    res.status(200).json({ class: currentTeam });
                  }
                });
              }
            });
          }
        });
    }
    if (claims.type === 2) {
      teacher
        .findOne({ _id: claims._id })
        .populate("classesEnrolled")
        .populate({
          path: "classesEnrolled",
          populate: { path: "teams" },
        })
        .exec(async function (err, foundTeacher) {
          if (err) {
            console.log(err);
          } else {
            const foundClass = foundTeacher.classesEnrolled[req.body.pos];
            foundClass.teams.map(async (currentTeam, index) => {
              if (currentTeam._id.toString() === req.body.id.toString()) {
                const data = {
                  author: {
                    name: foundTeacher.firstName,
                    id: claims._id,
                  },
                  text: req.body.message,
                  time: event.toLocaleTimeString("en-US"),
                };
                currentTeam.teacherChat.push(data);
                await currentTeam.save(function (err) {
                  if (!err) {
                    res.status(200).json({ class: currentTeam });
                  }
                });
              }
            });
          }
        });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/teamselected", (req, res) => {
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    if (!claims) {
      res.status(201).json({ msg: "unauthorized" });
    }
    if (claims.type === 2) {
      teacher
        .findOne({ _id: claims._id })
        .populate("classesEnrolled")
        .populate({
          path: "classesEnrolled",
          populate: { path: "teams" },
        })
        .populate({
          path: "classesEnrolled",
          populate: { path: "teams", populate: { path: "members" } },
        })
        .exec(function (err, foundTeacher) {
          const currentClass = foundTeacher.classesEnrolled[req.query.pos];

          const currentTeam = currentClass.teams[req.query.teampos];

          res.status(200).json({ teamDetails: currentTeam });
        });
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/unenroll", (req, res) => {
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    if (claims.type === 1) {
      student
        .findOne({ _id: claims._id })
        .populate("classesEnrolled")
        .exec(async (err, foundStudent) => {
          if (err) {
            console.log(err);
          } else {
            classroom.findOne(
              { _id: foundStudent.classesEnrolled[req.query.pos] },
              (err, foundClass) => {
                let position;
                foundClass.studentsEnrolled.map((id, index) => {
                  if (id.toString() === claims._id.toString()) {
                    position = index;
                  }
                });
                foundClass.studentsEnrolled.splice(position, position + 1);
                foundClass.save();
              }
            );
            foundStudent.classesEnrolled.splice(
              req.query.pos,
              req.query.pos + 1
            );
            await foundStudent.save();
          }
        });
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/delete", (req, res) => {
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    if (claims.type === 2) {
      teacher
        .findOne({ _id: claims._id })
        .populate("classesEnrolled")
        .exec(async (err, foundTeacher) => {
          if (err) {
            console.log(err);
          } else {
            classroom.findOne(
              { _id: foundTeacher.classesEnrolled[req.query.pos] },
              async (err, foundClass) => {
                await foundClass.studentsEnrolled.map(async (id, index) => {
                  await student.findOne({ _id: id }, (err, foundStudent) => {
                    foundStudent.classesEnrolled.map(
                      async (currentClass, index) => {
                        if (
                          currentClass.toString() === foundClass._id.toString()
                        ) {
                          foundStudent.classesEnrolled.splice(index, index + 1);
                          await foundStudent.save();
                        }
                      }
                    );
                  });
                });
                foundClass.teams.map(async (currentTeam, index) => {
                  await team.deleteOne({ _id: currentTeam }, (err) => {
                    if (err) {
                      console.log(err);
                    }
                  });
                });
                await classroom.deleteOne({ _id: foundClass._id }, (err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("succesfully Classroom deleted");
                  }
                });
              }
            );
            foundTeacher.classesEnrolled.splice(
              req.query.pos,
              req.query.pos + 1
            );
            await foundTeacher.save();
            res.status(200).json({ msg: "deleted" });
          }
        });
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/leaveteam", (req, res) => {
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    if (claims.type === 1) {
      student
        .findOne({ _id: claims._id })
        .populate("classesEnrolled")
        .exec(async (err, foundStudent) => {
          if (err) {
            console.log(err);
          } else {
            classroom
              .findOne({ _id: foundStudent.classesEnrolled[req.query.pos] })
              .populate("teams")
              .exec(async (err, foundClass) => {
                let position;
                foundClass.teams.map(async (currentTeam, index) => {
                  currentTeam.members.map((id, index) => {
                    if (id.toString() === claims._id.toString()) {
                      position = index;
                    }
                  });
                  currentTeam.members.splice(position, position + 1);
                  if (currentTeam.members.length === 0) {
                    await currentTeam.delete();
                    res.status(200).json({ msg: "left team" });
                  } else {
                    await currentTeam.save();
                    res.status(200).json({ msg: "left team" });
                  }
                });
              });
          }
        });
    }
  } catch (e) {
    console.log(e);
  }
});

app.post("/submitproject", (req, res) => {
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    if (claims.type === 1) {
      student
        .findOne({ _id: claims._id })
        .populate("classesEnrolled")
        .exec(async (err, foundStudent) => {
          if (err) {
            console.log(err);
          } else {
            classroom
              .findOne({ _id: foundStudent.classesEnrolled[req.body.pos] })
              .populate("teams")
              .exec(async (err, foundClass) => {
                foundClass.teams.map(async (currentTeam, index) => {
                  currentTeam.members.map(async (id, index) => {
                    if (id.toString() === claims._id.toString()) {
                      currentTeam.projectLink = req.body.projectLink;
                      await currentTeam.save();
                      return res.status(200).json({ msg: "submitted" });
                    }
                  });
                });
              });
          }
        });
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/deleteannouncement", (req, res) => {
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    if (claims.type === 2) {
      teacher
        .findOne({ _id: claims._id })
        .populate("classesEnrolled")
        .exec(async (err, foundTeacher) => {
          if (err) {
            console.log(err);
          } else {
            classroom
              .findOne({ _id: foundTeacher.classesEnrolled[req.query.pos] })
              .populate("teams")
              .exec(async (err, foundClass) => {
                const length = foundClass.announcements.length;
                if (length - req.query.announcementPos - 1 === 0) {
                  foundClass.announcements.splice(
                    length - req.query.announcementPos - 1,
                    length - req.query.announcementPos
                  );
                } else {
                  foundClass.announcements.splice(
                    length - req.query.announcementPos - 1,
                    length - req.query.announcementPos - 1
                  );
                }
                await foundClass.save();
                res.status(200).json({ msg: "deleted" });
              });
          }
        });
    }
  } catch (e) {
    console.log(e);
  }
});

// delete the profile
app.post("/deleteprofile", (req, res) => {
  try {
    const cookie = req.session.value;
    const claims = jwt.verify(cookie, key);
    if (claims.type === 2) {
      teacher.findById(claims._id, function (err, currentTeacher) {
        if (err) {
          console.log(err);
        } else {
          currentTeacher.classesEnrolled.map((classID, index) => {
            classroom.findById(classID, function (err, currentClassroom) {
              if (err) {
                console.log(err);
              } else {
                student.updateMany(
                  { _id: { $in: currentClassroom.studentsEnrolled } },
                  { $pull: { classesEnrolled: currentClassroom._id } },
                  function (err) {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
                currentClassroom.remove();
              }
            });
          });
        }
        currentTeacher.remove();
      });
      res.status(200).json({ msg: "teacher deleted" });
    } else if (claims.type === 1) {
      student
        .findOne({ _id: claims._id })
        .populate("classesEnrolled")
        .populate({
          path: "classesEnrolled",
          populate: { path: "teams" },
        })
        .exec(function (err, currentStudent) {
          if (err) {
            console.log(err);
          } else {
            currentStudent.classesEnrolled.map((currentClass, index) => {
              currentClass.teams.map((currentTeam, index) => {
                currentTeam.members.map(async (currentMember, index) => {
                  if (currentMember.toString() === claims._id) {
                    await currentTeam.members.splice(index, index + 1);
                    await currentTeam.save();
                  }
                });
              });
            });
            classroom.updateMany(
              { _id: { $in: currentStudent.classesEnrolled } },
              { $pull: { studentsEnrolled: currentStudent._id } },
              function (err) {
                if (err) {
                  console.log(err);
                }
              }
            );
            currentStudent.remove();
          }
        });
      res.status(200).json({ msg: "student deleted" });
    }
  } catch (e) {
    console.log(e);
  }
});

// Listening to the port PORT.
app.listen(PORT, function () {
  console.log("Server is listening to port ", PORT);
});
