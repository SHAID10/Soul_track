const sequelize = require("../config/database");
const Church = require("./Church");
const Visitor = require("./Visitor");
const Member = require("./Member");

// A Church can have many Visitors and many Members.
// This automatically adds a `churchId` foreign key column to both tables.
Church.hasMany(Visitor, { foreignKey: "churchId" });
Visitor.belongsTo(Church, { foreignKey: "churchId" });

Church.hasMany(Member, { foreignKey: "churchId" });
Member.belongsTo(Church, { foreignKey: "churchId" });

module.exports = { sequelize, Church, Visitor, Member };