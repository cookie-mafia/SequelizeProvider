'use strict';

function doFilter() {
  return 'Filtering is not supported.';
}

function doSort() {
  return 'Sorting is not supported.';
}

function doBatch() {
  return 'Batch fetch is not supported.';
}

function execute() {
  return 'Execution is not supported.';
}

module.exports = {
  'version': '1.0.0',
  doFilter,
  doSort,
  doBatch,
  execute
};
