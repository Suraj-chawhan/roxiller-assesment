const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Rating = sequelize.define('Rating', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    store_id: { type: DataTypes.INTEGER, allowNull: false },
    ratings: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: 'ratings' });

  return Rating;
};
