const express = require('express');
const router = express.Router();
const authenticateUser = require("./middlewares").authenticateUser;
const checkToken = require("./middlewares").checkToken;
const profileOwner = require("./middlewares").profileOwner;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const User = require("../server/models").User;
const Project = require("../server/models").Project;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const resetPassword = require("./helpers/mailer").resetPassword;

// adding bcrypt to hash the passwords
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

// adding basic-auth to authenticate the user
const auth = require('basic-auth');

// for jwt
let jwt = require('jsonwebtoken');
let config = require('../config/config');
let middleware = require('./middlewares');

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
router.get(`/signwithtoken`, checkToken, (req, res) => {
  User.findOne({ where: { id: req.currentUser.id } }).then( (user) => {
    res.json({
      user: user,
      success: true,
      message: 'Authentication successful!'
    });
  });
})


router.get('/login', authenticateUser, function(req, res, next) {
  const username = auth(req).name;
  const password = auth(req).pass;

  if (username && password) {
      const token = jwt.sign({username: username},
        config.secret,
        { expiresIn: '24h' // expires in 24 hours
        }
      );
      // return the JWT token for the future API calls
      User.findOne({ where: { email: req.currentUser.email } }).then( (user) => {
        res.json({
          user: user,
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      });
    } else {
      console.log("ERROR FORBIDDEN");
      res.send(403).json({
        success: false,
        message: 'Incorrect username or password'
      });
    }
});


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

        res.redirect("/"); // euh, mais c'est quoi ça ?
      }
    })
  }
});


// user takes the status "testing"
router.post("/testing/:id", checkToken, profileOwner, function(req, res) {
  User.findOne({ where: { id: req.params.id }, include: [
    {
      model: Project
    }
  ]}).then( user => {
    if (user) {
      const projects = user.Projects;
      user.update({status: "testing"});
      projects.forEach(project => {
        const req = {
          query: {},
          params: {}
        };
        req.query.userId = project.UserId;
        req.params.id = project.id;
        const res = "";
        Project.destroy({
          where: {id: project.id}
        }).then( () => {
          destroyAllFiles(req, res);
        }).then( () => {
          destroyProjectFolder(req, res);
        });
      });
    }
  }).then( () => {
    res.send(200);
  }).catch( () => {
    res.sendStatus(403);
  })
})


// update one user infos
router.put("/update_profile/:id", checkToken, profileOwner, function(req, res, next){
  User.findOne({ where: { id: req.params.id } }).then(function(user) {
    console.log(req.body);
    if (user) {
      console.log("user fouuuuund!");
      return user.update(req.body);
    } else {
      console.log("user not fouuuuund T.T");
      res.sentStatus(404);
    }
  }).then( user => {
    res.json(user);
  }).catch(function(err){
    console.log("woups 1");
    res.sendStatus(500);
  });
});


// update the password of the user
router.put("/update_password/:id", authenticateUser, profileOwner, function(req, res) {
  console.log("INSIDE UPDATE PASSWORD");

  // Hashing the new password
  const myPlaintextPassword = req.body.newPassword;
  const hashedPassword = bcrypt.hashSync(myPlaintextPassword, salt);

  User.findOne({ where: { id: req.params.id } }).then(function(user) {
    console.log(req.body);
    if (user) {
      console.log("user fouuuuund!");
      return user.update({password: hashedPassword});
    } else {
      console.log("user not fouuuuund T.T");
      res.sentStatus(404);
    }
  }).then( user => {
    console.log("password updated, sending a response");
    res.json(user);
  }).catch(function(err){
    console.log("woups 1");
    res.sendStatus(500);
  });
})

// reset the password of the user (because the user forgot it)
router.put("/reset_password", (req, res) => {
  console.log(req.body);

  const myPlaintextPassword = req.body.newPassword;
  const hashedPassword = bcrypt.hashSync(myPlaintextPassword, salt);

  User.findOne({ where: { resetPasswordToken: req.body.resetPasswordToken } }).then( user => {
    if (user) {
      if (new Date(user.resetPasswordExpires) < new Date()) {
        console.log("c'est bon, c'est pas trop vieux");
        user.update({password: hashedPassword});
        res.json(user);
      } else {
        console.log("token trop vieux");
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(404);
    }
  }).catch( () => {
    res.sendStatus(500);
  })
})

// create and send a reset token
router.post("/forgot_password", function(req, res) {
  console.log("INSIDE FORGOT PASSWORD");
  console.log(req.body);

  User.findOne({ where: { email: req.body.email } }).then( user => {
    if (user) {
      const token = crypto.randomBytes(20).toString('hex');
      return user.update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 36000
      });
    } else {
      throw err;
    }
  }).then( user => {
    console.log("user: ", user);
    resetPassword(user.email, user.resetPasswordToken);
    res.sendStatus(200);
  }).catch( () => {
    res.sendStatus(500);
  })

})


// check the reset token
router.get("/check_reset_token/:resetPasswordToken", (req, res) => {
  console.log(req.params.resetPasswordToken);
  User.findOne({ where: { resetPasswordToken: req.params.resetPasswordToken } }).then( user => {
    if (user) {
      if (new Date(user.resetPasswordExpires) < new Date()) {
        console.log("c'est bon, c'est pas trop vieux");
        res.json({email: user.email});
      } else {
        console.log("token trop vieux");
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(404);
    }
  }).catch( () => {
    res.sendStatus(500);
  })
})


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
    res.sendStatus(500);
  });
});

// 200 - Check that the user is active
router.get("/check_user_active", checkToken, function(req, res) {
  console.log(req.currentUser.status);
  if (req.currentUser.status === "active") {
    res.json({permission: true});
  } else {
    res.json({permission: false});
  }
});

module.exports = router;
