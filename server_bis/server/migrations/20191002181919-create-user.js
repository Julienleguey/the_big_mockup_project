'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      job: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: "Email is required!"
          }
        }
      },
      password: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: "Password is required!"
          }
        }
      },
      premiumUntil: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM,
        values: ['active', 'pre_suspended', 'suspended'],
        defaultValue: "suspended"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
