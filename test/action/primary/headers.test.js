var rewire                 = require('rewire')
var primaryActionGenerator = rewire('../../../src/primaryActionGenerator')
var headersUtil            = rewire('../../../src/utils/xhr/headers')
var sinon                  = require('sinon')
var should                 = require('chai').should()
var expect                 = require('chai').expect
import { XHR, spy } from '../../mocks/XHR'

var d = (action) => action
var actionModule, singlizedActions

const hostConfig = {
  host : 'host',
  localStorageName : 'jwt',

  apiSpecs : {
    // Can create actions
    signup : {
      // Set url for action
      post : '/auth/signup'
    },

    // Can create models
    coach : {
      // Can't set url for models
      auth : ['createCoach', 'updateCoach', 'destroyCoach']
    },
  }
}

describe('headers for primaryActionGenerator', function() {

  before('Rewire and spy axios module && host config && getLocalStorage', function(){
    var windowAccess = {localStorage: {getItem : function(msg){return msg}}}

    headersUtil.__set__({windowAccess})
    primaryActionGenerator.__set__({XHR : XHR, windowAccess, headersUtil})

    actionModule = primaryActionGenerator('coach', hostConfig)
  })

  beforeEach('reset spy states', function(){
    spy.provider.reset()
  })

  describe('find requests', function(){

    it('#findCoach - should not have a bearer in request', function(){
      actionModule.findCoach('123')(d)
      spy.provider.calledWith(hostConfig, undefined, 'host/coaches/123').should.be.true
    })


    it('#findCoaches - should not have a bearer in request', function(){
      actionModule.findCoaches('')(d)
      spy.provider.callCount.should.equal(1)
      spy.provider.calledWith(hostConfig, undefined, 'host/coaches').should.be.true
    })

  })

  describe('create requests', function(){

    it('#createCoach should be called with a bearer called jwt', function(){

      var coachToCreate = {
        foo: 'bar'
      }

      actionModule.createCoach(coachToCreate)(d)
      spy.provider.callCount.should.equal(1)
      // headers should be set && bearer should equal hostConfig.localStorageName
      spy.provider.calledWith(hostConfig, {'Authorization': 'Bearer jwt'}, 'host/coaches').should.be.true
    })
  })

  describe('update requests', function(){

    it('#updateCoach should be called with a bearer called jwt', function(){

      var oldCoach = {
        id : 1,
        foo: 'bar'
      }

      var newCoach = {
        id : 1,
        foo: 'boo'
      }

      actionModule.updateCoach(oldCoach, newCoach)(d)
      spy.provider.callCount.should.equal(1)
      // headers should be set && bearer should equal hostConfig.localStorageName
      spy.provider.calledWith(hostConfig, {'Authorization': 'Bearer jwt'}, 'host/coaches/1').should.be.true
    })
  })

  describe('destroy requests', function(){

    it('#destroyCoach should be called with a bearer called jwt', function(){

      actionModule.destroyCoach(1)(d)
      spy.provider.callCount.should.equal(1)
      // headers should be set && bearer should equal hostConfig.localStorageName
      spy.provider.calledWith(hostConfig, {'Authorization': 'Bearer jwt'}, 'host/coaches/1').should.be.true
    })
  })
});
