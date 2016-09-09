var rewire                 = require('rewire')
var primaryActionGenerator = rewire('../../../src/primaryActionGenerator')
var headersUtil            = rewire('../../../utils/xhr/headers')
var sinon                  = require('sinon')
var should                 = require('chai').should()
var expect                 = require('chai').expect

var spy = {}
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
      auth : ['createCoach', 'updateCoach']
    },
  }
}

describe('headers for primaryActionGenerator', function() {

  before('Rewire and spy axios module && host config && getLocalStorage', function(){
    const providerUtil = {
      providerUtil : function(hostConfig, method, url, headers, postData){
        return new Promise(resolve => {resolve({
          data : {
            data : []
          }
        })})
      }
    }

    spy.provider = sinon.spy(providerUtil, 'providerUtil')


    var windowAccess = {localStorage: {getItem : function(msg){return msg}}}

    headersUtil.__set__({windowAccess})
    primaryActionGenerator.__set__({providerUtil : providerUtil.providerUtil, windowAccess, headersUtil})

    actionModule = primaryActionGenerator('coach', hostConfig)
  })

  beforeEach('reset spy states', function(){
    spy.provider.reset()
  })

  describe('find requests', function(){

    it('#findCoach - should not have a bearer in request', function(){
      actionModule.findCoach('123')(d)
      spy.provider.calledWith(hostConfig, 'get', 'host/coaches/123', undefined).should.be.true
    })


    it('#findCoaches - should not have a bearer in request', function(){
      actionModule.findCoaches('')(d)
      spy.provider.callCount.should.equal(1)
      spy.provider.calledWith(hostConfig, 'get', 'host/coaches', undefined).should.be.true
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
      spy.provider.calledWith(hostConfig, 'post', 'host/coaches', {'Authorization': 'Bearer jwt'}, coachToCreate).should.be.true
    })
  })
});
