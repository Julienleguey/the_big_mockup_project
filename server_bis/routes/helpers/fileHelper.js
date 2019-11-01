const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');


/*********************************************************
function to create a folder for the newly created project
*********************************************************/

function createProjectFolder(userId, projectId) {
  console.log("INSIDE CREATE PROJECT FOLDER");
  const directoryPath = `${__dirname}/../../screenshots/${userId}/${projectId}`;
  const directory = path.normalize(directoryPath);

  fs.mkdir(directory, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

// create a temp folder
function createTempFolder(req, res, next) {
  const directoryPath = `${__dirname}/../../screenshots/temp_${req.currentUser.id}`;
  const directory = path.normalize(directoryPath);

  fs.mkdir(directory, { recursive: true }, (err) => {
    if (err) {
      throw err;
    } else {
      next();
    }
  });
}

// destroy temp folder
function destroyTempFolder(req, res) {
  const directoryPath = `${__dirname}/../../screenshots/temp_${req.currentUser.id}`;
  const directory = path.normalize(directoryPath);

  setTimeout( () => {
    fs.rmdir(directory, (err) => {
      if (err) throw err;
    });
  }, 1000);
}


// destroy one file
function destroyOneFile(directoryPath, file) {
  const directoryPathFile = `${directoryPath}/${file}`;
  const directoryFile = path.normalize(directoryPathFile);
  fs.unlinkSync(directoryFile);
}

// destroy all the files of a folder
function destroyAllFiles(req, res) {
  const directoryPath = `${__dirname}/../../screenshots/${req.query.userId}/${req.params.id}`;
  const directory = path.normalize(directoryPath);

  fs.readdir(directory, function(err, files) {
    if (files) {
      files.forEach(file => {
        destroyOneFile(directoryPath, file);
      });
    }
  });
}

// destroy a project folder
function destroyProjectFolder(req, res) {
  const directoryPath = `${__dirname}/../../screenshots/${req.query.userId}/${req.params.id}`;
  const directory = path.normalize(directoryPath);

  setTimeout( () => {
    fs.rmdir(directory, (err) => {
      console.log("directory: ", directory);
      // if (err) throw err;
      // bah non, on s'en fout si y'a pas de fichier à virer
    });
  }, 1000);
}

// rename a file to change its folder
function moveFilesFromTempToProjectFolder(req, res, metas) {
  console.log("INSIDE MOVE FILES ETC");
  const originPath = `${__dirname}/../../screenshots/temp_${req.currentUser.id}/`;
  const origin = path.normalize(originPath);

  const directoryPath = `${__dirname}/../../screenshots/${metas.userId}/${metas.projectId}/`;
  const directory = path.normalize(directoryPath);

  req.files.forEach( (file, index) => {
    let filesErr = 0;

    fs.rename(origin + file.originalname, directory + file.originalname, function(err) {
      if (err) {
        filesErr += 1;
      }
    });

    if (index === req.files.length - 1) {
      if (filesErr === 0) {
        setTimeout( () => {
            destroyTempFolder(req, res);
        }, 1000);
      }
    }
  });
}

module.exports = {
    createProjectFolder: createProjectFolder,
    createTempFolder: createTempFolder,
    destroyTempFolder: destroyTempFolder,
    destroyOneFile: destroyOneFile,
    destroyAllFiles: destroyAllFiles,
    destroyProjectFolder: destroyProjectFolder,
    moveFilesFromTempToProjectFolder: moveFilesFromTempToProjectFolder
}
