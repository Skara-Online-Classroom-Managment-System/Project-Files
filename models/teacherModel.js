// requiring the mongoose module
const mongoose = require("mongoose");

// Defining the schema of teacher.
const teacherSchema = new mongoose.Schema({
  firstName: String,
  username: String,
  pw: String,
  classesEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "classroom",
    },
  ],
  invitesPending: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "classroom",
    },
  ],
});
const teacher = mongoose.model("teacher", teacherSchema);

// exporting the teacher model
module.exports = teacher;
