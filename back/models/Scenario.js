const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Scenario = sequelize.define('Scenario', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.ENUM('choice', 'destiny'), allowNull: false },
    is_final: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: true });

module.exports = Scenario;
