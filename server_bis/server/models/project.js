'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    name: DataTypes.STRING,
    os: DataTypes.STRING,
    size: DataTypes.STRING,
    device: DataTypes.STRING
  }, {});
  Project.associate = function(models) {
    // associations can be defined here
    Project.belongsTo(models.User);
    Project.hasMany(models.Canva);
  };
  return Project;
};
