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
router.post('/new/:id', authenticateUser, function(req, res, next) {

  const canva = {
    projectId: req.params.id,
    device: req.body.device,
    template: req.body.template
  }

  Canva.create(canva).then( canva => {
    res.json(canva);
  }).catch(function(err){
      throw err;
  }).catch(function(err){
    res.sendStatus(500);
  });

});




module.exports = router;
