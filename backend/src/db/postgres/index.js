'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    port: config.port || 5432,
    logging: false,
  });
}

const modelsDir = path.join(__dirname, 'models');
fs.readdirSync(modelsDir)
  .filter((file) => file.endsWith('.js'))
  .forEach((file) => {
    const model = require(path.join(modelsDir, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

if (!db.User) {
  console.error('`User` model not loaded!');
} else {
  console.log('`User` model successfully loaded!');
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
