var associationReducerGenerator = require('../../../src/associationReducerGenerator')

var assert = require('chai').assert;
var should = require('chai').should()

var reducer = associationReducerGenerator('channel', 'tag')

describe('associationReducerGenerator -- #isFindingChannelTags', function() {


  it('isFindingChannelTags default state should be false', () => {

    var previousState = undefined
    var action = {
      type: 'NONE'
    }
    var state = reducer.isFindingChannelTags(previousState, action)

    state.should.be.false

  })


  it('isFindingModel should return true when FIND_PRIMARY_ASSOCIATED_MODELS_START actions is dispatched ', function() {
    assert.equal(true, reducer.isFindingChannelTags(undefined, {
      type: 'FIND_CHANNEL_TAGS_START'
    }))
  })

  it('isFindingModel should return false when FIND_PRIMARY_ASSOCIATED_MODELS_SUCCESS actions is dispatched ', function() {

    var previousState = true

    assert.equal(false, reducer.isFindingChannelTags(previousState, {
      type: 'FIND_CHANNEL_TAGS_SUCCESS'
    }))
  })

  it('isFindingModel should return false when FIND_PRIMARY_ASSOCIATED_MODELS_ERROR actions is dispatched ', function() {

    var previousState = true

    assert.equal(false, reducer.isFindingChannelTags(previousState, {
      type: 'FIND_CHANNEL_TAGS_ERROR'
    }))
  })
})
