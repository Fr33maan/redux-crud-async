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

  //  http://www.kammerl.de/ascii/AsciiSignature.php
  //  nancyj-underlined

  //   a88888b.  888888ba   88888888b  .d888888  d888888P  88888888b
  //  d8'   `88  88    `8b  88        d8'    88     88     88
  //  88        a88aaaa8P' a88aaaa    88aaaaa88a    88    a88aaaa
  //  88         88   `8b.  88        88     88     88     88
  //  Y8.   .88  88     88  88        88     88     88     88
  //   Y88888P'  dP     dP  88888888P 88     88     dP     88888888P
  //  ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo

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

        creatingModel.hasOwnProperty('tmpId').should.be.true
        creatingModel.hasOwnProperty('creating').should.be.true
        creatingModel.hasOwnProperty('created').should.be.true

        creatingModel.tmpId.should.equal('uuid')
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



  //  http://www.kammerl.de/ascii/AsciiSignature.php
  //  nancyj-underlined

  // dP     dP  888888ba  888888ba   .d888888  d888888P  88888888b
  // 88     88  88    `8b 88    `8b d8'    88     88     88
  // 88     88 a88aaaa8P' 88     88 88aaaaa88a    88    a88aaaa
  // 88     88  88        88     88 88     88     88     88
  // Y8.   .8P  88        88    .8P 88     88     88     88
  // `Y88888P'  dP        8888888P  88     88     dP     88888888P
  // oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo


  describe('UPDATE', () => {
    describe('MODEL_UPDATE_START', () => {

      it('should set "updating" to true in the updated model in the state on MODEL_UPDATE_START', () => {

        var previousState = [{
          id : 1,
          foo: 'bar'
        }, {
          id : 2,
          bar: 'foo'
        }]

        var action = {
          type: 'MODEL_UPDATE_START',
          model: {
            id : 1,
            foo: 'boo'
          }
        }

        var state = reducer.models(previousState, action)

        state.length.should.equal(2)

        var updatingModel = state.filter(m => {
          return m.id === 1
        })[0]

        // Checking property existance
        updatingModel.hasOwnProperty('updating').should.be.true

        // Checking property values
        updatingModel.foo.should.equal('boo')
        updatingModel.updating.should.be.true

      });
    })

    describe('MODEL_UPDATE_SUCCESS', () => {

      it('should set the model updated on MODELS_UPDATE_SUCCESS', () => {

        // Model has already been updated in state with START action
        var previousState = [{
          id : 1,
          foo: 'boo'
        }, {
          id : 2,
          bar: 'foo'
        }]

        var action = {
          type: 'MODEL_UPDATE_SUCCESS',
          model: {
            id : 1,
            foo: 'boo'
          }
        }

        var state = reducer.models(previousState, action)

        state.length.should.equal(2)

        var updatingModel = state.filter(m => {
          return m.id === 1
        })[0]

        // Checking property existance
        updatingModel.hasOwnProperty('updating').should.be.true

        // Checking property values
        updatingModel.foo.should.equal('boo')
        updatingModel.updating.should.be.false

      });
    })

    describe('MODEL_UPDATE_ERROR', () => {

      it('should reset the model in state on MODEL_UPDATE_ERROR', () => {

        // Model has already been updated in state with START action
        var previousState = [{
          id : 1,
          foo: 'boo'
        }, {
          id : 2,
          bar: 'foo'
        }]

        var action = {
          type: 'MODEL_UPDATE_ERROR',
          data: {
            id : 1,
            foo: 'bar'
          }
        }

        var state = reducer.models(previousState, action)

        state.length.should.equal(2)

        var updatingModel = state.filter(m => {
          return m.id === 1
        })[0]

        // Checking property existance
        updatingModel.hasOwnProperty('updating').should.be.true

        // Checking property values
        updatingModel.foo.should.equal('bar')
        updatingModel.updating.should.be.false

      });
    })
  })



  //  http://www.kammerl.de/ascii/AsciiSignature.php
  //  nancyj-underlined

  // 888888ba   88888888b .d88888b  d888888P  888888ba   .88888.  dP    dP
  // 88    `8b  88        88.    "'    88     88    `8b d8'   `8b Y8.  .8P
  // 88     88 a88aaaa    `Y88888b.    88    a88aaaa8P' 88     88  Y8aa8P
  // 88     88  88              `8b    88     88   `8b. 88     88    88
  // 88    .8P  88        d8'   .8P    88     88     88 Y8.   .8P    88
  // 8888888P   88888888P  Y88888P     dP     dP     dP  `8888P'     dP
  // oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo

  describe('DESTROY', () => {
    describe('MODEL_DESTROY_START', () => {

      it('should set "destoying" to true in the destoyed model in the state on MODEL_DESTROY_START', () => {

        var previousState = [{
          id        : 1,
          foo       : 'bar',
          destroying: false
        }, {
          id        : 2,
          bar       : 'foo',
          destroying: false
        }]

        var action = {
          type: 'MODEL_DESTROY_START',
          modelId: 1
        }

        var state = reducer.models(previousState, action)

        state.length.should.equal(2)

        var destroyingModel = state.filter(m => {
          return m.id === 1
        })[0]

        // Checking property existance
        destroyingModel.hasOwnProperty('destroying').should.be.true

        // Checking property values
        destroyingModel.destroying.should.be.true

      });
    })

    describe('MODEL_DESTROY_SUCCESS', () => {

      it('should set the model destoyed on MODELS_DESTROY_SUCCESS', () => {

        // Model has already been set to 'destroying' in state with START action
        var previousState = [{
          id        : 1,
          foo       : 'bar',
          destroying: true
        }, {
          id        : 2,
          bar       : 'foo',
          destroying: false
        }]

        var action = {
          type   : 'MODEL_DESTROY_SUCCESS',
          modelId: 1
        }

        var state = reducer.models(previousState, action)

        state.length.should.equal(1)
      });
    })

    describe('MODEL_DESTROY_ERROR', () => {

      it('should reset the model in state on MODEL_DESTROY_ERROR', () => {

        // Model has already been set to 'destroying' in state with START action
        var previousState = [{
          id        : 1,
          foo       : 'bar',
          destroying: true
        }, {
          id        : 2,
          bar       : 'foo',
          destroying: false
        }]

        var action = {
          type   : 'MODEL_DESTROY_ERROR',
          modelId: 1
        }

        var state = reducer.models(previousState, action)

        state.length.should.equal(2)

        var destroyingModel = state.filter(m => {
          return m.id === 1
        })[0]

        // Checking property existance
        destroyingModel.hasOwnProperty('destroying').should.be.true

        // Checking property values
        destroyingModel.destroying.should.be.false

      });
    })
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
});
