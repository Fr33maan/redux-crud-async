var rewire = require('rewire')
var primaryActionGenerator = rewire('../../../src/primaryActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()
import { XHR, spy } from '../../mocks/XHR'

describe('primaryActionGenerator', function() {

  before('Rewire primaryActionGenerator providerUtil module and host config', function() {
    primaryActionGenerator.__set__({XHR : XHR})
  })

  beforeEach('reset spy states', () => {
    spy.provider.reset()
    spy.get.reset()
    spy.post.reset()
    spy.delete.reset()
  })

  it('should call the prefixed url', function(){
    const hostConfig = {
      host : 'host'
    }

    primaryActionGenerator('channel', hostConfig)
    .findChannel('123')(() => {})

    spy.provider.calledWith(hostConfig, undefined, 'host/channels/123').should.be.true
    spy.get.calledOnce.should.be.true
  })


  it('should call the UNprefixed url', function(){
    const hostConfig = {
      host : 'host',
      prefix : 'prefix'
    }

    primaryActionGenerator('channel', hostConfig)
    .findChannel('123')(() => {})
    spy.provider.calledWith(hostConfig, undefined, 'host/prefix/channels/123').should.be.true
    spy.get.calledOnce.should.be.true
  })
});
