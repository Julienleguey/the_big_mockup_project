const express = require('express');
const router = express.Router();
const User = require("../server/models").User;
const Project = require("../server/models").Project;
const Canva = require("../server/models").Canva;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// auth middlewares
const authenticateUser = require("./middlewares").authenticateUser;
const projectOwner = require("./middlewares").projectOwner;

// file helpers
const createProjectFolder = require("./helpers/fileHelper").createProjectFolder;
const createTempFolder = require("./helpers/fileHelper").createTempFolder;
const destroyTempFolder = require("./helpers/fileHelper").destroyTempFolder;
const destroyOneFile = require("./helpers/fileHelper").destroyOneFile;
const destroyAllFiles = require("./helpers/fileHelper").destroyAllFiles;
const destroyProjectFolder = require("./helpers/fileHelper").destroyProjectFolder;
const moveFilesFromTempToProjectFolder = require("./helpers/fileHelper").moveFilesFromTempToProjectFolder;

// project helpers
const updateProject = require("./helpers/projectHelper").updateProject;
const updateName = require("./helpers/projectHelper").updateName;
const getProjectObject = require("./helpers/projectHelper").getProjectObject;

// canva helpers
const createEmptyCanva = require("./helpers/canvaHelper").createEmptyCanva;
const duplicateCanvas = require("./helpers/canvaHelper").duplicateCanvas;

/*********************
multer middlewares
**********************/
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `./screenshots/temp_${req.currentUser.id}`);
  },
  filename: function(req, file, cb) {
    cb(null, `${file.originalname}`)
  }
});

const fileFilter = (req, file, cb) => {
  // reject files that are not jpeg or png
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


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

// get all the projects of the anthenticated user
// works without authentication and user id
// (but the user has to be authenticated for the page calling it to be displayed in the client)
// (ça devrait pas être dans les routes du user, ça ?)
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


// get one project and its canvas
router.get('/project/:id', authenticateUser, function(req, res, next) {
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
    UserId: req.currentUser.id,
    name: req.body.name,
    os: req.body.os,
    device: req.body.device
  }

  Project.create(project).then( newProject => {
    createProjectFolder(newProject.UserId, newProject.id);
    createEmptyCanva(req, res, newProject.id);
  }).catch(function(err){
    res.status(500).send("error while creating a project");
  });
});


// saving the project, the canvas and the screenshots
router.post('/save', authenticateUser, createTempFolder, upload.array('screenshots'), function(req, res, next){
  const metas = JSON.parse(req.body.metas);
  const projectDatas = JSON.parse(req.body.project);
  const canvas = JSON.parse(req.body.canvas);

  moveFilesFromTempToProjectFolder(req, res, metas);
  updateProject(req, res, metas, projectDatas, canvas);
});


// update project name
router.put('/rename/:id', authenticateUser, projectOwner, function(req, res, next) {
  updateName(req, res);
});

// 201 duplicate a project
router.post('/duplicate/:id', authenticateUser, projectOwner, function(req, res) {
  const id = req.params.id;

  Project.findOne({where: {id: id}, include: [
    {
      model: Canva
    }
  ]}).then( (project) => {
    if (project) {
      const newProject = getProjectObject(project);

      Project.create(newProject).then( createdProject => {
        createProjectFolder(createdProject.UserId, createdProject.id);
        duplicateCanvas(project, createdProject);
      }).catch(function(err){
        res.status(500).send("Error while duplicating the project!");
      });
      res.status(200).send("The project was successfully duplicated!");
    } else {
      res.status(404).send("Something went wrong! We couldn't find your project! Please refresh the page and try again!");
    }
  }).catch( () => {
    res.status(500).send("Something went wrong! Please refresh the page and try again!");
  })
});


//204 - Delete a project
router.delete('/delete/:id', authenticateUser, projectOwner, function(req, res, next){
  const id = req.params.id;

  Project.destroy({
    where: {id: id}
  }).then( () => {
    destroyAllFiles(req, res);
  }).then( () => {
    destroyProjectFolder(req, res);
  }).then( () => {
    res.status(204).send();
  }).catch( () => {
    res.sendStatus(500);
  })
});

module.exports = router;
