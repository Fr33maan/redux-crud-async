var rewire                     = require('rewire')
var associationActionGenerator = rewire('../../../src/associationActionGenerator')
var headersUtil            = rewire('../../../utils/xhr/headers')
var sinon                      = require('sinon')
var should                     = require('chai').should()
var expect                     = require('chai').expect

var spy = {}
var d = (action) => action
var actionModule

const hostConfig = {
  host : 'host',
  apiSpecs : {
    coachComments : {
      auth : ['addCommentToCoach', 'removeCommentFromCoach']
    }
  }
}

describe('bearers for associationActionGenerator', function() {

  before('Rewire and spy axios module && host config && getLocalStorage', () => {

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


    var windowAccess = {localStorage: {getItem : function(msg){return msg}}}

    headersUtil.__set__({windowAccess})
    associationActionGenerator.__set__({providerUtil : xhr.providerUtil, windowAccess, headersUtil})

    // var axios = {
    //   get : arg => {
    //     return new Promise(resolve => {resolve({data:{data:[]}}); })
    //   },
    //   post : model => {
    //     return new Promise(resolve => {resolve({data:{data:[]}}); })
    //   },
    //   delete : model => {
    //     return new Promise(resolve => {resolve({data:{data:[]}}); })
    //   }
    // }
    //
    // spy.get  = sinon.spy(axios, 'get')
    // spy.post = sinon.spy(axios, 'post')
    // spy.delete = sinon.spy(axios, 'delete')



    // var windowAccess = {localStorage: {getItem : function(msg){return msg}}}
    // associationActionGenerator.__set__({axios, windowAccess})

    actionModule = associationActionGenerator('coach', 'comment', hostConfig)
  })

  beforeEach('reset spy states', () => {
    spy.provider.reset()
  })

  describe('all requests', () => {

    it('#findCoachComments - should not have a bearer in request', () => {
      actionModule.findCoachComments('123')(d)
      const args = spy.provider.args[0]
      // headers is fourth argument of providerUtil function
      expect(args[3]).to.be.undefined
    })


    it('#addCommentToCoach - should be called with a bearer called JWT', () => {

      var commentToAssociate = {
        id : 'bar'
      }

      actionModule.addCommentToCoach(123, commentToAssociate)(d)

      // headers should be set && bearer should equal default localStorageName
      const args = spy.provider.args[0]

      // headers is fourth argument of providerUtil function
      expect(args[3]).to.eql({'Authorization': 'Bearer JWT'})
    })



    it('#removeCommentFromCoach should be called with a bearer called JWT', () => {

      var commentToDissociate = {
        id: 456,
        foo: 'bar'
      }

      actionModule.removeCommentFromCoach(123, commentToDissociate)(d)

      // headers should be set && bearer should equal default localStorageName
      const args = spy.provider.args[0]

      // headers is fourth argument of providerUtil function
      expect(args[3]).to.eql({'Authorization': 'Bearer JWT'})
    })
  })
});
