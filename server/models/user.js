module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   defaultValue: DataTypes.UUIDV4,
    //   allowNull: false
    // },
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
  }
  //   ,
  //   createdAt: {
  //     type: DataTypes.DATE,
  //     allowNull: false
  //   },
  //   updatedAt:  DataTypes.DATE,
  //   deletedAt: DataTypes.DATE
  // }
  // , {
  //   underscored: true
  // }
);

  User.associate = (models) => {
    models.User.hasMany(models.Project);
  };

  return User;
};
