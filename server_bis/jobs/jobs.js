const schedule = require('node-schedule');
const User = require("../server/models").User;
const Project = require("../server/models").Project;
const destroyAllFiles = require("../routes/helpers/fileHelper").destroyAllFiles;
const destroyProjectFolder = require("../routes/helpers/fileHelper").destroyProjectFolder;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

function preSuspendUsers() {
  schedule.scheduleJob('* 2 * * *', function(){
      User.findAll({where: {status: { [Op.or]: ["active", "testing"] }}}).then((users) => {
        users.forEach(user => {
          const now = new Date();
          const premiumUntil = new Date(user.premiumUntil);;
          if (premiumUntil < now) {
            user.update({status: "pre_suspended"})
          }
        })
      });
  });
}

function suspendUsers() {
  schedule.scheduleJob('* 1 * * *', function() {
    User.findAll({where: {status: "pre_suspended"}, include: [
      {
        model: Project
      }
    ]}).then( users => {
      users.forEach(user => {
        const projects = user.Projects;
        user.update({status: "suspended"});
        projects.forEach(project => {
          const req = {
            query: {},
            params: {}
          };
          req.query.userId = project.UserId;
          req.params.id = project.id;
          const res = "";
          Project.destroy({
            where: {id: project.id}
          }).then( () => {
            destroyAllFiles(req, res);
          }).then( () => {
            destroyProjectFolder(req, res);
          })
        })
      })
    })
  })
}

// quand un user pas "active" veut créer un projet, dans l'ordre :
// - il prend le status "testing" (s'il ne l'a pas déjà)
// - on supprime ses projets précédents s'il y en a
// - on crée un nouveau projet

// sur le job preSuspendUsers, on ajoute les "testing" à passer en pre_suspended

// à 3h, un job tourne et tous les "testing" passent en pre_suspended (bah non, ça sert à rien)
// function testingUsers() {
//   User.findAll({where: {status: "testing")}})
// }



module.exports = {
  preSuspendUsers: preSuspendUsers,
  suspendUsers: suspendUsers
}
