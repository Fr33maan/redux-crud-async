import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import rewire from 'rewire'

var should = require('chai').should()

var actionModule = rewire('../../../src/associationActionGenerator')
var actions
var actionTypes = require('../../../src/associationActionTypeGenerator')('channel', 'tag')

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  before('rewire host with test values', () => {
    actionModule.__set__({now : () => 123})
    actionModule.__set__({'uuid.v4' : () => 'uuid'})

    actions = actionModule('channel', 'tag', {host: 'http://test.com'})
  })


  //  http://www.kammerl.de/ascii/AsciiSignature.php
  //  nancyj-underlined

  //   88888888b dP 888888ba  888888ba
  //   88        88 88    `8b 88    `8b
  //  a88aaaa    88 88     88 88     88
  //   88        88 88     88 88     88
  //   88        88 88     88 88    .8P
  //   dP        dP dP     dP 8888888P
  //  oooooooooooooooooooooooooooooooooo


  describe('#findChannelTag', () => {

    it('should dispatch FIND_CHANNEL_TAGS_START and FIND_CHANNEL_TAGS_SUCCESS when findChannelTags action is dispatched', (done) => {
      nock('http://test.com')
      .get('/channels/667/tags')
      .reply(200, [{name: 'im a channel'}])

      const expectedActions = [
        { type: actionTypes.FIND_CHANNEL_TAGS_START },
        { type: actionTypes.FIND_CHANNEL_TAGS_SUCCESS, receivedAt : 123, parentId: '667', channelTags: [{name: 'im a channel', tmpId: 'uuid'}] }
      ]
      const store = mockStore({ channelTags: [] })

      store.dispatch(actions.findChannelTags('667'))
      .then(() => { // return of async actions
        store.getActions().should.eql(expectedActions)
      })
      .then(done)
      .catch(done)
    })

    it('should dispatch FIND_CHANNEL_TAGS_START and FIND_CHANNEL_TAGS_ERROR when findChannelTags action is dispatched and an error happen', (done) => {
      nock('http://test.com')
      .get('/channels/789/tags')
      .reply(500, {message : 'this is an error'})

      const expectedActions = [
        { type: actionTypes.FIND_CHANNEL_TAGS_START },
        { type: actionTypes.FIND_CHANNEL_TAGS_ERROR, data: 789, error: {message : 'this is an error'} }
      ]
      const store = mockStore({ channelTags: [] })

      store.dispatch(actions.findChannelTags(789))
      .then(() => { // return of async actions
        store.getActions().should.eql(expectedActions)
      })
      .then(done)
      .catch(done)
    })
  })


  //  http://www.kammerl.de/ascii/AsciiSignature.php
  //  nancyj-underlined

  //   .d888888  888888ba  888888ba
  //  d8'    88  88    `8b 88    `8b
  //  88aaaaa88a 88     88 88     88
  //  88     88  88     88 88     88
  //  88     88  88    .8P 88    .8P
  //  88     88  8888888P  8888888P
  //  ooooooooooooooooooooooooooooooo


  describe('#addTagToChannel', () => {

    it('should dispatch ADD_TAG_TO_CHANNEL_START and ADD_TAG_TO_CHANNEL_SUCCESS when addTagToChannel action is dispatched with an non existing modelToAssociate', (done) => {
      nock('http://test.com')
      .post('/channels/123/tags')
      .reply(200, { data: 'success' })

      const expectedActions = [
        { type: actionTypes.ADD_TAG_TO_CHANNEL_START, channelTag : {foo: 'bar', tmpId: 'uuid'} },
        { type: actionTypes.ADD_TAG_TO_CHANNEL_SUCCESS, channelTag: {foo: 'bar', tmpId: 'uuid'} }
      ]
      const store = mockStore({ channelTag: {} })

      store.dispatch(actions.addTagToChannel('123', {foo: 'bar'}))
      .then(() => { // return of async actions
        store.getActions().should.eql(expectedActions)
      })
      .then(done)
      .catch(done)
    })

    it('should dispatch ADD_TAG_TO_CHANNEL_START and ADD_TAG_TO_CHANNEL_SUCCESS when addTagToChannel action is dispatched with an existing modelToAssociate', (done) => {
      nock('http://test.com')
      .post('/channels/123/tags/456')
      .reply(200, { data: 'success' })

      const expectedActions = [
        { type: actionTypes.ADD_TAG_TO_CHANNEL_START, channelTag : {foo: 'bar', tmpId: 'uuid', id: 456} },
        { type: actionTypes.ADD_TAG_TO_CHANNEL_SUCCESS, channelTag: {foo: 'bar', tmpId: 'uuid', id: 456} }
      ]
      const store = mockStore({ channelTag: {} })

      store.dispatch(actions.addTagToChannel('123', {foo: 'bar', id: 456}))
      .then(() => { // return of async actions
        store.getActions().should.eql(expectedActions)
      })
      .then(done)
      .catch(done)
    })

    it('should dispatch ADD_TAG_TO_CHANNEL_START and ADD_TAG_TO_CHANNEL_ERROR when addTagToChannel action is dispatched and an error happen', (done) => {
      nock('http://test.com')
      .post('/channels/123/tags/456')
      .reply(500, { message: 'error' })

      const expectedActions = [
        { type: actionTypes.ADD_TAG_TO_CHANNEL_START, channelTag : {foo: 'bar', tmpId: 'uuid', id: 456} },
        { type: actionTypes.ADD_TAG_TO_CHANNEL_ERROR, data: {foo: 'bar', tmpId: 'uuid', id: 456}, error: { message: 'error' } }
      ]
      const store = mockStore({ channelTag: {} })

      store.dispatch(actions.addTagToChannel('123', {foo: 'bar', id: 456}))
      .then(() => { // return of async actions
        store.getActions().should.eql(expectedActions)
      })
      .then(done)
      .catch(done)
    })

    it('should dispatch NO_ACTION when addTagToChannel action is dispatched with an already associated modelToAssociate', () => {

      const store = mockStore({ channelTag: {} })
      store.dispatch(actions.addTagToChannel('123', {tmpId: 'uuid'}, [{tmpId: 'uuid'}]))
      store.getActions().should.eql([{type: 'NO_ACTION'}])

    })
  })


  //  http://www.kammerl.de/ascii/AsciiSignature.php
  //  nancyj-underlined

  //   888888ba   88888888b 8888ba.88ba   .88888.  dP     dP  88888888b
  //   88    `8b  88        88  `8b  `8b d8'   `8b 88     88  88
  //  a88aaaa8P' a88aaaa    88   88   88 88     88 88    .8P a88aaaa
  //   88   `8b.  88        88   88   88 88     88 88    d8'  88
  //   88     88  88        88   88   88 Y8.   .8P 88  .d8P   88
  //   dP     dP  88888888P dP   dP   dP  `8888P'  888888'    88888888P
  //  oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo


    describe('#removeTagFromChannel', () => {


      it('should dispatch REMOVE_TAG_FROM_CHANNEL_START and REMOVE_TAG_FROM_CHANNEL_ERROR when modelToDissociate.id is undefined', (done) => {

        const tagToDissociate = {foo: 'bar', tmpId: 'uuid'}
        const expectedError = 'no id provided in modelToDissociate : tags'

        const expectedActions = [
          { type: actionTypes.REMOVE_TAG_FROM_CHANNEL_START, channelTag : tagToDissociate },
          { type: actionTypes.REMOVE_TAG_FROM_CHANNEL_ERROR, data: tagToDissociate, error: expectedError}
        ]
        const store = mockStore({ channelTag: {} })

        store.dispatch(actions.removeTagFromChannel('123', tagToDissociate))
        .then(() => { // return of async actions
          store.getActions().should.eql(expectedActions)
        })
        .then(done)
        .catch(done)
      })


      it('should dispatch REMOVE_TAG_FROM_CHANNEL_START and REMOVE_TAG_FROM_CHANNEL_SUCCESS when removeTagFromChannel action is dispatched', (done) => {
        nock('http://test.com')
        .delete('/channels/123/tags/456')
        .reply(200, { data: 'success' })

        const tagToDissociate = {foo: 'bar', tmpId: 'uuid', id: 456}

        const expectedActions = [
          { type: actionTypes.REMOVE_TAG_FROM_CHANNEL_START, channelTag : tagToDissociate },
          { type: actionTypes.REMOVE_TAG_FROM_CHANNEL_SUCCESS, channelTag: tagToDissociate }
        ]
        const store = mockStore({ channelTag: {} })

        store.dispatch(actions.removeTagFromChannel('123', tagToDissociate))
        .then(() => { // return of async actions
          store.getActions().should.eql(expectedActions)
        })
        .then(done)
        .catch(done)
      })


      it('should dispatch REMOVE_TAG_FROM_CHANNEL_START and REMOVE_TAG_FROM_CHANNEL_ERROR when ann error happen', (done) => {
        nock('http://test.com')
        .delete('/channels/123/tags/456')
        .reply(500, {message : 'this is an error'})

        const tagToDissociate = {foo: 'bar', tmpId: 'uuid', id: 456}

        const expectedActions = [
          { type: actionTypes.REMOVE_TAG_FROM_CHANNEL_START, channelTag : tagToDissociate },
          { type: actionTypes.REMOVE_TAG_FROM_CHANNEL_ERROR, data: tagToDissociate, error: {message : 'this is an error'}}
        ]
        const store = mockStore({ channelTag: {} })

        store.dispatch(actions.removeTagFromChannel('123', tagToDissociate))
        .then(() => { // return of async actions
          store.getActions().should.eql(expectedActions)
        })
        .then(done)
        .catch(done)
      })
  })
})
