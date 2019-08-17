const express = require('express');
const router = express.Router();
const authenticateUser = require("./middlewares").authenticateUser;
const projectOwner = require("./middlewares").projectOwner;
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


// update a project
router.put('/project/:id', authenticateUser, projectOwner, function(req, res, next) {
  const id = req.params.id;
  // const id = 30;

  let projectRes = false;
  let canvasRes = [];

  Project.findOne({ where: { id: id } }).then( (project) => {
    if (project) {
      project.update(req.body.project);
    } else {
      // project not found
      res.status(404).send("Something went wrong! We couldn't find your project! Please, try again!");
    }
  }).then( () => {
    projectRes = true;
  }).then( () => {
    const canvasArr = [];

    for (let [key, value] of Object.entries(req.body.canvas)) {
      canvasArr.push(value);
    }

    // mettre un if (canvaFull) ici pour pas lancer l'itération s'il n'y a pas de canvas ?
    canvasArr.forEach((canvaFull, index) => {
      Canva.findOne({ where: {id: canvaFull.metadatas.canvasId} }).then ( (canva) => {
        if (canva) {
          canva.update(canvaFull.datas);
        } else {
          // project not found
          res.status(404).send(`It seems the mockup ${canvaFull.metadatas.index + 1} doesn't exist.`);
        }
      }).then( () => {
        // res.status(200).send("canva updaté");
        canvasRes.push({[`${canvaFull.metadatas.index}`]: true});
        if (index === canvasArr.length - 1) {
          // res.status(200).send({projectRes, canvasRes});
          res.status(200).send("Your changes have been saved!");
        }
      }).catch( err => {
        res.status(500).send("Something went wrong while updating the project. Please try again!");
      })
    })

  }).then( () => {
    res.status(200).send("Your changes have been saved!");
  }).catch(function(err){
    res.status(500).send("Something went wrong while updating the project. Please try again!");
  });
});



module.exports = router;
