var rewire       = require('rewire')
var headersUtil  = rewire('../../utils/xhr/headers.js')
var sinon        = require('sinon')
var should       = require('chai').should()
var expect       = require('chai').expect

var spy = {}

const hostConfig = {
  host : 'host',
  // localStorageName : 'jwt-test',

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

describe('Headers Service Provider', function() {

  before('Rewire getLocalStorage', () => {

    var windowAccess = {localStorage: {getItem : function(msg){return msg}}}
    headersUtil.__set__({windowAccess})

  })

  describe('- generate headers', function(){

    it('- should return headers when action is in hostConfig', () => {
      let header = headersUtil(hostConfig, 'coach')['createCoach']
      expect(header).to.eql({Authorization: 'Bearer JWT'})
    })


    it('- should return headers with custom localStorageName', () => {

      const newHostConfig = {
        ...hostConfig,
        localStorageName : 'jwt-local'
      }

      let header = headersUtil(newHostConfig, 'coach')['createCoach']
      expect(header).to.eql({Authorization: 'Bearer jwt-local'})
    })


    it('- should return headers with custom localStorageName and custom schema', () => {

      const newHostConfig = {
        ...hostConfig,
        localStorageName : 'jwt-local',
        headerContent : 'AuthBearer {{jwt-local}}'
      }

      let header = headersUtil(newHostConfig, 'coach')['createCoach']
      expect(header).to.eql({Authorization: 'AuthBearer jwt-local'})
    })


    it('- should return headers with custom schema', () => {

      const newHostConfig = {
        ...hostConfig,
        headerContent : 'AuthBearer {{JWT}}'
      }

      let header = headersUtil(newHostConfig, 'coach')['createCoach']
      expect(header).to.eql({Authorization: 'AuthBearer JWT'})
    })


    it('- should return headers with custom schema', () => {

      const newHostConfig = {
        ...hostConfig,
        headerFormat : 'AuthBearerHeaderKey'
      }

      let header = headersUtil(newHostConfig, 'coach')['createCoach']
      expect(header).to.eql({AuthBearerHeaderKey: 'Bearer JWT'})
    })
  })


  describe('cannot generate headers', function(){

    it('should return an empty object when model is not in apiSpecs', function(){

      let header = headersUtil(hostConfig, 'modelNotInSpecs')
      expect(header).to.eql({})
    })


    it('should be undefined when model is not in apiSpecs', function(){

      let header = headersUtil(hostConfig, 'modelNotInSpecs')['actionNotInApiSpecs']
      expect(header).to.eql(undefined)
    })


    it('should be undefined when action is not in apiSpecs', function(){

      let header = headersUtil(hostConfig, 'coach')['actionNotInApiSpecs']
      expect(header).to.eql(undefined)
    })
  })
})
