var rewire = require('rewire')
var primaryActionGenerator = rewire('../../../src/primaryActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()

var spy = {}
var d = (action) => action
var actionModule

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

    actionModule = primaryActionGenerator('channel', hostConfig)

  })

  beforeEach('reset spy states', () => {
    spy.get.reset()
    spy.post.reset()
  })

  describe('find requests', () => {

    it('#findChannel', () => {
      actionModule.findChannel('123')(d)
      spy.get.calledWith('host/channels/123').should.be.true
    })

    it('#findChannels with a request', () => {
      actionModule.findChannels('limit=2&skip=3')(d)

      spy.get.calledWith('host/channels?limit=2&skip=3').should.be.true
    })

    it('#findChannels without request', () => {
      actionModule.findChannels('')(d)

      spy.get.callCount.should.equal(1)
      spy.get.calledWith('host/channels').should.be.true
    })

    it('#findChannels with default request', () => {
      actionModule.findChannels()(d)

      spy.get.callCount.should.equal(1)
      spy.get.calledWith('host/channels?limit=10000').should.be.true
    })

  })

  describe('create requests', () => {

    it('#createChannel correctly', () => {

      var channel = {foo : 'baz'}

      actionModule.createChannel(channel)(d)
      spy.post.calledWith('host/channels', channel).should.be.true
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
