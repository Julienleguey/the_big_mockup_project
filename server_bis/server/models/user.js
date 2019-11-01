'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    country: DataTypes.STRING,
    job: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Email is required!"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Password is required!"
        }
      }
    },
    premiumUntil: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['active', 'testing', 'pre_suspended', 'suspended']],
      },
      defaultValue: "suspended"
    },
    resetPasswordToken: {
      type: DataTypes.STRING
    },
    resetPasswordExpires: {
      type: DataTypes.DATE
    },
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Project);
  };
  return User;
};
