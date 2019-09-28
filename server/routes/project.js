const express = require('express');
const router = express.Router();
const authenticateUser = require("./middlewares").authenticateUser;
const projectOwner = require("./middlewares").projectOwner;
const User = require("../models").User;
const Project = require("../models").Project;
const Canva = require("../models").Canva;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/*********************************************************
function to create a folder for the newly created project
*********************************************************/

function createProjectFolder(userId, projectId) {
  const directoryPath = `${__dirname}/../screenshots/${userId}/${projectId}`;
  const directory = path.normalize(directoryPath);

  fs.mkdir(directory, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

// create a temp folder
function createTempFolder(req, res, next) {
  const directoryPath = `${__dirname}/../screenshots/temp_${req.currentUser.id}`;
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
  const directoryPath = `${__dirname}/../screenshots/temp_${req.currentUser.id}`;
  const directory = path.normalize(directoryPath);

  setTimeout( () => {
    fs.rmdir(directory, (err) => {
      if (err) throw err;
    });
  }, 300);

}



/*********************
multer middlewares
**********************/

const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `./screenshots/temp_${req.currentUser.id}`);
  },
  filename: function(req, file, cb) {
    cb(null, `${file.originalname}`)
  }
});

// const storageSingle = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, `./screenshots/test_folder`);
//   },
//   filename: function(req, file, cb) {
//     cb(null, `${file.originalname}`)
//   }
// })


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
  // storage: storageSingle,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});



// add a screenshot to the server for tests purposes
router.post('/test', authenticateUser, createTempFolder, upload.array('screenshots'), function(req, res, next){
  console.log("PLAYING THE POST METHOD ON THE SERVER");
  const projectDatas = JSON.parse(req.body.project);
  const canvas = JSON.parse(req.body.canvas);
  const metas = JSON.parse(req.body.metas);

  console.log(1);
  const originPath = `${__dirname}/../screenshots/temp_${req.currentUser.id}/`;
  const origin = path.normalize(originPath);

  // const directoryPath = `${__dirname}/../screenshots/${req.body.userId}/${req.body.projectId}/`;
  const directoryPath = `${__dirname}/../screenshots/${metas.userId}/${metas.projectId}/`;
  const directory = path.normalize(directoryPath);

  console.log(2);
  req.files.forEach( (file, index) => {
    console.log(3);
    let filesErr = 0;

    fs.rename(origin + file.originalname, directory + file.originalname, function(err) {
      if (err) {
        // return console.error(err);
        filesErr += 1;
      }
    });

    if (index === req.files.length - 1) {
      if (filesErr === 0) {
        destroyTempFolder(req, res);
        // res.status(200).send("ok");
        updateProject(req, res, metas, projectDatas, canvas);
      } else {
        res.status(500).send("An error occured while uploading the screenshots to the server.")
      }
    }
  });



})

// methods to do stuff
function updateProject(req, res, metas, projectDatas, canvas) {
  console.log("the updateProject method is played");
  console.log(projectDatas);
  // update of the project infos
  const id = metas.projectId;
  // const id = 30;

  let projectRes = false;
  let canvasRes = [];

  Project.findOne({ where: { id: id } }).then( (project) => {
    if (project) {
      project.update(projectDatas);
    } else {
      // project not found
      res.status(404).send("Something went wrong! We couldn't find your project! Please, try again!");
    }
  }).then( () => {
    projectRes = true;
  }).then( () => {
    // res.status(200).send("Your changes have been saved!");
    console.log("VICTORYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY PROJECT");
    updateCanvas(req, res, metas, projectDatas, canvas);
  }).catch(function(err){
    res.status(500).send("Something went wrong while updating the project. Please try again!");
  });
}

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


// add a screenshot to the server for tests purposes
router.post('/test_single', authenticateUser, upload.single('screenshot'), function(req, res){
  try {
      res.status(200).send("ok");
    } catch(err) {
      res.status(500).send("An error occured while uploading the screenshots to the server.")
    }
})


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
    os: req.body.os,
    device: req.body.device
  }

  Project.create(project).then( project => {
    createProjectFolder(project.userId, project.id);

    const canva = {
      projectId: project.id,
      template: req.body.template
    }

    Canva.create(canva).then( canva => {
      res.json(canva);
    }).catch(function(err){
      res.sendStatus(500).send("error while creating a canva for the project");
    });
  }).catch(function(err){
    res.status(500).send("error while creating a project");
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
