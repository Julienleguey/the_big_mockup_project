const express = require('express');
const router = express.Router();
const authenticateUser = require("./middlewares").authenticateUser;
const projectOwner = require("./middlewares").projectOwner;
const User = require("../models").User;
const Project = require("../models").Project;
const Canva = require("../models").Canva;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const fs = require('fs');
const path = require('path');


/*************
Project routes
*************/


// get all the canvas
// FOR DEVELOPMENT PURPOSES ONLY
router.get('/all', function(req, res, next) {
  Canva.findAll({}).then( canvas => {
    res.json(canvas);
  });
});

// get all the canvas of the currently open project of the anthenticated user
// (but the user has to be authenticated for the page calling it to be displayed in the client)
router.get('/list/:id', authenticateUser, function(req, res, next) {
  Project.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: Canva
      }
    ]
  }).then((projects) => {
    res.json(projects.Canvas);
  });
});



// create a new canva
router.post('/new', authenticateUser, function(req, res) {

  const canva = {
    projectId: req.body.projectId,
    template: req.body.template
  };

  Canva.create(canva).then( newCanva => {
    res.status(201).send(newCanva);
  }).catch( err => {
    res.sendStatus(500);
  });

});



//204 - Delete a canva
router.delete('/delete/:id', authenticateUser, function(req, res, next){
  const id = req.params.id;

  Canva.destroy({
    where: {id: req.params.id}
  }).then( () => {
    // const directoryPath = `${__dirname}/../screenshots/${req.query.userId}/${req.query.projectId}/${req.query.screenshotUrl}`;
    const directoryPath = `${__dirname}/../screenshots/${req.query.screenshotUrl}`;
    const directory = path.normalize(directoryPath);

    if (req.query.screenshotUrl !== "") {
      console.log(req.query.screenshotUrl);
      fs.unlink(directory, (err) => {
        if (err) throw err;
      });
    }

  }).then( () => {
    res.status(204).send();
  }).catch( () => {
    res.sendStatus(500);
  })
});






module.exports = router;
