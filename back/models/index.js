const sequelize = require('../database/database');

const User = require('./User');
const Scenario = require('./Scenario');
const Character = require('./Character');
const Choice = require('./Choice');

const db = { sequelize, User, Scenario, Character, Choice };

module.exports = db;
