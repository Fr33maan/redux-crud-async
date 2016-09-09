var rewire = require('rewire')
var associationActionGenerator = rewire('../../../src/associationActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()

var spy = {}

const hostConfig = {
  host : 'host'
}


describe('associationActionGenerator', function() {

  before('Rewire associationActionGenerator axios module and host config', () => {

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
    associationActionGenerator.__set__({providerUtil : xhr.providerUtil})
  })

  afterEach('reset spy state', () => {
      spy.provider.reset()
  })

  it('should call the prefixed url on FIND action', () => {
    associationActionGenerator('channel', 'tag', hostConfig)
    .findChannelTags('123')(() => {})

    spy.provider.calledWith(hostConfig, 'get', 'host/channels/123/tags').should.be.true
  })


  it('should call the UNprefixed url on FIND action', () => {
    const newHostConfig = {
      ...hostConfig,
      prefix : 'prefix'
    }
    associationActionGenerator('channel' ,'tag', newHostConfig)
    .findChannelTags('123')(() => {})
    spy.provider.calledWith(newHostConfig, 'get', 'host/prefix/channels/123/tags').should.be.true
  })


  it('should call the prefixed url on ADD action', () => {
    const tag = {foo : 'bar'}
    associationActionGenerator('channel', 'tag', hostConfig)
    .addTagToChannel('123', tag)(action => action)
    spy.provider.calledWith(hostConfig, 'post', 'host/channels/123/tags').should.be.true
  })


  it('should call the prefixed url on REMOVE action', () => {
    const tag = {id : '1'}
    associationActionGenerator('channel', 'tag', hostConfig)
    .removeTagFromChannel('123', tag)(action => action)
    spy.provider.calledWith(hostConfig, 'delete', 'host/channels/123/tags/1').should.be.true
  })
});
