// requiring the mongoose library
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

// Defining the schema of classroom.
const classSchema = new mongoose.Schema({
  classCode: String,
  teachers: [{
    type: mongoose.Schema.Types.ObjectID,
    ref: 'teacher'
  }],
  subject: String,
  announcements: [{
    author: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'teacher'
    },
    text: String,
    time: Date
  }],
  studentsEnrolled: [{
    type: mongoose.Schema.Types.ObjectID,
    ref: 'student'
  }],
  teamsAssociated: [{
    type: mongoose.Schema.Types.ObjectID,
    ref: 'team'
  }]
});

classSchema.plugin(passportLocalMongoose);

const classroom = mongoose.model('classroom', classSchema);

// exporting the classroom model
module.exports = classroom;