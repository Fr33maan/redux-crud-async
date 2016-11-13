import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

var rewire        = require('rewire')
var nock          = require('nock')
var should        = require('chai').should()

var primaryActionGenerator  = rewire('../../../src/primaryActionGenerator')
var actionTypes   = require('../../../src/primaryActionTypeGenerator')('channel')

var actions       = primaryActionGenerator
const middlewares = [ thunk ]
const mockStore   = configureMockStore(middlewares)

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  before('rewire host with test values', () => {
    primaryActionGenerator.__set__({now : () => 123})
    primaryActionGenerator.__set__({'uuid.v4' : () => 'uuid'})

    actions = actions('channel', {host : 'http://test.com'})
  })


  describe('findChannel', () => {

    it('should dispatch CHANNEL_FIND_START and CHANNEL_FIND_SUCCESS when findChannel action is dispatched', (done) => {
      nock('http://test.com')
      .get('/channels/667')
      .reply(200, { data: {name: 'im a channel'}})

      const expectedActions = [
        { type: actionTypes.CHANNEL_FIND_START },
        { type: actionTypes.CHANNEL_FIND_SUCCESS, receivedAt : 123, channel: {name: 'im a channel'} }
      ]
      const store = mockStore({ channel: {} })

      store.dispatch(actions.findChannel(667))
      .then(() => { // return of async actions
        store.getActions().should.eql(expectedActions)
      })
      .then(done)
      .catch(done)
    })

    it('should dispatch CHANNEL_FIND_START and CHANNEL_FIND_ERROR when findChannels action is dispatched and an error happen', (done) => {
      nock('http://test.com')
      .get('/channels/789')
      .reply(500, {message : 'this is an error'})

      const expectedActions = [
        { type: actionTypes.CHANNEL_FIND_START },
        { type: actionTypes.CHANNEL_FIND_ERROR, data: 789, error: {message : 'this is an error'} }
      ]
      const store = mockStore({ channel: {} })

      store.dispatch(actions.findChannel(789))
      .then(() => { // return of async actions
        store.getActions().should.eql(expectedActions)
      })
      .then(done)
      .catch(done)
    })

    it('should dispatch CHANNEL_FIND_START and CHANNEL_FIND_ERROR when findChannel action is dispatched without modelId', (done) => {
      nock('http://test.com')
      .get('/channels')
      .reply(500, {message : 'this is an error'})

      const expectedActions = [
        { type: actionTypes.CHANNEL_FIND_ERROR, data: undefined, error: {message : 'no modelId given for action findChannel'} }
      ]
      const store = mockStore({ channels: [] })

      store.dispatch(actions.findChannel())
      .then(() => { // return of async actions
        store.getActions().should.eql(expectedActions)
      })
      .then(done)
      .catch(done)
    })
  })


  describe('findChannels', () => {

    it('should dispatch CHANNELS_FIND_START and CHANNELS_FIND_SUCCESS when findChannels action is dispatched', (done) => {
      nock('http://test.com')
      .get('/channels')
      .reply(200, { data: [{name: 'im a channel'}] })

      const expectedActions = [
        { type: actionTypes.CHANNELS_FIND_START },
        { type: actionTypes.CHANNELS_FIND_SUCCESS, receivedAt : 123, channels: [{name: 'im a channel', tmpId: 'uuid'}] }
      ]
      const store = mockStore({ channels: [] })

      store.dispatch(actions.findChannels(''))
      .then(() => { // return of async actions
        store.getActions().should.eql(expectedActions)
      })
      .then(done)
      .catch(done)
    })

    it('should dispatch CHANNELS_FIND_START and CHANNELS_FIND_ERROR when findChannels action is dispatched and an error happen', (done) => {
      nock('http://test.com')
      .get('/channels')
      .reply(500, {message : 'this is an error'})

      const expectedActions = [
        { type: actionTypes.CHANNELS_FIND_START },
        { type: actionTypes.CHANNELS_FIND_ERROR, error: {message : 'this is an error'} }
      ]
      const store = mockStore({ channels: [] })

      store.dispatch(actions.findChannels(''))
      .then(() => { // return of async actions
        store.getActions().should.eql(expectedActions)
      })
      .then(done)
      .catch(done)
    })
  })


  describe('createChannels', () => {

    it('should dispatch CHANNEL_CREATE_START and CHANNEL_CREATE_SUCCESS when createChannel action is dispatched', (done) => {

      var channelToCreate = {
        foo : 'bar'
      }

      var channelWithTmpId = {
        ...channelToCreate,
        tmpId : 'uuid'
      }

      nock('http://test.com')
      .post('/channels', channelToCreate)
      .reply(200)

      const expectedActions = [
        {
          type    : actionTypes.CHANNEL_CREATE_START,
          channel : channelWithTmpId
        },{
          type    : actionTypes.CHANNEL_CREATE_SUCCESS,
          channel : channelWithTmpId,
          message : 'channel has been created'
        }
      ]

      const store = mockStore({ channels: [] })

      store.dispatch(actions.createChannel(channelToCreate))
      .then(() => { // return of async actions
        store.getActions().should.eql(expectedActions)
      })
      .then(done)
      .catch(done)
    })

    it('should dispatch CHANNEL_CREATE_START and CHANNEL_CREATE_ERROR when createChannel action is dispatched and an error happen', (done) => {

      var channelToCreate = {
        foo : 'bar'
      }

      var channelWithTmpId = {
        ...channelToCreate,
        tmpId : 'uuid'
      }

      nock('http://test.com')
      .post('/channels', channelToCreate)
      .reply(500, {message : 'this is an error'})

      const expectedActions = [
        {
          type    : actionTypes.CHANNEL_CREATE_START,
          channel : channelWithTmpId
        },{
          type    : actionTypes.CHANNEL_CREATE_ERROR,
          data    : channelWithTmpId,
          error   : {message : 'this is an error'}
        }
      ]

      const store = mockStore({ channels: [] })

      store.dispatch(actions.createChannel(channelToCreate))
      .then(() => { // return of async actions
        store.getActions().should.eql(expectedActions)
      })
      .then(done)
      .catch(done)
    })
  })

})
