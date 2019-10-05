'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Canvas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      template: Sequelize.STRING,
      backgroundChoice: {
        type: Sequelize.STRING,
        defaultValue: ""
      },
      backgroundColor: {
        type: Sequelize.STRING,
        defaultValue: "#ffffff"
      },
      backgroundImage: Sequelize.STRING,
      // screenshot: {
      //   type: Sequelize.STRING,
      //   defaultValue: ""
      // },
      screenshotURL: {
        type: Sequelize.STRING,
        defaultValue: ""
      },
      titleContent: {
        type: Sequelize.STRING,
        defaultValue: "title"
      },
      titleFont: {
        type: Sequelize.STRING,
        defaultValue: "Arial"
      },
      titleSize: {
        type: Sequelize.STRING,
        defaultValue: "medium"
      },
      titleColor: {
        type: Sequelize.STRING,
        defaultValue: "#000000"
      },
      titleWeight: {
        type: Sequelize.STRING,
        defaultValue: ""
      },
      subtitleContent: {
        type: Sequelize.STRING,
        defaultValue: "subtitle"
      },
      subtitleFont: {
        type: Sequelize.STRING,
        defaultValue: "Arial"
      },
      subtitleSize: {
        type: Sequelize.STRING,
        defaultValue: "small"
      },
      subtitleColor: {
        type: Sequelize.STRING,
        defaultValue: "#000000"
      },
      subtitleWeight: {
        type: Sequelize.STRING,
        defaultValue: ""
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
    return queryInterface.dropTable('Canvas');
  }
};
