'use strict';

const apiQuery  = require('api-query');
const provider  = require('../src');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('nakautot', 'nakautot', null, {
  'host': 'localhost',
  'port': 5432,
  'dialect': 'postgres'
});

var bits = sequelize.define('Bits', {
  'id': {'type': Sequelize.UUID, 'primaryKey': true},
  'type': {'type': Sequelize.STRING}
});

apiQuery.setAllowedOperators([
  apiQuery.optr.SORT,
  apiQuery.optr.BATCH,
  apiQuery.optr.FILTER
]);
apiQuery.setActionProvider(provider);
apiQuery.start({
  'query': bits,
  'queryObj': {}
}, {
  'sort': '+type',
  'limit': 2,
  'fltr_type': 'file'
}).then((res) => {
  console.log(res);
}, (err) => {
  console.log(err);
}).catch((err) => {
  console.log(err);
});
