'use strict';

function performFilter(baseQuery, column, value) {
  baseQuery.where         = baseQuery.where || {};
  baseQuery.where[column] = value;
}

function doFilter(baseQuery, column, value) {
  function determineQueryObj(nxtToken) {
    return nxtToken && baseQuery.models && baseQuery.models[nxtToken] ||
      baseQuery.queryObj;
  }

  function prePerformFilter(token, index, tokens) {
    performFilter(determineQueryObj(tokens[index + 1]), token, value);
    return true;
  }

  column.split('.').reverse().some(prePerformFilter);
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

function buildModels(prev, key) {
  prev.dest.push(prev.src[key]);
  return prev;
}

function execute(baseQuery) {
  let src = baseQuery.models || {};
  baseQuery.queryObj.include = Object.keys(src)
    .reduce(buildModels, {src,'dest': []}).dest;
  return baseQuery.query.findAll(baseQuery.queryObj);
}

function blowUpModels(prev, key) {
  prev.dest[key] = {'model': prev.src[key]};
  return prev;
}

function pack(baseModel, models) {
  let src = models || [];
  let dst = Object.keys(src).reduce(blowUpModels, {src,'dest': {}});
  return {'query': baseModel, 'models': dst.dest, 'queryObj': {}};
}

module.exports = {
  'version': '1.2.0',
  doFilter,
  doSort,
  doBatch,
  execute,
  pack
};
