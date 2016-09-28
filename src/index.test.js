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
    let baseQuery1 = {
      'queryObj': {'pass': true},
      'query': {
        'findAll': (param) => {
          return param;
        }
      }
    };
    let baseQuery2 = Object.assign({}, baseQuery1, {'models': {'model1': {}}});

    should(secProv.execute(baseQuery1).pass).equal(true);
    should(secProv.execute(baseQuery2).pass).equal(true);
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

    let models     = {'AssocTable': {}};
    let baseQuery2 = Object.assign({}, baseQuery, {models});
    let query3     = secProv.doSort(baseQuery2, false,
      'AssocTable.dummySortCol');

    should(query3.queryObj.order.length).equal(3);
    should(Object.keys(query3.queryObj.order[2][0]).length).equal(0);
    should(query3.queryObj.order[2][1]).equal('dummySortCol');
    should(query3.queryObj.order[2][2]).equal('DESC');
  });

  it('should be able to perform doFilter', () => {
    let baseQuery1 = {'queryObj': {}};
    const seqAnd   = '$and';
    const key      = 'Key';
    const multKey  = 'AssocTable.Key';
    const value    = 'Value';
    let query      = secProv.doFilter(baseQuery1, key, value);

    should(query.queryObj.where[seqAnd][key]).equal(value);

    secProv.doFilter(baseQuery1, multKey, value);

    should(query.queryObj.where[seqAnd]['$' + multKey + '$']).equal(value);
  });

  it('should be able to package models for the provider', () => {
    const mainModel   = 'mainModel';
    const assocModel1 = 'assocModel1';
    const assocModel2 = 'assocModel2';
    const packedData  = secProv.pack(mainModel, {assocModel1, assocModel2});

    should(packedData.query).equal(mainModel);
    should(packedData.models.assocModel1.model).equal(assocModel1);
    should(packedData.models.assocModel2.model).equal(assocModel2);

    const packedData2 = secProv.pack(mainModel);

    should(packedData2.query).equal(mainModel);
    should(Object.keys(packedData2.models).length).equal(0);
  });
});
