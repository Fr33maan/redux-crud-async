var rewire = require('rewire')
var primaryActionGenerator = rewire('../../../src/primaryActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()

var actions = primaryActionGenerator
var provider

describe('primaryActionGenerator', function() {

  before('Rewire primaryActionGenerator providerUtil module and host config', () => {
    var providerUtil = function(hostConfig, method, url){
      console.log('called')
      return new Promise(resolve => {resolve()})
    }

    provider = sinon.spy(providerUtil)

    primaryActionGenerator.__set__({providerUtil})
  })

  it('should call the prefixed url', () => {
    const hostConfig = {
      host : 'host'
    }

    actions('channel', hostConfig)
    .findChannel('123')(() => {})

    console.log(provider.args)
    provider.calledWith('host/channels/123').should.be.true
  })


  it('should call the UNprefixed url', () => {
    const hostConfig = {
      host : 'host',
      prefix : 'prefix'
    }

    actions('channel', hostConfig)
    .findChannel('123')(() => {})
    provider.calledWith('host/prefix/channels/123').should.be.true

  })
});
