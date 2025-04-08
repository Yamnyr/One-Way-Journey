const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: true },
    role: { type: DataTypes.ENUM('player', 'admin'), defaultValue: 'player' }
}, { timestamps: true });

module.exports = User;
