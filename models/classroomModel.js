// requiring the mongoose library
const mongoose = require("mongoose");
const passport = require("passport");

// Defining the schema of classroom.
const classSchema = new mongoose.Schema({
  className: String,
  classCode: String,
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "teacher",
    },
  ],
  announcements: [
    {
      author: {
        type: mongoose.Schema.Types.ObjectID,
      ref: "teacher",
      },
      text: String,
      time: Date,
    },
  ],
  studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "student",
    },
  ],
  teams: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "team",
    },
  ],
});
const classroom = mongoose.model("classroom", classSchema);

// exporting the classroom model
module.exports = classroom;
