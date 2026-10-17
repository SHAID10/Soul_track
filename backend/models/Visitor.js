const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// A person who visited the church. May later be converted into a Member.
const Visitor = sequelize.define("Visitor", {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sexe: {
    type: DataTypes.STRING, // "H" or "F", matching the frontend form
    allowNull: true,
  },
  quartier: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sujetPriere: {
    type: DataTypes.TEXT, // prayer request can be a longer free-text field
    allowNull: true,
  },
  wantsToStay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  converted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // set to true once this visitor becomes a Member
  },
  photo: {
    type: DataTypes.STRING, // will store a file path or URL, not the image itself
    allowNull: true,
  },
});

module.exports = Visitor;