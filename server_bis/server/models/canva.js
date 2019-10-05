'use strict';
module.exports = (sequelize, DataTypes) => {
  const Canva = sequelize.define('Canva', {
    template: DataTypes.STRING,
    backgroundChoice: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    backgroundColor: {
      type: DataTypes.STRING,
      defaultValue: "#ffffff"
    },
    backgroundImage: DataTypes.STRING,
    screenshot: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    screenshotURL: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    titleContent: {
      type: DataTypes.STRING,
      defaultValue: "title"
    },
    titleFont: {
      type: DataTypes.STRING,
      defaultValue: "Arial"
    },
    titleSize: {
      type: DataTypes.STRING,
      defaultValue: "medium"
    },
    titleColor: {
      type: DataTypes.STRING,
      defaultValue: "#000000"
    },
    titleWeight: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    subtitleContent: {
      type: DataTypes.STRING,
      defaultValue: "subtitle"
    },
    subtitleFont: {
      type: DataTypes.STRING,
      defaultValue: "Arial"
    },
    subtitleSize: {
      type: DataTypes.STRING,
      defaultValue: "small"
    },
    subtitleColor: {
      type: DataTypes.STRING,
      defaultValue: "#000000"
    },
    subtitleWeight: {
      type: DataTypes.STRING,
      defaultValue: ""
    }
  }, {});
  Canva.associate = function(models) {
    // associations can be defined here
    Canva.belongsTo(models.Project);
  };
  return Canva;
};
