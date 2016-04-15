var associationReducerGenerator = require('../../../src/associationReducerGenerator')

var assert = require('chai').assert;
var should = require('chai').should()

var reducer = associationReducerGenerator('channel', 'tag')

describe('associationReducerGenerator -- #channelTags', function() {

  describe('#findChannelTags', () => {

    it('default state should be an empty object', function() {
      var previousState = undefined
      var action = {
        type: 'NONE'
      }
      var state = reducer.channelTags(previousState, action)

      state.should.be.an.Array
      state.should.be.empty
    });

    it('should return an array with an object when FIND_CHANNEL_TAGS_SUCCESS action is dispatched', () => {
      var previousState = []
      var expectedState = [{
        foo: 'bar',
        created: true,
        creating: false
      }]

      var action = {
        type: 'FIND_CHANNEL_TAGS_SUCCESS',
        channelTags: [{
          foo: 'bar'
        }]
      }

      var state = reducer.channelTags(previousState, action)

      state.should.be.an.Object
      state.should.eql(expectedState)
    });


    it('should return an empty array when FIND_CHANNEL_TAGS_ERROR action is dispatched', () => {

      var action = {
        type: 'FIND_CHANNEL_TAGS_ERROR',
        data: [{
          foo: 'bar'
        }],
        error: 'something bad happened on the server'
      }

      var state = reducer.channelTags([{
        foo: 'bar'
      }], action)

      state.should.be.an.Array
      state.length.should.equal(0)
    });
  })

  describe('#addTagToChannel', () => {

    it('should add an uncreated tag to channelTags when dispatching ADD_TAG_TO_CHANNEL_START', () => {

      var previousState = [{
        bar: 'foo',
        created: true,
        creating: false
      }]

      var action = {
        type: 'ADD_TAG_TO_CHANNEL_START',
        channelTag: {
          foo: 'bar',
          tmpId: 123
        }
      }

      var state = reducer.channelTags(previousState, action)

      var expectedState = [
        ...previousState, {
          foo: 'bar',
          created: false,
          creating: true,
          tmpId: 123
        }
      ]

      state.should.be.an.Array
      state.length.should.equal(2)
      state.should.eql(expectedState)
    })


    it('should add an uncreated tag to channelTags when dispatching ADD_TAG_TO_CHANNEL_SUCCESS', () => {

      var previousState = [{
        bar: 'foo',
        created: true,
        creating: false,
        tmpId: 123
      }, {
        foo: 'bar',
        created: false,
        creating: true,
        tmpId: 456
      }]

      var action = {
        type: 'ADD_TAG_TO_CHANNEL_SUCCESS',
        channelTag: previousState[1]
      }

      var state = reducer.channelTags(previousState, action)

      var expectedState = [
        previousState[0], {
          ...previousState[1],
          created: true,
          creating: false
        }
      ]

      state.should.be.an.Array
      state.length.should.equal(2)
      state.should.eql(expectedState)
    })



    it('should remove an uncreated tag from channelTags when dispatching ADD_TAG_TO_CHANNEL_ERROR', () => {

      var previousState = [{
        bar: 'foo',
        created: true,
        creating: false,
        tmpId: 123
      }, {
        foo: 'bar',
        created: false,
        creating: true,
        tmpId: 456
      }]

      var action = {
        type: 'ADD_TAG_TO_CHANNEL_ERROR',
        channelTag: previousState[1]
      }

      var state = reducer.channelTags(previousState, action)

      var expectedState = [
        previousState[0]
      ]

      state.should.be.an.Array
      state.length.should.equal(1)
      state.should.eql(expectedState)
    })

  })

  describe('#removeTagFromChannel', () => {

    it('should set the target tag to removing when dispatching REMOVE_TAG_FROM_CHANNEL_START', () => {
      var previousState = [{
        bar: 'foo',
        tmpId: 123
      }, {
        foo: 'bar',
        tmpId: 456
      }]

      var action = {
        type: 'REMOVE_TAG_FROM_CHANNEL_START',
        channelTag: previousState[1]
      }

      var state = reducer.channelTags(previousState, action)

      var expectedState = [
        previousState[0], {
          ...previousState[1],
          removing: true,
        }
      ]

      state.should.be.an.Array
      state.length.should.equal(2)
      state.should.eql(expectedState)
    })


    it('should remove the target tag from channelTags when dispatching REMOVE_TAG_FROM_CHANNEL_SUCCESS', () => {
      var previousState = [{
        bar: 'foo',
        tmpId: 123
      }, {
        foo: 'bar',
        tmpId: 456
      }]

      var action = {
        type: 'REMOVE_TAG_FROM_CHANNEL_SUCCESS',
        channelTag: previousState[1]
      }

      var state = reducer.channelTags(previousState, action)

      var expectedState = [
        previousState[0]
      ]

      state.should.be.an.Array
      state.length.should.equal(1)
      state.should.eql(expectedState)
    })


    it('should reset the target tag to removing=false when dispatching REMOVE_TAG_FROM_CHANNEL_ERROR', () => {
      var previousState = [{
        bar: 'foo',
        tmpId: 123
      }, {
        foo: 'bar',
        tmpId: 456,
        removing: true
      }]

      var action = {
        type: 'REMOVE_TAG_FROM_CHANNEL_ERROR',
        channelTag: previousState[1]
      }

      var state = reducer.channelTags(previousState, action)

      var expectedState = [
        previousState[0],
        {
          ...previousState[1],
          removing: false
        }
      ]

      state.should.be.an.Array
      state.length.should.equal(2)
      state.should.eql(expectedState)
    })

  })
});
