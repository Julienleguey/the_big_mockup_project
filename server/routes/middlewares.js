const express = require('express');
const router = express.Router();
const User = require("../models").User;
const Project = require("../models").Project;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// adding bcrypt to hash the passwords
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

// adding basic-auth to authenticate the user
const auth = require('basic-auth');


/*************************
Middlewares
**************************/

// Defining an empty authenticateUser() middleware function in our routes module:
function authenticateUser(req, res, next) {

  User.findOne({ where: {email: auth(req).name}}).then((user) => {
    // If the user is found:
    if (user) {
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
    const projectOwner = project.userId;

    if (authenticatedUser === projectOwner) {
      console.log("It's the correct user!");
      next();
    } else {
      // project doesn't belong to the user
      res.status(403).send("The project you're trying to access doesn't belong to you! Try to login with a different email address.");
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
    projectOwner: projectOwner
}
