var associationReducerGenerator = require('../../../src/associationReducerGenerator')


var assert = require('chai').assert;
var should = require('chai').should()

var reducer = associationReducerGenerator('channel', 'tag')

describe('associationReducerGenerator -- global properties', function() {
  it('should have a isFindingChannelTags property', function() {
    assert.equal(true, reducer.hasOwnProperty('isFindingChannelTags'));
  });

  it('should have a channelTags property', function() {
    assert.equal(true, reducer.hasOwnProperty('channelTags'));
  });
});
