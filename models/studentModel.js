// Requiring the mongoose module
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

// Defining the schema of students.
const studentSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    classesEnrolled: [{
        type: mongoose.Schema.Types.ObjectID,
        ref: 'classroom'
    }],
    password: String
});

studentSchema.plugin(passportLocalMongoose);
const student = mongoose.model('student', studentSchema);

//exporting the student model
module.exports = student;
