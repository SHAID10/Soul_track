require("dotenv").config();
const { Sequelize } = require("sequelize");

// Sequelize instance connected to a local SQLite file.
// The file itself is created automatically the first time we run the app.
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_STORAGE || "./database.sqlite",
  logging: false, // set to console.log if you want to see raw SQL queries while debugging
});

module.exports = sequelize;