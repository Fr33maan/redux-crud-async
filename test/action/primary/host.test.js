var rewire = require('rewire')
var primaryActionGenerator = rewire('../../../src/primaryActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()

var actions = primaryActionGenerator
var get

describe('primaryActionGenerator', function() {

  before('Rewire primaryActionGenerator axios module and host config', () => {
    var axios = {
      get : modelId => {
        return new Promise(resolve => {resolve({data:{data:[]}})})
      }
    }

    get  = sinon.spy(axios, 'get')

    const hostConfig = {
      host : 'host'
    }

    primaryActionGenerator.__set__({axios})

  })

  it('should call the prefixed url', () => {
    const hostConfig = {
      host : 'host'
    }

    actions('channel', hostConfig)
    .findChannel('123')(() => {})

    get.calledWith('host/channels/123').should.be.true
  })


  it('should call the UNprefixed url', () => {
    const hostConfig = {
      host : 'host',
      prefix : 'prefix'
    }

    actions('channel', hostConfig)
    .findChannel('123')(() => {})
    get.calledWith('host/prefix/channels/123').should.be.true

  })
});
