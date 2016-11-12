var rewire = require('rewire')
var primaryActionGenerator = rewire('../../../src/primaryActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()

var spy = {}
var d = (action) => action // Dispatch function - helper
var actionModule, singlizedActions

const hostConfig = {
  host : 'host'
}

const singlizedHostConfig = {
   ...hostConfig,
   pluralizeModels: false
}

describe('requests for primaryActionGenerator', function() {

  before('Rewire and spy axios module && host config', function(){
    const xhr = {
      providerUtil : function(hostConfig, method, url, headers, postData){
        return new Promise(resolve => {resolve({
          data : {
            data : []
          }
        })})
      }
    }

    spy.provider = sinon.spy(xhr, 'providerUtil')
    primaryActionGenerator.__set__({providerUtil : xhr.providerUtil})

    actionModule     = primaryActionGenerator('channel', hostConfig)
    singlizedActions = primaryActionGenerator('coach', singlizedHostConfig)
  })

  beforeEach('reset spy states', function(){
    spy.provider.reset()
  })

  describe('find requests', function(){

    it('#findChannel - pluralized', function(){
      actionModule.findChannel('123')(d)
      spy.provider.calledWith(hostConfig, 'get', 'host/channels/123').should.be.true
    })

    it('#findCoach - singlized', function(){
      singlizedActions.findCoach('123')(d)
      spy.provider.calledWith(singlizedHostConfig, 'get', 'host/coach/123').should.be.true
    })



    it('#findChannels with a request - pluralized', function(){
      actionModule.findChannels('limit=2&skip=3')(d)
      spy.provider.calledWith(hostConfig, 'get', 'host/channels?limit=2&skip=3').should.be.true
    })

    it('#findCoaches with a request - singlized', function(){
      singlizedActions.findCoaches('limit=2&skip=3')(d)
      spy.provider.calledWith(singlizedHostConfig, 'get', 'host/coach?limit=2&skip=3').should.be.true
    })


    it('#findChannels without request - pluralized', function(){
      actionModule.findChannels('')(d)

      spy.provider.callCount.should.equal(1)
      spy.provider.calledWith(hostConfig, 'get', 'host/channels').should.be.true
    })



    it('#findCoaches without request - singlized', function(){
      singlizedActions.findCoaches('')(d)

      spy.provider.callCount.should.equal(1)
      spy.provider.calledWith(singlizedHostConfig, 'get', 'host/coach').should.be.true
    })




    it('#findChannels with default request - pluralized', function(){
      actionModule.findChannels()(d)

      spy.provider.callCount.should.equal(1)
      spy.provider.calledWith(hostConfig, 'get', 'host/channels?limit=10000').should.be.true
    })




    it('#findCoaches with default request - singlized', function(){
      singlizedActions.findCoaches()(d)

      spy.provider.callCount.should.equal(1)
      spy.provider.calledWith(singlizedHostConfig, 'get', 'host/coach?limit=10000').should.be.true
    })

  })

  describe('create requests', function(){

    it('#createChannel correctly - pluralized', function(){

      var channel = {foo : 'baz'}

      actionModule.createChannel(channel)(d)
      spy.provider.calledWith(hostConfig, 'post', 'host/channels', undefined, channel).should.be.true
      spy.provider.callCount.should.equal(1)
    })

    it('#createCoach correctly - singlized', function(){

      var channel = {foo : 'baz'}

      singlizedActions.createCoach(channel)(d)
      spy.provider.calledWith(singlizedHostConfig, 'post', 'host/coach', undefined, channel).should.be.true
      spy.provider.callCount.should.equal(1)
    })


    it('#createChannel without a model should not call post', function(){

      actionModule.createChannel()(d)
      spy.provider.callCount.should.equal(0)
    })


    it('#createChannel with an empty model should not call post', function(){

      actionModule.createChannel({})(d)
      spy.provider.callCount.should.equal(0)
    })
  })
});
