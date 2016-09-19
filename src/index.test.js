'use strict';

const should  = require('should/as-function');
const secProv = require('./index.js');

describe('attributes', () => {
  it('version check', () => {
    should(secProv).have.property('version');
  });

  it('should have doFilter attribute', () => {
    should(secProv).have.property('doFilter');
  });

  it('should have doSort attribute', () => {
    should(secProv).have.property('doSort');
  });

  it('should have doBatch attribute', () => {
    should(secProv).have.property('doBatch');
  });

  it('should have execute attribute', () => {
    should(secProv).have.property('execute');
  });
});

describe('actions', () => {
  it('should be able to perform execute', () => {
    let baseQuery = {
      'queryObj': {'pass': true},
      'query': {
        'findAll': (param) => {
          return param;
        }
      }
    };

    should(secProv.execute(baseQuery).pass).equal(true);
  });

  it('should be able to perform doBatch', () => {
    let baseQuery = {'queryObj': {}};
    let queryObj  = secProv.doBatch(baseQuery, 10, 12).queryObj;

    should(queryObj.offset).equal(10);
    should(queryObj.limit).equal(12);
  });

  it('should be able to perform doSort', () => {
    let baseQuery = {'queryObj': {}};
    let query     = secProv.doSort(baseQuery, true, 'dummySortCol');

    should(query.queryObj.order.length).equal(1);
    should(query.queryObj.order[0][0]).equal('dummySortCol');
    should(query.queryObj.order[0][1]).equal('ASC');

    let query2 = secProv.doSort(query, false, 'dummySortCol2');

    should(query2.queryObj.order.length).equal(2);
    should(query2.queryObj.order[1][0]).equal('dummySortCol2');
    should(query2.queryObj.order[1][1]).equal('DESC');
  });

  it('should be able to perform doFilter', () => {
    let baseQuery = {'queryObj': {}};
    const key     = 'Key';
    const value   = 'Value';
    let query     = secProv.doFilter(baseQuery, key, value);

    should(query.queryObj.where[key]).equal(value);
  });
});
