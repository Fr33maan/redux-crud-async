
// This file is used to run a unique test

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

var rewire        = require('rewire')
var nock          = require('nock')
var should        = require('chai').should()

var primaryActionGenerator  = rewire('../../src/primaryActionGenerator')
var actionTypes   = require('../../src/primaryActionTypeGenerator')('channel')

var actions       = primaryActionGenerator
const middlewares = [ thunk ]
const mockStore   = configureMockStore(middlewares)





describe('findChannels', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  before('rewire host with test values', () => {
    primaryActionGenerator.__set__({now : () => 123})
    primaryActionGenerator.__set__({'uuid.v4' : () => 'uuid'})

    actions = actions('channel', {host : 'http://test.com'})
  })

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
})
