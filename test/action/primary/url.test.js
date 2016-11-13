var rewire = require('rewire')
var primaryActionGenerator = rewire('../../../src/primaryActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()
import { XHR, spy } from '../../mocks/XHR'

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
    primaryActionGenerator.__set__({XHR})

    actionModule     = primaryActionGenerator('channel', hostConfig)
    singlizedActions = primaryActionGenerator('coach', singlizedHostConfig)
  })

  beforeEach('reset spy states', function(){
    spy.provider.reset()
    spy.get.reset()
    spy.post.reset()
    spy.put.reset()
    spy.delete.reset()
  })

  describe('FIND requests', function(){

    it('#findChannel - pluralized', function(){
      actionModule.findChannel('123')(d)
      spy.provider.calledWith(hostConfig, undefined, 'host/channels/123').should.be.true
      spy.get.calledOnce.should.be.true
    })

    it('#findCoach - singlized', function(){
      singlizedActions.findCoach('123')(d)
      spy.provider.calledWith(singlizedHostConfig, undefined, 'host/coach/123').should.be.true
      spy.get.calledOnce.should.be.true

    })



    it('#findChannels with a request - pluralized', function(){
      actionModule.findChannels('limit=2&skip=3')(d)
      spy.provider.calledWith(hostConfig, undefined, 'host/channels?limit=2&skip=3').should.be.true
      spy.get.calledOnce.should.be.true

    })

    it('#findCoaches with a request - singlized', function(){
      singlizedActions.findCoaches('limit=2&skip=3')(d)
      spy.provider.calledWith(singlizedHostConfig, undefined, 'host/coach?limit=2&skip=3').should.be.true
      spy.get.calledOnce.should.be.true

    })


    it('#findChannels without request - pluralized', function(){
      actionModule.findChannels('')(d)

      spy.provider.callCount.should.equal(1)
      spy.provider.calledWith(hostConfig, undefined, 'host/channels').should.be.true
      spy.get.calledOnce.should.be.true

    })



    it('#findCoaches without request - singlized', function(){
      singlizedActions.findCoaches('')(d)

      spy.provider.callCount.should.equal(1)
      spy.provider.calledWith(singlizedHostConfig, undefined, 'host/coach').should.be.true
      spy.get.calledOnce.should.be.true

    })




    it('#findChannels with default request - pluralized', function(){
      actionModule.findChannels()(d)

      spy.provider.callCount.should.equal(1)
      spy.provider.calledWith(hostConfig, undefined, 'host/channels?limit=10000').should.be.true
      spy.get.calledOnce.should.be.true

    })




    it('#findCoaches with default request - singlized', function(){
      singlizedActions.findCoaches()(d)

      spy.provider.callCount.should.equal(1)
      spy.provider.calledWith(singlizedHostConfig, undefined, 'host/coach?limit=10000').should.be.true
      spy.get.calledOnce.should.be.true

    })

  })

  describe('CREATE requests', function(){

    it('#createChannel correctly - pluralized', function(){

      var channel = {foo : 'baz'}

      actionModule.createChannel(channel)(d)
      spy.provider.calledWith(hostConfig, undefined, 'host/channels').should.be.true
      spy.provider.callCount.should.equal(1)

      spy.post.calledOnce.should.be.true
      spy.post.calledWith(channel).should.be.true
    })

    it('#createCoach correctly - singlized', function(){

      var channel = {foo : 'baz'}

      singlizedActions.createCoach(channel)(d)
      spy.provider.calledWith(singlizedHostConfig, undefined, 'host/coach').should.be.true
      spy.provider.callCount.should.equal(1)

      spy.post.calledOnce.should.be.true
      spy.post.calledWith(channel).should.be.true
    })


    it('#createChannel without a model should not call post', function(){

      actionModule.createChannel()(d)
      spy.post.calledOnce.should.be.false
    })


    it('#createChannel with an empty model should not call post', function(){

      actionModule.createChannel({})(d)
      spy.post.calledOnce.should.be.false
    })
  })

  describe('UPDATE requests', function(){

    it('#updateChannel correctly', function(){

      var oldChannel = {id : 1, foo : 'bar'}
      var newChannel = {id : 1, foo : 'boo'}

      actionModule.updateChannel(oldChannel, newChannel)(d)
      spy.provider.calledWith(hostConfig, undefined, 'host/channels/1').should.be.true
      spy.provider.callCount.should.equal(1)
      spy.put.calledOnce.should.be.true
      spy.put.calledWith(newChannel).should.be.true
    })

    it('#updateChannel without an old model should not call put', function(){

      actionModule.updateChannel(undefined)(d)
      spy.put.calledOnce.should.be.false
    })

    it('#updateChannel without a newModel should not call put', function(){

      actionModule.updateChannel({}, undefined)(d)
      spy.put.calledOnce.should.be.false
    })


  })
});
