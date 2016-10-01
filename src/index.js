'use strict';

const sequelize = require('sequelize');
const seqAnd    = '$and';
const seqOr     = '$or';

function doBeforeExecute(queryObj) {
  return queryObj;
}

function checkColumn(column) {
  let wrap = column.includes('.') ? '$' : '';
  return wrap + column + wrap;
}

function doFilter(baseQuery, column, value) {
  baseQuery.queryObj.where = baseQuery.queryObj.where || {};
  baseQuery.queryObj.where[seqAnd] = baseQuery.queryObj.where[seqAnd] || {};
  baseQuery.queryObj.where[seqAnd][checkColumn(column)] = value;
  return baseQuery;
}

function performSort(baseQuery, dir, source) {
  baseQuery.queryObj.order = baseQuery.queryObj.order || [];
  baseQuery.queryObj.order.push(source.concat(dir));
}

function doSort(baseQuery, isASC, sortString) {
  function determineSortString(currToken, nxtToken) {
    return (nxtToken && baseQuery.models && baseQuery.models[nxtToken] &&
      [baseQuery.models[nxtToken]] || []).concat([currToken]);
  }

  function prePerformSort(token, index, tokens) {
    performSort(baseQuery, [isASC ? 'ASC' : 'DESC'],
      determineSortString(token, tokens[index + 1]));
    return true;
  }

  sortString.split('.').reverse().some(prePerformSort);
  return baseQuery;
}

function doBatch(baseQuery, offset, limit) {
  baseQuery.queryObj = Object.assign(baseQuery.queryObj, {offset, limit});
  return baseQuery;
}

function doField(baseQuery, fieldString) {
  Object.keys(baseQuery.models || {}).forEach(function(key) {
    baseQuery.models[key].attributes = [];
  });
  baseQuery.queryObj.group      = baseQuery.queryObj.group || [];
  baseQuery.queryObj.attributes = baseQuery.queryObj.attributes || [[
    sequelize.fn('json_agg', sequelize.col(baseQuery.query.name + '.id')),
    'ids'
  ]];
  baseQuery.queryObj.group.push(fieldString);
  baseQuery.queryObj.attributes.push(fieldString);
  baseQuery.queryObj.raw = true;
  return baseQuery;
}

function buildModels(prev, key) {
  prev.dest.push(prev.src[key]);
  return prev;
}

function execute(baseQuery) {
  let options = baseQuery.options || {};
  let wrap = options.doBeforeExecute || this.doBeforeExecute;
  let src = baseQuery.models || {};
  baseQuery.queryObj.include = Object.keys(src)
    .reduce(buildModels, {src,'dest': []}).dest;
  return baseQuery.query.findAll(wrap(baseQuery.queryObj));
}

function pack(baseModel, models, optionsParam) {
  let options = optionsParam || {};
  function blowUpModels(prev, key) {
    prev.dest[key] = {
      'model': prev.src[key],
      'required': !((options.nullable || []).indexOf(key) > -1)
    };
    return prev;
  }

  let src = models || [];
  let dst = Object.keys(src).reduce(blowUpModels, {src,'dest': {}});
  return {
    'query': baseModel,
    'models': dst.dest,
    'queryObj': {'raw': options.valuesOnly},
    options
  };
}

module.exports = {
  'version': '1.2.0',
  doFilter,
  doSort,
  doBatch,
  doField,
  execute,
  pack,
  doBeforeExecute
};
