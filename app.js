var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
methodOverride = require('method-override'),
db = require("./models");

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
//turns on the session so that it is running
session = require("cookie-session"),
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

 loginMiddleware = require("./middleware/loginHelper");
    routeMiddleware = require("./middleware/routeHelper");
    

//sets up the session and uses the session
app.use(session({
  maxAge: 3600000,
  secret: 'illnevertell',
  name: "chocolate chip"
}));


app.use(loginMiddleware);
/********* post ROUTES *********/

// ROOT
app.get('/', routeMiddleware.ensureLoggedIn, function(req,res){
  res.render('users/index');
});

app.get('/signup', routeMiddleware.preventLoginSignup ,routeMiddleware.ensureLoggedIn,function(req,res){
  res.render('users/signup');
});

app.post("/signup", function (req, res) {
  var newUser = req.body.user;
  db.User.create(newUser, function (err, user) {
    if (user) {
      req.login(user);
      res.redirect("/posts");
    } else {
      console.log(err);
      // TODO - handle errors in ejs!
      res.render("users/signup");
    }
  });
});


app.get("/login", routeMiddleware.preventLoginSignup, function (req, res) {
  res.render("users/login");
});

app.post("/login", function (req, res) {
  db.User.authenticate(req.body.user,
  function (err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.redirect("/posts");
    } else {
      // TODO - handle errors in ejs!
      res.render("users/login");
    }
  });
});

app.get('/posts',routeMiddleware.ensureLoggedIn, function(req,res){
   db.Post.find({},
    function (err, posts) {
      res.render("posts/index", {posts:posts});
    });
});

app.get('/posts/new',routeMiddleware.ensureLoggedIn, function(req,res) {
	res.render("posts/new")
})

// CREATE
app.post('/posts',routeMiddleware.ensureLoggedIn, function(req,res){

  var newPost = req.body.post;
  newPost.ownerId = req.session.id;



  db.Post.create(newPost,routeMiddleware.ensureLoggedIn, function(err, post){
    if(err) {

      console.log(err);
      res.render("posts/new");
    }
    else {
      console.log(req.session.id)
      //console.log(post);
      res.redirect("/posts");
    }
  });
});

// SHOW
app.get('/posts/:id',routeMiddleware.ensureLoggedIn, function(req,res){
  db.Post.findById(req.params.id).populate("comments").exec(function(err,post){
    res.render("posts/show", {post:post});
  })
   
});

// EDIT
app.get('/posts/:id/edit',routeMiddleware.ensureLoggedIn, function(req,res){
  db.Post.findById(req.params.id).populate("comments").exec(function(err,post){
    res.render("posts/edit", {post:post});
  })
   
});
//update
app.put('/posts/:id',routeMiddleware.ensureCorrectUser,routeMiddleware.ensureLoggedIn, function(req,res){
 db.Post.findByIdAndUpdate(req.params.id, req.body.post,
     function (err, post) {
       if(err) {
         res.render("posts/edit");
       }
       else {
         res.redirect("/posts");
       }
     });
});

// DESTROY
app.delete('/posts/:id',routeMiddleware.ensureCorrectUser,routeMiddleware.ensureLoggedIn, function(req,res){
  db.Post.findById(req.params.id,
    function (err, post) {
      if(err) {
        console.log(err);
        res.render("posts/show");
      }
      else {
        post.remove();
        res.redirect("/posts");
      }
    });
});

// /********* comments ROUTES *********/
// //for shallow routes we can restructure by 
// //removing the first (parent ID) sometimes

// // INDEX
// app.get('/zoos/:zoo_id/animals', function(req,res){
//   db.Zoo.findById(req.params.zoo_id).populate('animals').exec(function(err,zoo){
//     res.render("animals/index", {zoo:zoo});
//   });
// });

// NEW
app.get('/posts/:post_id/comments/new',routeMiddleware.ensureLoggedIn, function(req,res){
  db.Post.findById(req.params.post_id,
    function (err, post) {
      res.render("comments/new", {post:post});
    });
});

// CREATE
app.post('/posts/:post_id/comments', function(req,res){


//create a comment and add session id for ownerid
//before pushing it through the createcomment 
  var newComment = req.body.comment;
  newComment.ownerId = req.session.id;


  db.Comment.create(newComment, function(err, comment){
    console.log(comment)
    if(err) {
      console.log(err);
      res.render("comments/new");
    }
    else {
      db.Post.findById(req.params.post_id,function(err,post){
        post.comments.push(comment);
        comment.post = post._id;
        comment.save();
        post.save();
        res.redirect("/posts/"+ req.params.post_id);
      });
    }
  });
});

// SHOW
app.get('/posts/:post_id/comments/:id',routeMiddleware.ensureLoggedIn, function(req,res){
  //can you remove part of the route?
  //can remove the first part becuz of parent/child relat
  db.Comment.findById(req.params.id)
    .populate('post')
    .exec(function(err,comment){
      console.log(comment.post)
      res.render("comments/show", {comment:comment});
    });
});

// EDIT

app.get('/posts/:post_id/comments/:id/edit',routeMiddleware.ensureLoggedIn, function(req,res){
  db.Comment.findById(req.params.id)
    .populate('post')
    .exec(function(err,comment){
      res.render("comments/edit", {comment:comment});
    });
});

// UPDATE
app.put('/posts/:post_id/comments/:id', function(req,res){
 db.Comment.findByIdAndUpdate(req.params.id, req.body.comment,
     function (err, comment) {
       if(err) {  
         res.render("comments/edit");
       }
       else {
         res.redirect("/posts/" + req.params.post_id + "/");
       }
     });
});

// DESTROY
app.delete('/posts/:post_id/comments/:id',routeMiddleware.ensureCorrectUserCom,routeMiddleware.ensureLoggedIn, function(req,res){
 db.Comment.findByIdAndRemove(req.params.id, req.body.comments,
      function (err, comment) {
        if(err) {
          console.log(err);
          res.render("comments/edit");
        }
        else {
          res.redirect("/posts/" + req.params.post_id + "/");
        }
      });
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get('*', function(req,res){
  res.render('404');
});



app.listen(3000, function(){
  "Server is listening on port 3000";
});

