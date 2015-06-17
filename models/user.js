var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    email: {
      type: String,
      lowercase: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
  });

userSchema.pre('save', function(next) {

  // the keyword this refers to the INSTANCE!
  // {
  //   email: "eschoppik@gmail.com",
  //   _id: ObjectId("382192389021839021")
  // }

  var user = this;
  // if the password has not been changed, save the user and move on...
  if (!user.isModified('password')) {
    return next();
  }


  // db.User.create(req.body.user, function(){

  // });

  // when i call next()...this is what happens
  // var user = new db.User(req.body.user)
  // user.save(function(err,user){

  // })
  return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    return bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      // define what the password is for the user
      user.password = hash;
      // everything looks good, let's save this!
      return next();
    });
  });
});

// THIS IS DEFINING SCHEMA
// function Person(name){
//   this.name = name
// }

// THIS IS A CLASS METHOD (statics)
// Person.sayHi = function(){
//   return "hi"
// }

// THIS IS AN INSTANCE METHOD (methods)
// Person.prototype.sayGoodbye = function(){
//   return "goodbye"
// }

// var elie = new Person("elie")
// Person.sayHi()
// elie.sayGoodbye()



// don't want to call this first param "user"! We have another user defined!
// statics === CLASS METHODS
userSchema.statics.authenticate = function (formData, callback) {
  // this refers to the model!
  this.findOne({
      email: formData.email
    },
    function (err, user) {
      if (user === null){
        callback("Invalid username or password",null);
      }
      else {
        user.checkPassword(formData.password, callback);
      }

    });
};

// in my app.js, when a user tries to log in
  // submitting the "login" form...this will happen:
// db.User.authenticate(req.body.user, function(err,user){

// })

// CREATE IS A CLASS METHOD!
// db.User.create({});

// SAVE IS AN INSTANCE METHOD
// var user = new db.User({email:"test@test.com"});
// user.save()

// methods === INSTANCE METHODS!
userSchema.methods.checkPassword = function(password, callback) {
  var user = this;
  bcrypt.compare(password, user.password, function (err, isMatch) {
    if (isMatch) {
      callback(null, user);
    } else {
      callback(err, null);
    }
  });
};

var User = mongoose.model("User", userSchema);

module.exports = User;