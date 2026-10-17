const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// One row per church account. The pastor logs in using this record's
// email/password — there's no separate "User" table for this project.
const Church = sequelize.define("Church", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pastorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // no two churches can register with the same email
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  welcomeSmsMessage: {
    type: DataTypes.STRING,
    allowNull: true, // optional — church can set this later from Settings
  },
});

module.exports = Church;