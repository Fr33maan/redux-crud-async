var rewire = require('rewire')
var associationActionGenerator = rewire('../../../src/associationActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()

var actions
var get

describe('associationActionGenerator', function() {

  before('Rewire associationActionGenerator axios module and host config', () => {
    var axios = {
      get : modelId => {
        return new Promise(resolve => {resolve({data:{data:[]}})})
      }
    }

    get  = sinon.spy(axios, 'get')

    const hostConfig = {
      host : 'host'
    }

    associationActionGenerator.__set__({axios})
    actions = associationActionGenerator('channel', 'tag', hostConfig)

  })

  afterEach('reset spy state', () => {
      get.reset()
  })

  it('should call the prefixed url', () => {
    actions
    .findChannelTags('123')(() => {})

    get.calledWith('host/channels/123/tags').should.be.true
  })


  it('should call the UNprefixed url', () => {

    associationActionGenerator('channel' ,'tag', {host: 'host', prefix : 'prefix'})
    .findChannelTags('123')(() => {})

    get.calledWith('host/prefix/channels/123/tags').should.be.true

  })
});
