const Model = Sequelize.Model;
class Canva extends Model {}
Canva.init({
  // attributes
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
}, {
  sequelize,
  modelName: 'canva'
  // options
});

Canva.belongsTo(Project);