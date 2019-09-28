const express = require('express');
const router = express.Router();
const authenticateUser = require("./middlewares").authenticateUser;
const profileOwner = require("./middlewares").profileOwner;
const fs = require('fs');
const path = require('path');
const User = require("../models").User;
const Project = require("../models").Project;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// adding bcrypt to hash the passwords
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

/***********************************************************
fonction to create a folder for the screenshots of the user
***********************************************************/
function createUserFolder(user) {
  const directoryPath = `${__dirname}/../screenshots/${user.id}`;
  const directory = path.normalize(directoryPath);

  fs.mkdir(directory, { recursive: true }, (err) => {
    if (err) throw err;
  });
}


/*************
User routes
*************/

// get one user and authenticate him
router.get('/', authenticateUser, function(req, res, next) {
  User.findOne({ where: { email: req.currentUser.email } }).then( (user) => {
    res.json(user);
  });
})

// // get all the users
// // FOR DEVELOPMENT PURPOSES ONLY
// router.get('/all', function(req, res, next) {
//   User.findAll({}).then((users) => {
//     res.json(users);
//   });
// })

// get all the users and their projects
// FOR DEVELOPMENT PURPOSES ONLY
router.get('/all', function(req, res, next) {
  User.findAll({
    include: [
      {
        model: Project
      }
    ]
  }).then((users) => {
    res.json(users);
  });
})


// create user
router.post('/new', function(req, res, next) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const user = req.body;

  // Hashing the password of the new user
  const myPlaintextPassword = user.password;
  const hash = bcrypt.hashSync(myPlaintextPassword, salt);
  user.password = hash;

  if (!regex.test(user.email)) {
    err = new Error();
    err.status = 403;
    err.message = 'This email address is not valid!';
    return next(err);
  } else {
    User.findOrCreate({ where: {email: user.email}, defaults: user
    }).spread( (user, created) => {
      if (!created) {
        err = new Error();
        err.status = 403;
        err.message = 'This email address is already used! Try to log in!';
        return next(err);
      } else {
        // create a folder
        createUserFolder(user);

        res.redirect("/");
      }
    })
  }
});


// update one user
router.put("/:id", authenticateUser, profileOwner, function(req, res, next){
  User.findOne({ where: { id: req.params.id } }).then(function(user) {
    if (user) {
      console.log("user fouuuuund!");
      return user.update(req.body);
    } else {
      console.log("user not fouuuuund T.T");
      res.status(404).render("books/error", {
        title: "Server Error",
        message: "Sorry! There was an unexpected error on the server."
      });
    }
  }).then(function(){
    res.redirect("/users");
  }).catch(function(err){
    console.log("woups 1");
    // if(err.name === "SequelizeValidationError"){
    //   const book = Book.build(req.body);
    //   book.id = req.params.id;
    //
    //   res.render("books/update-book", {
    //     book: book,
    //     title: "Update Book",
    //     errors: err.errors
    //   });
    // } else {
    //   throw err;
    // }
  }).catch(function(err){
    // res.send(500);
    console.log("woups 2");
  });
});

//204 - Deletes a user and returns no content
// WARNING: THIS IS FOR DEVELOPMENT PURPOSES! AUTH AND OWNERSHIP SHOULD BE REQUIRED FOR THAT SORT OF ACTION!!!
router.delete("/delete/:id", function(req, res, next){
  User.findOne({ where: { id: req.params.id } }).then(function(user) {
    if (user) {
      return user.destroy();
    } else {
      res.status(404).render("users/error", {
        title: "Server Error",
        message: "Sorry! There was an unexpected error on the server."
      });
    }
  }).then(function(){
    res.redirect("/");
  }).catch(function(err){
    res.send(500);
  });
});

module.exports = router;
