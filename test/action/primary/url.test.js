var rewire = require('rewire')
var primaryActionGenerator = rewire('../../../src/primaryActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()

var spy = {}
var d = (action) => action
var actionModule, singlizedActions

describe('primaryActionGenerator', function() {

  before('Rewire and spy axios module and host config', () => {
    var axios = {
      get : arg => {
        return new Promise(resolve => {resolve({data:{data:[]}}); })
      },
      post : model => {
        return new Promise(resolve => {resolve({data:{data:[]}}); })
      }
    }

    spy.get  = sinon.spy(axios, 'get')
    spy.post = sinon.spy(axios, 'post')

    primaryActionGenerator.__set__({axios})

    const hostConfig = {
      host : 'host'
    }

    actionModule     = primaryActionGenerator('channel', hostConfig)
    singlizedActions = primaryActionGenerator('coach', {...hostConfig, pluralizeModels: false})

  })

  beforeEach('reset spy states', () => {
    spy.get.reset()
    spy.post.reset()
  })

  describe('find requests', () => {

    it('#findChannel - pluralized', () => {
      actionModule.findChannel('123')(d)
      spy.get.calledWith('host/channels/123').should.be.true
    })

    it('#findCoach - singlized', () => {
      singlizedActions.findCoach('123')(d)
      spy.get.calledWith('host/coach/123').should.be.true
    })



    it('#findChannels with a request - pluralized', () => {
      actionModule.findChannels('limit=2&skip=3')(d)

      spy.get.calledWith('host/channels?limit=2&skip=3').should.be.true
    })

    it('#findCoaches with a request - singlized', () => {
      singlizedActions.findCoaches('limit=2&skip=3')(d)

      spy.get.calledWith('host/coach?limit=2&skip=3').should.be.true
    })



    it('#findChannels without request - pluralized', () => {
      actionModule.findChannels('')(d)

      spy.get.callCount.should.equal(1)
      spy.get.calledWith('host/channels').should.be.true
    })

    it('#findCoaches without request - singlized', () => {
      singlizedActions.findCoaches('')(d)

      spy.get.callCount.should.equal(1)
      spy.get.calledWith('host/coach').should.be.true
    })



    it('#findChannels with default request - pluralized', () => {
      actionModule.findChannels()(d)

      spy.get.callCount.should.equal(1)
      spy.get.calledWith('host/channels?limit=10000').should.be.true
    })

    it('#findCoaches with default request - singlized', () => {
      singlizedActions.findCoaches()(d)

      spy.get.callCount.should.equal(1)
      spy.get.calledWith('host/coach?limit=10000').should.be.true
    })

  })

  describe('create requests', () => {

    it('#createChannel correctly - pluralized', () => {

      var channel = {foo : 'baz'}

      actionModule.createChannel(channel)(d)
      spy.post.calledWith('host/channels', channel).should.be.true
      spy.post.callCount.should.equal(1)
    })

    it('#createCoach correctly - singlized', () => {

      var channel = {foo : 'baz'}

      singlizedActions.createCoach(channel)(d)
      spy.post.calledWith('host/coach', channel).should.be.true
      spy.post.callCount.should.equal(1)
    })


    it('#createChannel without a model should not call post', () => {

      actionModule.createChannel()(d)
      spy.post.callCount.should.equal(0)
    })


    it('#createChannel with an empty model should not call post', () => {

      actionModule.createChannel({})(d)
      spy.post.callCount.should.equal(0)
    })
  })
});
