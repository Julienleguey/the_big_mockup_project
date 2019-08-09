module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    os: DataTypes.STRING,
    size: DataTypes.STRING,
    device: DataTypes.STRING
  });


  // Project.associate = (models) => {
  //   models.Project.belongsTo(models.User, {
  //     onDelete: "CASCADE",
  //     foreignKey: {
  //       allowNull: false
  //     }
  //   })
  // };

  Project.associate = (models) => {
    models.Project.belongsTo(models.User);
    models.Project.hasMany(models.Canva);
  };

  return Project;
};
