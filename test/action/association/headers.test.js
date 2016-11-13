var rewire                     = require('rewire')
var associationActionGenerator = rewire('../../../src/associationActionGenerator')
var headersUtil                = rewire('../../../src/utils/xhr/headers')
var sinon                      = require('sinon')
var should                     = require('chai').should()
var expect                     = require('chai').expect
import { XHR, spy } from '../../mocks/XHR'

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
    var windowAccess = {localStorage: {getItem : function(msg){return msg}}}
    headersUtil.__set__({windowAccess})
    associationActionGenerator.__set__({XHR : XHR, windowAccess, headersUtil})
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
      expect(args[1]).to.be.undefined
    })


    it('#addCommentToCoach - should be called with a bearer called JWT', () => {

      var commentToAssociate = {
        id : 'bar'
      }

      actionModule.addCommentToCoach(123, commentToAssociate)(d)
      // headers should be set && bearer should equal default localStorageName
      const args = spy.provider.args[0]

      // headers is fourth argument of providerUtil function
      expect(args[1]).to.eql({'Authorization': 'Bearer JWT'})
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
      expect(args[1]).to.eql({'Authorization': 'Bearer JWT'})
    })
  })
});
