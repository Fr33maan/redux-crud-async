var primaryReducerGenerator = require('../../../src/primaryReducerGenerator')

var assert = require('chai').assert;
var should = require('chai').should()

var reducer = primaryReducerGenerator('model')

describe('primaryReducerGenerator -- #models', function() {

  it('default state should be an empty array', () => {
    var previousState = undefined
    var action = {
      type: 'NONE'
    }
    var state = reducer.models(previousState, action)

    state.should.be.an.Array
    state.should.be.empty
  });

  describe('FIND', () => {

      it('should return an array of objects when MODELS_FIND_SUCCESS action is dispatched with an array of objects', () => {
        var previousState = []
        var nextState = [{
          foo: 'bar'
        }, {
          bar: 'foo'
        }]
        var action = {
          type: 'MODELS_FIND_SUCCESS',
          models: nextState
        }
        var state = reducer.models(previousState, action)

        state.should.be.an.Array
        state.should.eql([{
          foo: 'bar',
          created: true,
          creating: false
        }, {
          bar: 'foo',
          created: true,
          creating: false
        }])
      });

      it('should return an empty array when MODELS_FIND_SUCCESS action is dispatched with an empty array', () => {
        var previousState = [{
          foo: 'bar'
        }, {
          bar: 'foo'
        }]
        var action = {
          type: 'MODELS_FIND_SUCCESS',
          models: []
        }
        var state = reducer.models(previousState, action)

        state.should.be.an.Array
        state.should.be.empty
      });

  })


  describe('CREATE', () => {
    describe('MODEL_CREATE_START', () => {

      it('should add the model to the models array on MODEL_CREATE_START', () => {

        var previousState = [{
          foo: 'bar'
        }, {
          bar: 'foo'
        }]

        var action = {
          type: 'MODEL_CREATE_START',
          model: {
            far: 'boo'
          }
        }

        var state = reducer.models(previousState, action)

        state.length.should.equal(3)

        var creatingModel = state.filter(m => {
          return m.far === 'boo'
        })[0]

        creatingModel.hasOwnProperty('creating').should.be.true
        creatingModel.hasOwnProperty('created').should.be.true

        creatingModel.creating.should.be.true
        creatingModel.created.should.be.false

      });
    })

    describe('MODEL_CREATE_SUCCESS', () => {

      it('should set the model created on MODELS_CREATE_SUCCESS', () => {

        var creatingModel = {
          foo      : 'bar',
          tmpId    : 1,
          created  : false,
          creating : true
        }

        var previousState = [creatingModel]

        var action = {
          type: 'MODEL_CREATE_SUCCESS',
          model: creatingModel
        }

        var state = reducer.models(previousState, action)
        var createdModel = state[0]

        createdModel.hasOwnProperty('creating').should.be.true
        createdModel.hasOwnProperty('created').should.be.true

        createdModel.creating.should.be.false
        createdModel.created.should.be.true

      });
    })

    describe('MODEL_CREATE_ERROR', () => {

      it('should remove the model from state on MODEL_CREATE_ERROR', () => {

        var createdModel = {
          bar   : 'foo'
        }

        var creatingModel = {
          foo      : 'bar',
          tmpId    : 1
        }

        var previousState = [createdModel, creatingModel]

        var action = {
          type  : 'MODEL_CREATE_ERROR',
          data  : creatingModel,
          error : 'im an error'
        }

        var state = reducer.models(previousState, action)

        state.length.should.equal(1)
        state.filter(obj => obj.tmpId === 1).length.should.be.equal(0)

      });
    })

    describe('EMPTY_MODELS', function(){

        it('should return an empty object when EMPTY_MODEL action is dispatched', () => {

          var previousState = [{
            foo: 'bar'
          }]

          var action = {
            type: 'EMPTY_MODELS'
          }
          var state = reducer.models(previousState, action)

          state.should.be.an.Array
          state.length.should.equal(0)
        });
    })
  })
});
