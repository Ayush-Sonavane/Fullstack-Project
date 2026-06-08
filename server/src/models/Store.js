const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Store = sequelize.define('Store', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: {
          args: [1, 60],
          msg: 'Store name must be between 1 and 60 characters',
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address',
        },
      },
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
      validate: {
        len: {
          args: [0, 400],
          msg: 'Address must not exceed 400 characters',
        },
      },
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: {
        msg: 'This owner already has a store assigned',
      },
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    tableName: 'stores',
    timestamps: true,
    underscored: true,
  });

  return Store;
};
