'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Projects belongsTo Customer
    return queryInterface.addColumn(
      'Projects', // name of Source model
      'UserId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    )
    .then( () => {
      return queryInterface.addColumn(
      'Canvas', // name of Source model
      'ProjectId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Projects', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    )
    })
  },

  down: (queryInterface, Sequelize) => {
    // remove Order belongsTo Customer
  }
};
