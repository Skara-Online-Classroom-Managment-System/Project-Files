// Requiring the mongoose model
const mongoose = require('mongoose');

// Defining the schema of the teams.
const teamSchema = new mongoose.Schema({
  teamName: String,
  classAssociated: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'classroom'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectID,
    ref: 'student'
  }],
  teamChat: [{
    author: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'student'
    },
    text: String,
    time: Date
  }],
  teacherChat: [{
    author: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'student'
    }
  }]
});
const team = mongoose.model('team', teamSchema);

// exporting the team model
module.exports = team;