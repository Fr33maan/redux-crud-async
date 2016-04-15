var expect                     = require('chai').expect
var primaryActionGenerator = require('../../../src/primaryActionGenerator')

describe('when init primaryActionGenerator', () => {

    it('should throw an error when instantiating redux-crud-async.primaryActionsFor without a hostConfig', () => {

      expect( function(){ return primaryActionGenerator('channel')})
      .to
      .throw(Error);

    })

    it('should throw an error when instantiating redux-crud-async.primaryActionsFor without a host in hostConfig', () => {

      expect( function(){ return primaryActionGenerator('channel', {prefix: 'v1'})})
      .to
      .throw(Error);

    })

    it('should NOT throw an error when instantiating redux-crud-async.primaryActionsFor without a prefix in hostConfig', () => {

      expect( function(){ return primaryActionGenerator('channel', {host: 'test'})})
      .to
      .not
      .throw(Error);

    })

})
