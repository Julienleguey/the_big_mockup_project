const express = require('express');
const router = express.Router();
const Project = require("../../server/models").Project;
const updateCanvas = require("./canvaHelper").updateCanvas;


function updateProject(req, res, metas, projectDatas, canvas) {
  const id = metas.projectId;

  Project.findOne({ where: { id: id } }).then( project => {
    if (project) {
      project.update(projectDatas);
    } else {
      res.status(404).send("Something went wrong! We couldn't find your project! Please, try again!");
    }
  }).then( () => {
    updateCanvas(req, res, metas, projectDatas, canvas);
  }).catch( err => {
    res.status(500).send("Something went wrong while updating the project. Please, try again!");
  });
}

function updateName(req, res) {
  const newName = {
    name: req.body.name
  }

  Project.findOne({ where: { id: req.params.id } }).then( (project) => {
      if (project) {
        project.update(newName);
        // throw new Error('BROKEN'); // usefull to raise an error!
      } else {
        res.status(404).send("Something went wrong! We couldn't find your project! Please refresh the page and try again!");
      }
    }).then( () => {
      res.status(200).send("The project's name was successfully updated!");
    }).catch( () => {
      res.status(500).send("Something went wrong! Please refresh the page and try again!");
    })
}

function getProjectObject(project) {
  return Object.keys(project.dataValues).reduce((object, key) => {
    if (!["id", "Canvas", "createdAt", "updatedAt"].includes(key)) {
      if (key === "name") {
        object[key] = project[key] + "_copy"
      } else {
        object[key] = project[key]
      }
    }
    return object;
  }, {});
}

module.exports = {
  updateProject: updateProject,
  updateName: updateName,
  getProjectObject: getProjectObject
}
