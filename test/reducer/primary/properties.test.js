import primaryReducerGenerator from '../../../generators/primaryReducerGenerator'

var assert = require('chai').assert;
var should = require('chai').should()

var reducer = primaryReducerGenerator('model')

describe('primaryReducerGenerator -- global properties', function() {
  it('should have a model and a models property', function() {
    assert.equal(true, reducer.hasOwnProperty('model'));
    assert.equal(true, reducer.hasOwnProperty('models'));
  });

  it('should have a isFindingModel and a isFindingModels property', function() {
    assert.equal(true, reducer.hasOwnProperty('isFindingModel'));
    assert.equal(true, reducer.hasOwnProperty('isFindingModels'));
  });
});
