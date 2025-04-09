const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const User = require('./User');
const Scenario = require('./Scenario');

const Character = sequelize.define('Character', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    species: { type: DataTypes.STRING(50), allowNull: false },
    life: { type: DataTypes.INTEGER, defaultValue: 100 },
    charisma: { type: DataTypes.INTEGER, defaultValue: 10 },
    dexterity: { type: DataTypes.INTEGER, defaultValue: 10 },
    intelligence: { type: DataTypes.INTEGER, defaultValue: 10 },
    luck: { type: DataTypes.INTEGER, defaultValue: 10 },
    is_alive: { type: DataTypes.BOOLEAN, defaultValue: true },
    currentScenarioId: {
        type: DataTypes.INTEGER,
        defaultValue: 1, // 👈 Définition du scénario par défaut
        references: {
            model: Scenario,
            key: 'id',
        },
    },
}, { timestamps: true });

User.hasMany(Character, { foreignKey: 'userId', onDelete: 'CASCADE' });
Character.belongsTo(User, { foreignKey: 'userId' });

Scenario.hasMany(Character, { foreignKey: 'currentScenarioId' });
Character.belongsTo(Scenario, { foreignKey: 'currentScenarioId' });

module.exports = Character;
