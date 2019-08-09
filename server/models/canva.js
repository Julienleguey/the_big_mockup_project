module.exports = (sequelize, DataTypes) => {
  const Canva = sequelize.define('Canva', {
    projectId: DataTypes.INTEGER,
    template: DataTypes.STRING,
    backgroundChoice: DataTypes.STRING,
    backgroundColor: DataTypes.STRING,
    backgroundImage: DataTypes.STRING,
    screenshot: DataTypes.STRING,
    titleText: DataTypes.STRING,
    titleFontFamily: DataTypes.STRING,
    titleSize: DataTypes.STRING,
    titleColor: DataTypes.STRING,
    titleWeight: DataTypes.STRING,
    subtitleText: DataTypes.STRING,
    subtitleFontFamily: DataTypes.STRING,
    subtitleSize: DataTypes.STRING,
    subtitleColor: DataTypes.STRING,
    subtitleWeight: DataTypes.STRING
  });

  Canva.associate = (models) => {
    models.Canva.belongsTo(models.Project);
  };

  return Canva;
};
