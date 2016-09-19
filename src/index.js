'use strict';

function doFilter(baseQuery, column, value) {
  baseQuery.queryObj.where         = baseQuery.queryObj.where || {};
  baseQuery.queryObj.where[column] = value;
  return baseQuery;
}

function doSort(baseQuery, isASC, sortString) {
  baseQuery.queryObj.order = baseQuery.queryObj.order || [];
  baseQuery.queryObj.order.push([sortString, isASC ? 'ASC' : 'DESC']);
  return baseQuery;
}

function doBatch(baseQuery, offset, limit) {
  baseQuery.queryObj = Object.assign(baseQuery.queryObj, {offset, limit});
  return baseQuery;
}

function execute(baseQuery) {
  return baseQuery.query.findAll(baseQuery.queryObj);
}

module.exports = {
  'version': '1.0.0',
  doFilter,
  doSort,
  doBatch,
  execute
};
