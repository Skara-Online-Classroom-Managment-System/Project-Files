const student=require("./models/studentModel");
const bcrypt=require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports= function(passport){
    
// passport plug in of the students
passport.use(
new localStrategy((username, password, done) => {
  console.log("inside strategy");
  student.findOne({ username: username }, (err, user) => {
    console.log(user,"inside strategy");
    if (err) throw err;
    if (!user) return done(null, false);
    else{
    bcrypt.compare(password, user.password,(err,result)=>{
      if (err) throw err;
      if (result === true) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }
  });
})
);

passport.serializeUser(function (user, cb) {
cb(null, user.id);
});
passport.deserializeUser(function (id, cb) {
student.findOne({_id:id},(err,user)=>{
  cb(err,user);
})
});
}