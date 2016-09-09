var rewire = require('rewire')
var primaryActionGenerator = rewire('../../../src/primaryActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()

var spy = {}

describe('primaryActionGenerator', function() {

  before('Rewire primaryActionGenerator providerUtil module and host config', function() {

    const xhr = {
      providerUtil : function(hostConfig, method, url){
        return new Promise(resolve => {resolve({
          data : {
            data : []
          }
        })})
      }
    }

    spy.provider = sinon.spy(xhr, 'providerUtil')

    primaryActionGenerator.__set__({providerUtil : xhr.providerUtil})
  })

  beforeEach('reset spy states', () => {
    spy.provider.reset()
  })

  it('should call the prefixed url', function(){
    const hostConfig = {
      host : 'host'
    }

    primaryActionGenerator('channel', hostConfig)
    .findChannel('123')(() => {})

    spy.provider.calledWith(hostConfig, 'get', 'host/channels/123', undefined).should.be.true
  })


  it('should call the UNprefixed url', function(){
    const hostConfig = {
      host : 'host',
      prefix : 'prefix'
    }

    primaryActionGenerator('channel', hostConfig)
    .findChannel('123')(() => {})
    spy.provider.calledWith(hostConfig, 'get', 'host/prefix/channels/123', undefined).should.be.true
  })
});
