var rewire                     = require('rewire')
var associationActionGenerator = rewire('../../../src/associationActionGenerator')
var sinon                      = require('sinon')
var should                     = require('chai').should()
var expect                     = require('chai').expect

var spy = {}
var d = (action) => action
var actionModule

describe('bearers for associationActionGenerator', function() {

  before('Rewire and spy axios module && host config && getSessionStorage', () => {

    var axios = {
      get : arg => {
        return new Promise(resolve => {resolve({data:{data:[]}}); })
      },
      post : model => {
        return new Promise(resolve => {resolve({data:{data:[]}}); })
      },
      delete : model => {
        return new Promise(resolve => {resolve({data:{data:[]}}); })
      }
    }

    spy.get  = sinon.spy(axios, 'get')
    spy.post = sinon.spy(axios, 'post')
    spy.delete = sinon.spy(axios, 'delete')

    const hostConfig = {
      host : 'host',
      apiSpecs : {
        coachComments : {
          auth : ['addCommentToCoach', 'removeCommentFromCoach']
        }
      }
    }

    var windowAccess = {sessionStorage: {getItem : function(msg){return msg}}}
    associationActionGenerator.__set__({axios, windowAccess})

    actionModule = associationActionGenerator('coach', 'comment', hostConfig)
  })

  beforeEach('reset spy states', () => {
    spy.get.reset()
    spy.post.reset()
    spy.delete.reset()
  })

  describe('all requests', () => {

    it('#findCoachComments - should not have a bearer in request', () => {
      actionModule.findCoachComments('123')(d)
      expect(spy.get.args[0][1]).to.be.undefined
    })


    it('#addCommentToCoach - should be called with a bearer called JWT', () => {

      var commentToAssociate = {
        foo : 'bar'
      }

      actionModule.addCommentToCoach(123, commentToAssociate)(d)

      // headers should be set && bearer should equal default sessionStorageName
      expect(spy.post.args[0][2]).to.eql({headers: {'Authorization': 'Bearer JWT'}})
    })



    it('#removeCommentFromCoach should be called with a bearer called JWT', () => {

      var commentToDissociate = {
        id: 456,
        foo: 'bar'
      }

      actionModule.removeCommentFromCoach(123, commentToDissociate)(d)

      // headers should be set && bearer should equal hostConfig.sessionStorageName
      expect(spy.delete.args[0][1]).to.eql({headers: {'Authorization': 'Bearer JWT'}})
    })
  })
});
