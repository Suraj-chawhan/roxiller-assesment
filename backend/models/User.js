const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    STORE_OWNER: 'store_owner',
  };

  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    address: { type: DataTypes.STRING(400), allowNull: false },
    role: { type: DataTypes.STRING(20), allowNull: false },
  }, { tableName: 'users' });

  User.ROLES = ROLES;
  return User;
};
