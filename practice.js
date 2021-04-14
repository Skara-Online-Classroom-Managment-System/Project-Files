const mongoose = require("mongoose");

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

const classroom = require("./models/classroomModel.js");
const student = require("./models/studentModel.js");
const teacher = require("./models/teacherModel.js");
const team = require("./models/teamModel.js");

// const dummyClass = new classroom({
//   className: "Science",
//   classCode: "98764321",
//   teachers: [],
//   announcements: [],
//   studentsEnrolled: [],
//   teams: [],
// });

classroom.findOne({ classCode: "987654321" }, function (err, currentClass) {
  if (err) {
    console.log(err);
  } else {
    console.log(currentClass);
  }
});
