import primaryReducerGenerator from '../../../generators/primaryReducerGenerator'

var assert = require('chai').assert;
var should = require('chai').should()

var reducer = primaryReducerGenerator('model')

describe('primaryReducerGenerator -- #isFinding', function() {


  it('isFindingModel default state should be false', () => {

    var previousState = undefined
    var action = {
      type: 'NONE'
    }
    var state = reducer.isFindingModel(previousState, action)

    state.should.be.false

  })

  it('isFindingModels default state should be false', () => {

    var previousState = undefined
    var action = {
      type: 'NONE'
    }
    var state = reducer.isFindingModels(previousState, action)

    state.should.be.false

  })

  it('isFindingModel should return true when MODEL_FIND_START actions is dispatched ', function() {
    assert.equal(true, reducer.isFindingModel(undefined, {
      type: 'MODEL_FIND_START'
    }));
  });

  it('isFindingModels should return true when MODELS_FIND_START actions is dispatched ', function() {
    assert.equal(true, reducer.isFindingModels(undefined, {
      type: 'MODELS_FIND_START'
    }));
  });

});
