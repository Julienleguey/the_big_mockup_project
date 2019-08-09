const express = require('express');
const router = express.Router();
const authenticateUser = require("./middlewares").authenticateUser;
const User = require("../models").User;
const Project = require("../models").Project;
const Canva = require("../models").Canva;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


/*************
Project routes
*************/


// get all the projects
// FOR DEVELOPMENT PURPOSES ONLY
router.get('/all', function(req, res, next) {
  Project.findAll({}).then( projects => {
    res.json(projects);
  });
});


// // get all the projects of the anthenticated user
// // works with authenticateUser middleware and user emailAddress
// router.get('/list', authenticateUser, function(req, res, next) {
//   User.findOne({
//     where: { email: req.currentUser.email },
//     include: [
//       {
//         model: Project
//       }
//     ]
//   }).then((users) => {
//     res.json(users.Projects);
//   });
// });


// get all the projects of the anthenticated user
// works without authentication and user id
// (but the user has to be authenticated for the page calling it to be displayed in the client)
router.get('/list/:id', function(req, res, next) {
  User.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: Project
      }
    ]
  }).then((users) => {
    res.json(users.Projects);
  });
});


router.get('/project/:id', authenticateUser, function(req, res, next) {
  console.log(req.currentUser.id);
  Project.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: Canva
      }
    ]
  }).then((project) => {
    res.json(project);
  });
});


// create a new project
router.post('/new', authenticateUser, function(req, res, next) {

  const project = {
    userId: req.currentUser.id,
    name: req.body.name,
    os: req.body.os
  }

  Project.create(project).then( project => {
    res.json(project);
  }).catch(function(err){
      throw err;
  }).catch(function(err){
    res.sendStatus(500);
  });

});




module.exports = router;
