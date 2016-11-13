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

  })





})
