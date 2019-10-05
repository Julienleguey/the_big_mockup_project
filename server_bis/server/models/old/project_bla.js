const Model = Sequelize.Model;
class Project extends Model {}
Project.init({
  // attributes
  name: DataTypes.STRING,
  os: DataTypes.STRING,
  size: DataTypes.STRING,
  device: DataTypes.STRING
}, {
  sequelize,
  modelName: 'project'
  // options
});

Project.belongsTo(User);
Project.hasMany(Canva);
