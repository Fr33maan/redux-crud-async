var rewire = require('rewire')
var associationActionGenerator = rewire('../../../src/associationActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()
import { XHR, spy } from '../../mocks/XHR'

const hostConfig = {
  host : 'host'
}


describe('associationActionGenerator', function() {

  before('Rewire associationActionGenerator axios module and host config', () => {
    associationActionGenerator.__set__({XHR})
  })

  beforeEach('reset spy state', () => {
      spy.provider.reset()
      spy.get.reset()
      spy.post.reset()
      spy.delete.reset()
  })

  it('should call the prefixed url on FIND action', () => {
    associationActionGenerator('channel', 'tag', hostConfig)
    .findChannelTags('123')(() => {})

    spy.provider.calledWith(hostConfig, undefined, 'host/channels/123/tags').should.be.true
    spy.get.calledOnce.should.be.true
  })


  it('should call the UNprefixed url on FIND action', () => {
    const newHostConfig = {
      ...hostConfig,
      prefix : 'prefix'
    }
    associationActionGenerator('channel' ,'tag', newHostConfig)
    .findChannelTags('123')(() => {})
    spy.provider.calledWith(newHostConfig, undefined, 'host/prefix/channels/123/tags').should.be.true
    spy.get.calledOnce.should.be.true
  })


  it('should call the prefixed url on ADD action', () => {
    const tag = {foo : 'bar'}
    associationActionGenerator('channel', 'tag', hostConfig)
    .addTagToChannel('123', tag)(action => action)
    spy.provider.calledWith(hostConfig, undefined, 'host/channels/123/tags').should.be.true
    spy.post.calledOnce.should.be.true
  })


  it('should call the prefixed url on REMOVE action', () => {
    const tag = {id : '1'}
    associationActionGenerator('channel', 'tag', hostConfig)
    .removeTagFromChannel('123', tag)(action => action)
    spy.provider.calledWith(hostConfig, undefined, 'host/channels/123/tags/1').should.be.true
    spy.delete.calledOnce.should.be.true
  })
});
