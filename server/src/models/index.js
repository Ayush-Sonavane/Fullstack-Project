const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Create Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool,
  }
);

// Import model definitions
const User = require('./User')(sequelize);
const Store = require('./Store')(sequelize);
const Rating = require('./Rating')(sequelize);

// ─── Associations ─────────────────────────────────────────────────

// User <-> Store (one-to-one: owner)
User.hasOne(Store, { foreignKey: 'owner_id', as: 'store' });
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// User <-> Rating (one-to-many)
User.hasMany(Rating, { foreignKey: 'user_id', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Store <-> Rating (one-to-many)
Store.hasMany(Rating, { foreignKey: 'store_id', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Store,
  Rating,
};
