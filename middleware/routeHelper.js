var db = require("../models");

var routeHelpers = {
  ensureLoggedIn: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      return next();
    }
    else {
     res.redirect('/login');
    }
  },

  ensureCorrectUser: function(req, res, next) {
    db.Post.findById(req.params.id, function(err,post){
      if (post.ownerId !== req.session.id) {
        res.redirect('/posts');
      }
      else {
       return next();
      }
    });
  },
  ensureCorrectUserCom: function(req, res, next) {
    db.Comment.findById(req.params.id, function(err,comment){
      if (comment.ownerId !== req.session.id) {
        res.redirect('/posts');
      }
      else {
       return next();
      }
    });
  },

  preventLoginSignup: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      res.redirect('/posts');
    }
    else {
     return next();
    }
  }
};
module.exports = routeHelpers;