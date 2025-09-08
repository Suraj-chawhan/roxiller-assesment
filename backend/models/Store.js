const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Store = sequelize.define('Store', {
    name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false },
    address: { type: DataTypes.STRING(400), allowNull: false },
    owner_id: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: 'stores' });

  return Store;
};
