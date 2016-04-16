var assert = require('chai').assert

import primaryActionTypeGenerator from '../../src/primaryActionTypeGenerator'

// Lets try an exotic pluralization
var actionTypes = primaryActionTypeGenerator('coach')

describe('primaryActionTypeGenerator', function() {
  it('should have SINGLE and PLURAL CREATE actions', function() {
    assert.equal(true, actionTypes.hasOwnProperty('COACH_CREATE_START'));
    assert.equal(true, actionTypes.hasOwnProperty('COACH_CREATE_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('COACH_CREATE_ERROR'));

    assert.equal('COACH_CREATE_START', actionTypes.COACH_CREATE_START);
    assert.equal('COACH_CREATE_SUCCESS', actionTypes.COACH_CREATE_SUCCESS);
    assert.equal('COACH_CREATE_ERROR', actionTypes.COACH_CREATE_ERROR);

    assert.equal(true, actionTypes.hasOwnProperty('COACHES_CREATE_START'));
    assert.equal(true, actionTypes.hasOwnProperty('COACHES_CREATE_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('COACHES_CREATE_ERROR'));

    assert.equal('COACHES_CREATE_START', actionTypes.COACHES_CREATE_START);
    assert.equal('COACHES_CREATE_SUCCESS', actionTypes.COACHES_CREATE_SUCCESS);
    assert.equal('COACHES_CREATE_ERROR', actionTypes.COACHES_CREATE_ERROR);
  });


  it('should have SINGLE and PLURAL FIND actions', function() {
    assert.equal(true, actionTypes.hasOwnProperty('COACH_FIND_START'));
    assert.equal(true, actionTypes.hasOwnProperty('COACH_FIND_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('COACH_FIND_ERROR'));

    assert.equal('COACH_FIND_START', actionTypes.COACH_FIND_START);
    assert.equal('COACH_FIND_SUCCESS', actionTypes.COACH_FIND_SUCCESS);
    assert.equal('COACH_FIND_ERROR', actionTypes.COACH_FIND_ERROR);

    assert.equal(true, actionTypes.hasOwnProperty('COACHES_FIND_START'));
    assert.equal(true, actionTypes.hasOwnProperty('COACHES_FIND_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('COACHES_FIND_ERROR'));

    assert.equal('COACHES_FIND_START', actionTypes.COACHES_FIND_START);
    assert.equal('COACHES_FIND_SUCCESS', actionTypes.COACHES_FIND_SUCCESS);
    assert.equal('COACHES_FIND_ERROR', actionTypes.COACHES_FIND_ERROR);
  });

  it('should have SINGLE and PLURAL UPDATE actions', function() {
    assert.equal(true, actionTypes.hasOwnProperty('COACH_UPDATE_START'));
    assert.equal(true, actionTypes.hasOwnProperty('COACH_UPDATE_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('COACH_UPDATE_ERROR'));

    assert.equal('COACH_UPDATE_START', actionTypes.COACH_UPDATE_START);
    assert.equal('COACH_UPDATE_SUCCESS', actionTypes.COACH_UPDATE_SUCCESS);
    assert.equal('COACH_UPDATE_ERROR', actionTypes.COACH_UPDATE_ERROR);

    assert.equal(true, actionTypes.hasOwnProperty('COACHES_UPDATE_START'));
    assert.equal(true, actionTypes.hasOwnProperty('COACHES_UPDATE_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('COACHES_UPDATE_ERROR'));

    assert.equal('COACHES_UPDATE_START', actionTypes.COACHES_UPDATE_START);
    assert.equal('COACHES_UPDATE_SUCCESS', actionTypes.COACHES_UPDATE_SUCCESS);
    assert.equal('COACHES_UPDATE_ERROR', actionTypes.COACHES_UPDATE_ERROR);
  });


  it('should have SINGLE and PLURAL DESTROY actions', function() {
    assert.equal(true, actionTypes.hasOwnProperty('COACH_DESTROY_START'));
    assert.equal(true, actionTypes.hasOwnProperty('COACH_DESTROY_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('COACH_DESTROY_ERROR'));

    assert.equal('COACH_DESTROY_START', actionTypes.COACH_DESTROY_START);
    assert.equal('COACH_DESTROY_SUCCESS', actionTypes.COACH_DESTROY_SUCCESS);
    assert.equal('COACH_DESTROY_ERROR', actionTypes.COACH_DESTROY_ERROR);

    assert.equal(true, actionTypes.hasOwnProperty('COACHES_DESTROY_START'));
    assert.equal(true, actionTypes.hasOwnProperty('COACHES_DESTROY_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('COACHES_DESTROY_ERROR'));

    assert.equal('COACHES_DESTROY_START', actionTypes.COACHES_DESTROY_START);
    assert.equal('COACHES_DESTROY_SUCCESS', actionTypes.COACHES_DESTROY_SUCCESS);
    assert.equal('COACHES_DESTROY_ERROR', actionTypes.COACHES_DESTROY_ERROR);
  });
});
