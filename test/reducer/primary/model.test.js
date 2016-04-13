import primaryReducerGenerator from '../../../generators/primaryReducerGenerator'

var assert = require('chai').assert;
var should = require('chai').should()

var reducer = primaryReducerGenerator('model')

describe('primaryReducerGenerator -- #model', function() {

  it('default state should be an empty object', function() {
    var previousState = undefined
    var action = {
      type: 'NONE'
    }
    var state = reducer.model(previousState, action)

    state.should.be.an.Object
    state.should.be.empty
  });

  it('should return an object when MODEL_FIND_SUCCESS action is dispatched', () => {
    var previousState = {}
    var nextState = {
      foo: 'bar'
    }
    var action = {
      type: 'MODEL_FIND_SUCCESS',
      model: nextState
    }
    var state = reducer.model(previousState, action)

    state.should.be.an.Object
    state.should.eql(nextState)
  });

});
