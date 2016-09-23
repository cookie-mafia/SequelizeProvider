'use strict';

// The query utility
const apiQuery = require('api-query');
// The provider for sequelize, we have a knex provider in the works as well
const actionProvider = require('../src');
// Setup sequelize connection
const Sequelize = require('sequelize');
const sequelize = new Sequelize('nakautot', 'nakautot', null, {
  'host': 'localhost', 'port': 5432, 'dialect': 'postgres'
});

// define Model
const Animal = sequelize.define('Animal', {
  'id': {'type': Sequelize.INTEGER, 'primaryKey': true},
  'name': {'type': Sequelize.STRING},
  'typeId': {'type': Sequelize.INTEGER},
});

const Terrain = sequelize.define('Terrain', {
  'id': {'type': Sequelize.INTEGER, 'primaryKey': true},
  'name': {'type': Sequelize.STRING}
});

Terrain.hasMany(Animal, {'foreignKey': 'typeId'});
Animal.belongsTo(Terrain, {'foreignKey': 'typeId'});

// allowed query operators, even if request params are present if operation is not allowed it will not happen
// OPERATOR FLAGS: apiQuery.optr.SORT, apiQuery.optr.BATCH, apiQuery.optr.FILTER
const operators = [apiQuery.optr.SORT];
// object representation of Request URL Parameters fetched by the service
const requestURLParams = {'sort': '+Terrain.name,-name'};
// package sequelize entities to conform to provider needs, param1=base model to query, param2=related models
let packedData = actionProvider.pack(Animal, {Terrain});

// The query utility in action
apiQuery
  // param1=the wrapped sequelize model, param2=the piped request url parameters, param3=control options
  .start(packedData, requestURLParams, {actionProvider, operators})
  // We just piped the promise callbacks to console.log
  .then(console.log, console.log).catch(console.log);
