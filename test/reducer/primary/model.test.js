var primaryReducerGenerator = require('../../../src/primaryReducerGenerator')

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

  describe('FIND -- ', function(){
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
  })

  describe('UPDATE -- ', function(){

    it('should return updated object when MODEL_UPDATE_START action is dispatched', () => {
      var previousState = {
        id : 1,
        foo : 'bar',
        updating : false
      }

      var nextState = {
        id : 1,
        foo : 'boo',
        updating : true
      }

      var action = {
        type: 'MODEL_UPDATE_START',
        model: {
          id : 1,
          foo : 'boo',
        }
      }
      var state = reducer.model(previousState, action)

      state.should.be.an.Object
      state.should.eql(nextState)
    });


    it('should return updated object when MODEL_UPDATE_SUCCESS action is dispatched', () => {
      var previousState = {
        id : 1,
        foo : 'boo',
        updating : true
      }

      var nextState = {
        id : 1,
        foo : 'boo',
        updating : false
      }

      var action = {
        type: 'MODEL_UPDATE_SUCCESS',
        model: {
          id : 1,
          foo : 'boo'
        }
      }
      var state = reducer.model(previousState, action)

      state.should.be.an.Object
      state.should.eql(nextState)

    });

  })




  describe('DESTROY -- ', function(){

    it('should return updated object when MODEL_DESTROY_START action is dispatched', () => {
      var previousState = {
        id : 1,
        foo : 'bar',
        destroying : false
      }

      var nextState = {
        id : 1,
        foo : 'bar',
        destroying : true
      }

      var action = {
        type   : 'MODEL_DESTROY_START',
        modelId: 1
      }
      var state = reducer.model(previousState, action)
      state.should.be.an.Object
      state.should.eql(nextState)
    });


    it('should return updated object when MODEL_DESTROY_SUCCESS action is dispatched', () => {
      var previousState = {
        id : 1,
        foo : 'bar',
        destroying : true
      }

      var nextState = {}

      var action = {
        type: 'MODEL_DESTROY_SUCCESS',
        modelId: 1
      }
      var state = reducer.model(previousState, action)

      state.should.be.an.Object
      state.should.eql(nextState)

    });

  })





  it('should return an empty object when EMPTY_MODEL action is dispatched', () => {

    var previousState = {
      foo: 'bar'
    }

    var action = {
      type: 'EMPTY_MODEL'
    }
    var state = reducer.model(previousState, action)

    state.should.be.an.Object
    Object.keys(state).length.should.equal(0)
  });

});
