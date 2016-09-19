'use strict';

const should  = require('should/as-function');
const secProv = require('./index.js');

describe('attributes', () => {
  it('version check', () => {
    should(secProv).have.property('version');
  });

  it('should have doFilter attribute', () => {
    should(secProv.doFilter()).equal('Filtering is not supported.');
  });

  it('should have doSort attribute', () => {
    should(secProv.doSort()).equal('Sorting is not supported.');
  });

  it('should have doBatch attribute', () => {
    should(secProv.doBatch()).equal('Batch fetch is not supported.');
  });

  it('should have execute attribute', () => {
    should(secProv.execute()).equal('Execution is not supported.');
  });
});
