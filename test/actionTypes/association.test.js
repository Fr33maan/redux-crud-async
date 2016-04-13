import associationActionTypeGenerator from '../../generators/associationActionTypeGenerator'

var assert = require('chai').assert;
var actionTypes = associationActionTypeGenerator('channel', 'tag')

describe('associationActionTypeGenerator', function() {
  it('should have FIND actions', function() {
    assert.equal(true, actionTypes.hasOwnProperty('FIND_CHANNEL_TAGS_START'));
    assert.equal(true, actionTypes.hasOwnProperty('FIND_CHANNEL_TAGS_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('FIND_CHANNEL_TAGS_ERROR'));

    assert.equal('FIND_CHANNEL_TAGS_START',   actionTypes.FIND_CHANNEL_TAGS_START);
    assert.equal('FIND_CHANNEL_TAGS_SUCCESS', actionTypes.FIND_CHANNEL_TAGS_SUCCESS);
    assert.equal('FIND_CHANNEL_TAGS_ERROR',   actionTypes.FIND_CHANNEL_TAGS_ERROR);
  });


  it('should have ADD actions', function() {
    assert.equal(true, actionTypes.hasOwnProperty('ADD_TAG_TO_CHANNEL_START'));
    assert.equal(true, actionTypes.hasOwnProperty('ADD_TAG_TO_CHANNEL_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('ADD_TAG_TO_CHANNEL_ERROR'));

    assert.equal('ADD_TAG_TO_CHANNEL_START',    actionTypes.ADD_TAG_TO_CHANNEL_START);
    assert.equal('ADD_TAG_TO_CHANNEL_SUCCESS',  actionTypes.ADD_TAG_TO_CHANNEL_SUCCESS);
    assert.equal('ADD_TAG_TO_CHANNEL_ERROR',    actionTypes.ADD_TAG_TO_CHANNEL_ERROR);
  });

  it('should have REMOVE actions', function() {
    assert.equal(true, actionTypes.hasOwnProperty('REMOVE_TAG_FROM_CHANNEL_START'));
    assert.equal(true, actionTypes.hasOwnProperty('REMOVE_TAG_FROM_CHANNEL_SUCCESS'));
    assert.equal(true, actionTypes.hasOwnProperty('REMOVE_TAG_FROM_CHANNEL_ERROR'));

    assert.equal('REMOVE_TAG_FROM_CHANNEL_START',    actionTypes.REMOVE_TAG_FROM_CHANNEL_START);
    assert.equal('REMOVE_TAG_FROM_CHANNEL_SUCCESS',  actionTypes.REMOVE_TAG_FROM_CHANNEL_SUCCESS);
    assert.equal('REMOVE_TAG_FROM_CHANNEL_ERROR',    actionTypes.REMOVE_TAG_FROM_CHANNEL_ERROR);
  });

});
