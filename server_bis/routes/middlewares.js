const express = require('express');
const router = express.Router();
const User = require("../server/models").User;
const Project = require("../server/models").Project;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


// adding bcrypt to hash the passwords
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

// adding basic-auth to authenticate the user
const auth = require('basic-auth');


let jwt = require('jsonwebtoken');
const config = require('../config/config.js');

/*************************
Middlewares
**************************/

function checkToken(req, res, next) {
  console.log("INSIDE CHECK TOKEN");
  console.log(req.headers);
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  console.log(token);
  if (token.startsWith('obladi ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  console.log(token);

  if (token) {
    console.log("INSIDE OF TOKEN");
    // jwt.verify(token, config.secret, (err, decoded) => {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        console.log("TOKEN NOT VALID!!!!!!!")
        // return res.json({
        //   success: false,
        //   message: 'Token is not valid'
        // });
        next(err);
      } else {
        console.log("TOKEN VALID! WOUHOUUUUUUUUUUUUUUUUUUUUUUUUU!");
        // req.decoded = decoded;
        // req.currentUser = decoded.username;
        User.findOne({ where: {email: decoded.username}}).then( user => {
          console.log("USER FOUND HERE");
          req.currentUser = user;
          next();
        });
        // next();
        // console.log(decoded);
        // next();
      }
    });
  } else {
    console.log("YA PAS DE TOKEN");
    next(err);
    // return res.json({
    //   success: false,
    //   message: 'Auth token is not supplied'
    // });
  }
  console.log("STILL THINGS HERE");
};

// function verified (req, res) {
//   res.json({
//     success: true,
//     message: 'Index page'
//   });
// }

// Defining an empty authenticateUser() middleware function in our routes module:
function authenticateUser(req, res, next) {
  User.findOne({ where: {email: auth(req).name}}).then((user) => {
    // If the user is found:
    if (user) {
      console.log("USER FOUND");
      const authenticated = bcrypt.compareSync(auth(req).pass, user.password);

      // If the passwords match:
      if (authenticated) {
        console.log(`Authentication successful for username: ${user.email}`);
        req.currentUser = user;
        next();
      // If the passwords doesn't match:
      } else {
        err = new Error("Authentication failure!");
        err.status = 401;
        next(err);
      }
    // If the user is not found:
    } else {
      console.log("user not found");
      err = new Error("User Not Found!");
      err.status = 401;
      next(err);
    }
  });
};


// Check if the user profile for the provided :id route parameter value is owned by the currently authenticated user
function profileOwner(req, res, next) {
  const id = req.params.id;

  User.findOne({where: {id: id}}).then((user) => {
    const authenticatedUser = req.currentUser.email;
    const profileOwner = user.email;

    if (authenticatedUser === profileOwner) {
      console.log("It's the correct user!");
      next();
    } else {
      err = new Error('The authenticated user is not allowed to modify this user profile!');
      err.status = 403;
      next(err);
    }

  });
};

function projectOwner(req, res, next) {
  const id = req.params.id;
  // const id = 30;

  Project.findOne({where: {id: id}}).then((project) => {
    const authenticatedUser = req.currentUser.id;
    const projectOwner = project.UserId;

    if (authenticatedUser === projectOwner) {
      console.log("It's the correct user!");
      next();
    } else {
      // project doesn't belong to the user
      // res.status(403).send("The project you're trying to access doesn't belong to you! Try to login with a different email address.");
      res.status(403).send("The project you're trying to access doesn't belong to you!");
    }
  }).catch( err => {
    // project doesn't exist
    // same error message to stop users to try and find the number of project in the db
    res.status(403).send("The project you're trying to access doesn't belong to you! Try to login with a different email address.");
  });
}

module.exports = {
    authenticateUser: authenticateUser,
    profileOwner: profileOwner,
    projectOwner: projectOwner,
    checkToken: checkToken
}
