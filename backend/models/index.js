const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

// Import models
const User = require('./User')(sequelize, DataTypes);
const Store = require('./Store')(sequelize, DataTypes);
const Rating = require('./Rating')(sequelize, DataTypes);

// Relations
User.hasMany(Store, { foreignKey: 'owner_id' });
Store.belongsTo(User, { foreignKey: 'owner_id' });

User.hasMany(Rating, { foreignKey: 'user_id' });
Store.hasMany(Rating, { foreignKey: 'store_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });
Rating.belongsTo(Store, { foreignKey: 'store_id' });

// Export
module.exports = {
  sequelize,
  User,
  Store,
  Rating,
};
