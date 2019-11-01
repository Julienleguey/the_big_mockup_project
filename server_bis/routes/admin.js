const express = require('express');
const router = express.Router();
const checkToken = require("./middlewares").checkToken;
const checkAdmin = require("./middlewares").checkAdmin;
const User = require("../server/models").User;

// adding bcrypt to hash the passwords
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);


// get one user
router.get('/user/:id', checkToken, checkAdmin, (req, res) => {
  User.findOne({ where: { id: req.params.id } }).then( user => {
    res.json(user);
  })
})



// get all the users
// FOR DEVELOPMENT PURPOSES ONLY
router.get('/all', checkToken, checkAdmin, (req, res) => {
  console.log("INSDE GET ALL USERS");
  User.findAll({}).then((users) => {
    res.json(users);
  });
});


router.put('/change_password', checkToken, checkAdmin, (req, res) => {
  console.log("REQ BODY: ", req.body);
  User.findOne({ where: { id: req.body.userId } }).then( user => {
    // Hashing the new password
    const myPlaintextPassword = req.body.newPassword;
    const hashedPassword = bcrypt.hashSync(myPlaintextPassword, salt);

    return user.update({ password: hashedPassword });
  }).then( () => {
    res.sendStatus(200);
  }).catch( err => {
    console.log("ach grosse malheur deutschland kaput");
    res.sendStatus(500);
  });
});

router.put('/update_profile/:id', checkToken, checkAdmin, (req, res) => {
  User.findOne({ where: {id: req.params.id } }).then( user => {
    return user.update(req.body);
  }).then( () => {
    res.sendStatus(200);
  }).catch( () => {
    res.sendStatus(500);
  })
})

router.put('/update_status/:id', checkToken, checkAdmin, (req, res) => {
  User.findOne({ where: { id: req.params.id } }).then( user => {
    const premiumUntil = setExtension(user, req.body.period, req.body.extension);
    return user.update({ status: req.body.status, premiumUntil: premiumUntil });
  }).then( () => {
    res.sendStatus(200);
  }).catch( () => {
    res.sendStatus(500);
  })
})


function setExtension(user, period, extension) {
  const now = new Date();
  const premiumUntil = new Date(user.premiumUntil);
  let then = new Date();

  const extensionInt = parseInt(extension, 10);
  if (user.premiumUntil === null || premiumUntil < now) {
    if (extensionInt === 0) {
      then = null;
    } else if (period === "days") {
      then.setDate(now.getDate() + extensionInt);
    } else if (period === "months") {
      then.setMonth(now.getMonth() + extensionInt);
    }
  } else {
    then = premiumUntil;
    if (extensionInt === 0) {
      then = null;
    } else if (period === "days") {
      then.setDate(then.getDate() + extensionInt);
    } else if (period === "months") {
      then.setMonth(then.getMonth() + extensionInt);
    }
  }

  return then;
}


// get all the users and their projects
// FOR DEVELOPMENT PURPOSES ONLY
router.get('/all_users_and_project', checkToken, (req, res) => {
  User.findAll({
    include: [
      {
        model: Project
      }
    ]
  }).then((users) => {
    res.json(users);
  });
});





module.exports = router;
