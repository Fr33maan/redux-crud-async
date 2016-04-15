var expect                     = require('chai').expect
var associationActionGenerator = require('../../../src/associationActionGenerator')

describe('when init associationActionGenerator', () => {

    it('should throw an error when instantiating redux-crud-async.associationActionsFor without a hostConfig', () => {

      expect( function(){ return associationActionGenerator('channel', 'tag')})
      .to
      .throw(Error);

    })

    it('should throw an error when instantiating redux-crud-async.associationActionsFor without a host in hostConfig', () => {

      expect( function(){ return associationActionGenerator('channel', 'tag', {prefix: 'v1'})})
      .to
      .throw(Error);

    })

    it('should NOT throw an error when instantiating redux-crud-async.associationActionsFor without a prefix in hostConfig', () => {

      expect( function(){ return associationActionGenerator('channel', 'tag', {host: 'test'})})
      .to
      .not
      .throw(Error);

    })

})
