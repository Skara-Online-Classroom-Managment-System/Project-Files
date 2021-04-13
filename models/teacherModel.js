// requiring the mongoose module
const mongoose = require('mongoose');
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose');

// Defining the schema of teacher.
const teacherSchema = new mongoose.Schema({
    fn:String,
    username: String,
    pw: String,
    classesEnrolled: [{
      type: mongoose.Schema.Types.ObjectID,
      ref: 'classroom'
    }],
    invitesPending: [{
      type: mongoose.Schema.Types.ObjectID,
      ref: 'classroom'
    }]
  });
  teacherSchema.plugin(passportLocalMongoose);
const teacher = mongoose.model('teacher', teacherSchema);

// exporting the teacher model
module.exports = teacher;