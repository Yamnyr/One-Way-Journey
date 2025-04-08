const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Scenario = require('./Scenario');

const Choice = sequelize.define('Choice', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    required_stat: { type: DataTypes.STRING(50), allowNull: true },  // Ex: 'charisma'
    required_value: { type: DataTypes.INTEGER, allowNull: true },
    result: { type: DataTypes.TEXT, allowNull: false },
    effect_life: { type: DataTypes.INTEGER, defaultValue: 0 },
    effect_charisma: { type: DataTypes.INTEGER, defaultValue: 0 },
    effect_dexterity: { type: DataTypes.INTEGER, defaultValue: 0 },
    effect_luck: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_game_over: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: true });

Scenario.hasMany(Choice, { foreignKey: 'scenarioId', onDelete: 'CASCADE' });
Choice.belongsTo(Scenario, { foreignKey: 'scenarioId' });

Scenario.hasMany(Choice, { foreignKey: 'nextScenarioId', as: 'NextScenario' });
Choice.belongsTo(Scenario, { foreignKey: 'nextScenarioId', as: 'NextScenario' });

module.exports = Choice;
