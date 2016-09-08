var rewire                 = require('rewire')
var primaryActionGenerator = rewire('../../../src/primaryActionGenerator')
var sinon                  = require('sinon')
var should                 = require('chai').should()
var expect                 = require('chai').expect

var spy = {}
var d = (action) => action
var actionModule, singlizedActions

describe('bearers for primaryActionGenerator', function() {

  before('Rewire and spy axios module && host config && getLocalStorage', () => {
    var axios = {
      get : arg => {
        return new Promise(resolve => {resolve({data:{data:[]}}); })
      },
      post : model => {
        return new Promise(resolve => {resolve({data:{data:[]}}); })
      }
    }

    var windowAccess = {localStorage: {getItem : function(msg){return msg}}}

    spy.get  = sinon.spy(axios, 'get')
    spy.post = sinon.spy(axios, 'post')

    primaryActionGenerator.__set__({axios, windowAccess})

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

    actionModule     = primaryActionGenerator('coach', hostConfig)
  })

  beforeEach('reset spy states', () => {
    spy.get.reset()
    spy.post.reset()
  })

  describe('find requests', () => {

    it('#findCoach - should not have a bearer in request', () => {
      actionModule.findCoach('123')(d)
      expect(spy.get.args[0][1]).to.be.undefined
    })


    it('#findCoaches - should not have a bearer in request', () => {
      actionModule.findCoaches('')(d)

      spy.get.callCount.should.equal(1)
      expect(spy.get.args[0][1]).to.be.undefined
    })

  })

  describe('create requests', () => {

    it('#createCoach should be called with a bearer called jwt', () => {

      var coachToCreate = {
        foo: 'bar'
      }

      actionModule.createCoach(coachToCreate)(d)
      spy.post.callCount.should.equal(1)

      // headers should be set && bearer should equal hostConfig.localStorageName
      expect(spy.post.args[0][2]).to.eql({headers: {'Authorization': 'Bearer jwt'}})
    })
  })
});
