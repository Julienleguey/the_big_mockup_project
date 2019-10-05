const Model = Sequelize.Model;
class User extends Model {}
User.init({
  // attributes
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg: "Email is required!"
      }
    }
  },
  country: DataTypes.STRING,
  job: DataTypes.STRING,
  password: {
    type: DataTypes.STRING,
    validate: {
      notEmpty: {
        msg: "Password is required!"
      }
    }
  }
}, {
  sequelize,
  modelName: 'user'
  // options
});

User.hasMany(Project);
