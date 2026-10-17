const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// A confirmed church member. May have originated from a converted Visitor,
// or been added directly by the pastor.
const Member = sequelize.define("Member", {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "nouveau", // "nouveau" | "actif" | "inactif"
  },
});

module.exports = Member;