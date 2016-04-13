import primaryActionTypeGenerator from '../../generators/primaryActionTypeGenerator'

var assert = require('chai').assert;
var actionTypes = primaryActionTypeGenerator('model')

describe('primaryActionTypeGenerator', function() {
  it('should have SINGLE and PLURAL CREATE actions', function() {
    assert.equal(true, actionTypes.hasOwnProperty('MODEL_CREATE_START'));
    assert.equal(true, actionTypes.hasOwnProperty('MODEL_CREATE_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('MODEL_CREATE_ERROR'));

    assert.equal('MODEL_CREATE_START', actionTypes.MODEL_CREATE_START);
    assert.equal('MODEL_CREATE_SUCCESS', actionTypes.MODEL_CREATE_SUCCESS);
    assert.equal('MODEL_CREATE_ERROR', actionTypes.MODEL_CREATE_ERROR);

    assert.equal(true, actionTypes.hasOwnProperty('MODELS_CREATE_START'));
    assert.equal(true, actionTypes.hasOwnProperty('MODELS_CREATE_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('MODELS_CREATE_ERROR'));

    assert.equal('MODELS_CREATE_START', actionTypes.MODELS_CREATE_START);
    assert.equal('MODELS_CREATE_SUCCESS', actionTypes.MODELS_CREATE_SUCCESS);
    assert.equal('MODELS_CREATE_ERROR', actionTypes.MODELS_CREATE_ERROR);
  });


  it('should have SINGLE and PLURAL FIND actions', function() {
    assert.equal(true, actionTypes.hasOwnProperty('MODEL_FIND_START'));
    assert.equal(true, actionTypes.hasOwnProperty('MODEL_FIND_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('MODEL_FIND_ERROR'));

    assert.equal('MODEL_FIND_START', actionTypes.MODEL_FIND_START);
    assert.equal('MODEL_FIND_SUCCESS', actionTypes.MODEL_FIND_SUCCESS);
    assert.equal('MODEL_FIND_ERROR', actionTypes.MODEL_FIND_ERROR);

    assert.equal(true, actionTypes.hasOwnProperty('MODELS_FIND_START'));
    assert.equal(true, actionTypes.hasOwnProperty('MODELS_FIND_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('MODELS_FIND_ERROR'));

    assert.equal('MODELS_FIND_START', actionTypes.MODELS_FIND_START);
    assert.equal('MODELS_FIND_SUCCESS', actionTypes.MODELS_FIND_SUCCESS);
    assert.equal('MODELS_FIND_ERROR', actionTypes.MODELS_FIND_ERROR);
  });

  it('should have SINGLE and PLURAL UPDATE actions', function() {
    assert.equal(true, actionTypes.hasOwnProperty('MODEL_UPDATE_START'));
    assert.equal(true, actionTypes.hasOwnProperty('MODEL_UPDATE_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('MODEL_UPDATE_ERROR'));

    assert.equal('MODEL_UPDATE_START', actionTypes.MODEL_UPDATE_START);
    assert.equal('MODEL_UPDATE_SUCCESS', actionTypes.MODEL_UPDATE_SUCCESS);
    assert.equal('MODEL_UPDATE_ERROR', actionTypes.MODEL_UPDATE_ERROR);

    assert.equal(true, actionTypes.hasOwnProperty('MODELS_UPDATE_START'));
    assert.equal(true, actionTypes.hasOwnProperty('MODELS_UPDATE_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('MODELS_UPDATE_ERROR'));

    assert.equal('MODELS_UPDATE_START', actionTypes.MODELS_UPDATE_START);
    assert.equal('MODELS_UPDATE_SUCCESS', actionTypes.MODELS_UPDATE_SUCCESS);
    assert.equal('MODELS_UPDATE_ERROR', actionTypes.MODELS_UPDATE_ERROR);
  });


  it('should have SINGLE and PLURAL DESTROY actions', function() {
    assert.equal(true, actionTypes.hasOwnProperty('MODEL_DESTROY_START'));
    assert.equal(true, actionTypes.hasOwnProperty('MODEL_DESTROY_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('MODEL_DESTROY_ERROR'));

    assert.equal('MODEL_DESTROY_START', actionTypes.MODEL_DESTROY_START);
    assert.equal('MODEL_DESTROY_SUCCESS', actionTypes.MODEL_DESTROY_SUCCESS);
    assert.equal('MODEL_DESTROY_ERROR', actionTypes.MODEL_DESTROY_ERROR);

    assert.equal(true, actionTypes.hasOwnProperty('MODELS_DESTROY_START'));
    assert.equal(true, actionTypes.hasOwnProperty('MODELS_DESTROY_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('MODELS_DESTROY_ERROR'));

    assert.equal('MODELS_DESTROY_START', actionTypes.MODELS_DESTROY_START);
    assert.equal('MODELS_DESTROY_SUCCESS', actionTypes.MODELS_DESTROY_SUCCESS);
    assert.equal('MODELS_DESTROY_ERROR', actionTypes.MODELS_DESTROY_ERROR);
  });
});
