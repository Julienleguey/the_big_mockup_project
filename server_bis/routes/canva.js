const express = require('express');
const router = express.Router();
const checkToken = require("./middlewares").checkToken;
const projectOwner = require("./middlewares").projectOwner;
const User = require("../server/models").User;
const Project = require("../server/models").Project;
const Canva = require("../server/models").Canva;
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
router.get('/list/:id', checkToken, function(req, res, next) {
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
router.post('/new', checkToken, function(req, res) {

  const canva = {
    ProjectId: req.body.projectId,
    template: req.body.template
  };

  Canva.create(canva).then( newCanva => {
    res.status(201).send(newCanva);
  }).catch( err => {
    res.sendStatus(500);
  });

});



//204 - Delete a canva
router.delete('/delete/:id', checkToken, function(req, res, next){
  const id = req.params.id;

  Canva.destroy({
    where: {id: req.params.id}
  }).then( () => {
    // const directoryPath = `${__dirname}/../screenshots/${req.query.userId}/${req.query.projectId}/${req.query.screenshotUrl}`;
    const directoryPath = `${__dirname}/../screenshots/${req.query.screenshotUrl}`;
    const directory = path.normalize(directoryPath);

    if (req.query.screenshotUrl !== "") {
      // si on ajoute un screenshot MAIS qu'on ne sauvegarde pas, le test passe, mais on n'a pas vraiment de screenshot à supprimer et ça crée une erreur
      console.log(req.query.screenshotUrl);
      fs.unlink(directory, (err) => {
        if (err) console.log("no worries!");
        // I don't want to throw an error if the file I want to delete doesn't exist
        // If it doesn't exist and I wanted to delete it, what's the problem? None! Exactly! So, no need to throw an error.
      });
    }

  }).then( () => {
    res.status(204).send();
  }).catch( () => {
    res.sendStatus(500);
  })
});






module.exports = router;
