'use strict';

require('should');

const secProv = require('./index.js');

describe('attributes', () => {
  it('version check', () => {
    secProv.should.have.property('version');
  });
});
