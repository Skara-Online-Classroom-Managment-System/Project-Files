// Requiring the mongoose model
const mongoose = require("mongoose");

// Defining the schema of the teams.
const teamSchema = new mongoose.Schema({
  teamName: String,
  teamCode: String,
  classAssociated: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "classroom",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "student",
    },
  ],
  teamChat: [
    {
      author: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "student",
      },
      text: String,
      time: String,
    },
  ],
  teacherChat: [
    {
      author: {
        type: mongoose.Schema.Types.ObjectID,
        refPath: "multiref",
      },

      text: String,
      time: String,
      multiref: {
        type: String,
        enum: ["teacher", "student"],
      },
    },
  ],
});
const team = mongoose.model("team", teamSchema);

// exporting the team model
module.exports = team;
