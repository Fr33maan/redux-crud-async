import associationActionTypeGenerator from '../../src/associationActionTypeGenerator'

var assert = require('chai').assert;
var actionTypes = associationActionTypeGenerator('channel', 'person')

describe('associationActionTypeGenerator', function() {
  it('should have FIND actions', function() {
    assert.equal(true, actionTypes.hasOwnProperty('FIND_CHANNEL_PEOPLE_START'));
    assert.equal(true, actionTypes.hasOwnProperty('FIND_CHANNEL_PEOPLE_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('FIND_CHANNEL_PEOPLE_ERROR'));

    assert.equal('FIND_CHANNEL_PEOPLE_START',   actionTypes.FIND_CHANNEL_PEOPLE_START);
    assert.equal('FIND_CHANNEL_PEOPLE_SUCCESS', actionTypes.FIND_CHANNEL_PEOPLE_SUCCESS);
    assert.equal('FIND_CHANNEL_PEOPLE_ERROR',   actionTypes.FIND_CHANNEL_PEOPLE_ERROR);
  });


  it('should have ADD actions', function() {
    assert.equal(true, actionTypes.hasOwnProperty('ADD_PERSON_TO_CHANNEL_START'));
    assert.equal(true, actionTypes.hasOwnProperty('ADD_PERSON_TO_CHANNEL_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('ADD_PERSON_TO_CHANNEL_ERROR'));

    assert.equal('ADD_PERSON_TO_CHANNEL_START',    actionTypes.ADD_PERSON_TO_CHANNEL_START);
    assert.equal('ADD_PERSON_TO_CHANNEL_SUCCESS',  actionTypes.ADD_PERSON_TO_CHANNEL_SUCCESS);
    assert.equal('ADD_PERSON_TO_CHANNEL_ERROR',    actionTypes.ADD_PERSON_TO_CHANNEL_ERROR);
  });

  it('should have REMOVE actions', function() {
    assert.equal(true, actionTypes.hasOwnProperty('REMOVE_PERSON_FROM_CHANNEL_START'));
    assert.equal(true, actionTypes.hasOwnProperty('REMOVE_PERSON_FROM_CHANNEL_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('REMOVE_PERSON_FROM_CHANNEL_ERROR'));

    assert.equal('REMOVE_PERSON_FROM_CHANNEL_START',    actionTypes.REMOVE_PERSON_FROM_CHANNEL_START);
    assert.equal('REMOVE_PERSON_FROM_CHANNEL_SUCCESS',  actionTypes.REMOVE_PERSON_FROM_CHANNEL_SUCCESS);
    assert.equal('REMOVE_PERSON_FROM_CHANNEL_ERROR',    actionTypes.REMOVE_PERSON_FROM_CHANNEL_ERROR);
  });

});
