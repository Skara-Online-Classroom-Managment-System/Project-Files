// Requiring the mongoose module
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Defining the schema of students.
const studentSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  classesEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "classroom",
    },
  ],
  password: String,
});
studentSchema.methods = {
  checkPassword: function (inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password);
  },
};

const student = mongoose.model("student", studentSchema);
//exporting the student model
module.exports = student;
