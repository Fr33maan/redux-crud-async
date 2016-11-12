var rewire = require('rewire')
var associationActionGenerator = rewire('../../../src/associationActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()

var spy = {}
var d = (action) => action
var actions, singlizedActions

const hostConfig = {
  host : 'host'
}

const singlizedHostConfig = {
   ...hostConfig,
   pluralizeModels: false
}

describe('associationActionGenerator', function() {

  before('Rewire and spy providerUtil module', () => {
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
    associationActionGenerator.__set__({providerUtil : xhr.providerUtil})

    actions = associationActionGenerator('channel', 'tag', hostConfig)
    singlizedActions = associationActionGenerator('channel', 'tag', singlizedHostConfig)
  })

  beforeEach('reset spy states', () => {
    spy.provider.reset()
  })

  describe('find requests', () => {

    it('#findChannelTags without associatedModelId - pluralized', () => {
      actions.findChannelTags('123')(d)
      spy.provider.calledWith(hostConfig, 'get', 'host/channels/123/tags').should.be.true
    })

    it('#findChannelTags without associatedModelId - singlized', () => {
      singlizedActions.findChannelTags('123')(d)
      spy.provider.calledWith(singlizedHostConfig, 'get', 'host/channel/123/tag').should.be.true
    })

    it('#findChannelTags with an associatedModelId - pluralized', () => {
      actions.findChannelTags('123', '456')(d)
      spy.provider.calledWith(hostConfig, 'get', 'host/channels/123/tags/456').should.be.true
    })

    it('#findChannelTags with an associatedModelId - singlized', () => {
      singlizedActions.findChannelTags('123', '456')(d)
      spy.provider.calledWith(singlizedHostConfig, 'get', 'host/channel/123/tag/456').should.be.true
    })
  })

  describe('add requests', () => {

    it('#addTagToChannel when modelToAssociate does not exists in database (do not have an "id" property) - pluralized', () => {

      var modelToAssociate = {
        foo : 'bar'
      }

      actions.addTagToChannel('123', modelToAssociate)(d)
      spy.provider.calledWith(hostConfig, 'post', 'host/channels/123/tags', undefined, modelToAssociate).should.be.true
      spy.provider.callCount.should.equal(1)
    })

    it('#addTagToChannel when modelToAssociate does not exists in database (do not have an "id" property) - singlized', () => {

      var modelToAssociate = {
        foo : 'bar'
      }

      singlizedActions.addTagToChannel('123', modelToAssociate)(d)
      spy.provider.calledWith(singlizedHostConfig, 'post', 'host/channel/123/tag', undefined, modelToAssociate).should.be.true
      spy.provider.callCount.should.equal(1)
    })

    it('#addTagToChannel when modelToAssociate already exists in database (already have an "id" property) - pluralized', () => {

      var modelToAssociate = {
        id: 456,
        foo : 'bar'
      }

      actions.addTagToChannel('123', modelToAssociate)(d)
      spy.provider.calledWith(hostConfig, 'post', 'host/channels/123/tags/456', undefined, modelToAssociate).should.be.true
      spy.provider.callCount.should.equal(1)
    })

    it('#addTagToChannel when modelToAssociate already exists in database (already have an "id" property) - singlized', () => {

      var modelToAssociate = {
        id: 456,
        foo : 'bar'
      }

      singlizedActions.addTagToChannel('123', modelToAssociate)(d)
      spy.provider.calledWith(singlizedHostConfig, 'post', 'host/channel/123/tag/456', undefined, modelToAssociate).should.be.true
      spy.provider.callCount.should.equal(1)
    })

    it('#addTagToChannel when modelToAssociate already exists alreadyAssociatedModels', () => {

      var modelToAssociate = {
        id: 456,
        foo : 'bar'
      }

      // If model is already in associatedModels array
      actions.addTagToChannel('123', modelToAssociate, [modelToAssociate])
      .should.eql({type: 'NO_ACTION'})
      spy.provider.callCount.should.equal(0)
    })

  })

  describe('remove requests', () => {

    it('#removeTagFromChannel - pluralized', () => {

      var modelToDissociate = {
        id: 456,
        foo : 'bar'
      }

      actions.removeTagFromChannel('123', modelToDissociate)(d)
      spy.provider.calledWith(hostConfig, 'delete', 'host/channels/123/tags/456', undefined).should.be.true
      spy.provider.callCount.should.equal(1)
    })

    it('#removeTagFromChannel - single', () => {

      var modelToDissociate = {
        id: 456,
        foo : 'bar'
      }

      singlizedActions.removeTagFromChannel('123', modelToDissociate)(d)
      spy.provider.calledWith(singlizedHostConfig, 'delete', 'host/channel/123/tag/456', undefined).should.be.true
      spy.provider.callCount.should.equal(1)
    })
  })
});
