var rewire = require('rewire')
var primaryActionGenerator = rewire('../../../generators/primaryActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()

var spy = {}
var d = (action) => action

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

    const hostConfig = {
      host : 'host'
    }

    primaryActionGenerator.__set__({axios, hostConfig})

  })

  beforeEach('reset spy states', () => {
    spy.get.reset()
    spy.post.reset()
  })

  describe('find requests', () => {

    it('#findChannel', () => {
      primaryActionGenerator('channel').findChannel('123')(d)
      spy.get.calledWith('host/channels/123').should.be.true
    })

    it('#findChannels with a request', () => {
      primaryActionGenerator('channel').findChannels('limit=2&skip=3')(d)

      spy.get.calledWith('host/channels?limit=2&skip=3').should.be.true
    })

    it('#findChannels without request', () => {
      primaryActionGenerator('channel').findChannels('')(d)

      spy.get.callCount.should.equal(1)
      spy.get.calledWith('host/channels').should.be.true
    })

    it('#findChannels with default request', () => {
      primaryActionGenerator('channel').findChannels()(d)

      spy.get.callCount.should.equal(1)
      spy.get.calledWith('host/channels?limit=10000').should.be.true
    })

  })

  describe('create requests', () => {

    it('#createChannel correctly', () => {

      var channel = {foo : 'baz'}

      primaryActionGenerator('channel').createChannel(channel)(d)
      spy.post.calledWith('host/channels', channel).should.be.true
      spy.post.callCount.should.equal(1)
    })


    it('#createChannel without a model should not call post', () => {

      primaryActionGenerator('channel').createChannel()(d)
      spy.post.callCount.should.equal(0)
    })


    it('#createChannel with an empty model should not call post', () => {

      primaryActionGenerator('channel').createChannel({})(d)
      spy.post.callCount.should.equal(0)
    })
  })
});
