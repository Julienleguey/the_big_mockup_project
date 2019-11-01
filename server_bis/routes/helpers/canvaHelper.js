const express = require('express');
const router = express.Router();
const Canva = require("../../server/models").Canva;
const fs = require('fs');
const path = require('path');

// create an empty canva
function createEmptyCanva(req, res, projectId) {
  console.log("INSIDE CREATE EMPTY CANVA");
  const canva = {
    ProjectId: projectId,
    template: req.body.template
  };

  console.log("CANVA: ", canva);
  Canva.create(canva).then( canva => {
    console.log("CANVA CREATED");
    res.json(canva);
  }).catch(function(err){
    console.log("CANVA NOT CREATED");
    console.log(err);
    res.sendStatus(500).send("error while creating a canva for the project");
  });
}

// update all the canvas of one project on save
function updateCanvas (req, res, metas, projectDatas, canvas) {
  const canvasArr = [];

  for (let [key, value] of Object.entries(canvas)) {
    canvasArr.push(value);
  }

  for (let i = 0; i < canvasArr.length; i++) {
    if (updateOneCanva(canvasArr[i], metas.projectId) === false) {
      res.status(500).send("Something went wrong while updating the project. Please try again!");
      break;
    } else if (i === canvasArr.length - 1) {
      res.status(200).send("Your changes have been saved!");
    }
  }
}

// update one canva on save
function updateOneCanva (canvaDatas, projectId) {
  if (canvaDatas.metadatas.canvasId === "new") {
    // create a new canva
    const newTruc = canvaDatas.datas;
    newTruc.projectId = projectId;
    // Canva.create(canvaDatas.datas).then( () => {
    Canva.create(newTruc).then( () => {
      return true;
    }).catch(function(err){
      return false;
    });
  } else {
    // update the existing canva
    Canva.findOne({ where: {id: canvaDatas.metadatas.canvasId} }).then ( (canva) => {
      if (canva) {
        canva.update(canvaDatas.datas);
      } else {
        return false;
      }
    }).then( () => {
      return true;
    }).catch( err => {
      return false;
    })
  }
}

// format from the dataValues
function getCanvaObject(canva, projectId) {
  return Object.keys(canva.dataValues).reduce((object, key) => {
    if (!["id", "createdAt", "updatedAt"].includes(key)) {
      if (key === "ProjectId") {
        object[key] = projectId
      } else {
        object[key] = canva[key]
      }
    }
    return object;
  }, {});
}

// duplicate a canva and its screenshot
function duplicateCanvas(oldProject, createdProject) {
  const blaPath = `${__dirname}/../../screenshots`;
  const bla = path.normalize(blaPath);

  oldProject.dataValues.Canvas.forEach( canva => {
    const newCanva = getCanvaObject(canva, createdProject.id);

    Canva.create(newCanva).then( canvaCreated => {
      if (newCanva.screenshotURL) {
        const newScreenshotUrl = {screenshotURL: `/${createdProject.UserId}/${createdProject.id}/${canvaCreated.id}${canvaCreated.screenshotURL.slice(canvaCreated.screenshotURL.indexOf("."))}`}
        canvaCreated.update(newScreenshotUrl);

        fs.copyFile(bla + newCanva.screenshotURL, bla + newScreenshotUrl.screenshotURL, err => {
          if (err === null) {
            console.log("that went well");
          } else {
            console.log("HOLY FUCKING SHIT");
          }
        })
      }
    }).catch( err => {
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaargh!");
    })
  });
}

module.exports = {
  updateCanvas: updateCanvas,
  createEmptyCanva: createEmptyCanva,
  duplicateCanvas: duplicateCanvas
}
