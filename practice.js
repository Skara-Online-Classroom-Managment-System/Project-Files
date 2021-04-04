const express = require("express");
const app = express();
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/SkaraDB",{
  useNewUrlParser: true,
  useUnifiedTopology:true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Database connected');
});

// ........................................................

// Requiring the models
const classroom = require('./models/classroomModel.js');
const student = require('./models/studentModel.js');
const teacher = require('./models/teacherModel.js');
const team = require('./models/teamModel.js');

// ........................................................

const t1 = new teacher({
  teacherID: "RajeshB",
  password: "1234",
  classesIncharge: [],
});

const c1 = new classroom({
  classCode: "987654321",
  subject: "Science",
  teachers: []
});

t1.classesIncharge.push(c1);
c1.teachers.push(t1);

c1.save((err) => {
  console.log(err);
})
t1.save(function(err){
  console.log(err);
});
var query = student.updateOne({sid: 19103046}, {$push: {classesEnrolled: c1}},function(err){
  console.log(err);    
  });