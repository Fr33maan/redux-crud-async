var rewire = require('rewire')
var associationActionGenerator = rewire('../../../src/associationActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()
import { XHR, spy } from '../../mocks/XHR'

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
    associationActionGenerator.__set__({XHR})

    actions = associationActionGenerator('channel', 'tag', hostConfig)
    singlizedActions = associationActionGenerator('channel', 'tag', singlizedHostConfig)
  })

  beforeEach('reset spy states', () => {
    spy.provider.reset()
    spy.get.reset()
    spy.post.reset()
    spy.delete.reset()
  })

  describe('find requests', () => {

    it('#findChannelTags without associatedModelId - pluralized', () => {
      actions.findChannelTags('123')(d)
      spy.provider.calledWith(hostConfig, undefined, 'host/channels/123/tags').should.be.true
    })

    it('#findChannelTags without associatedModelId - singlized', () => {
      singlizedActions.findChannelTags('123')(d)
      spy.provider.calledWith(singlizedHostConfig, undefined, 'host/channel/123/tag').should.be.true
    })

    it('#findChannelTags with an associatedModelId - pluralized', () => {
      actions.findChannelTags('123', '456')(d)
      spy.provider.calledWith(hostConfig, undefined, 'host/channels/123/tags/456').should.be.true
    })

    it('#findChannelTags with an associatedModelId - singlized', () => {
      singlizedActions.findChannelTags('123', '456')(d)
      spy.provider.calledWith(singlizedHostConfig, undefined, 'host/channel/123/tag/456').should.be.true
    })
  })

  describe('add requests', () => {

    it('#addTagToChannel when modelToAssociate does not exists in database (do not have an "id" property) - pluralized', () => {

      var modelToAssociate = {
        foo : 'bar'
      }

      actions.addTagToChannel('123', modelToAssociate)(d)
      spy.provider.calledWith(hostConfig, undefined, 'host/channels/123/tags').should.be.true
      spy.provider.callCount.should.equal(1)

      spy.post.calledOnce.should.be.true
      spy.post.calledWith(modelToAssociate).should.be.true
    })

    it('#addTagToChannel when modelToAssociate does not exists in database (do not have an "id" property) - singlized', () => {

      var modelToAssociate = {
        foo : 'bar'
      }

      singlizedActions.addTagToChannel('123', modelToAssociate)(d)
      spy.provider.calledWith(singlizedHostConfig, undefined, 'host/channel/123/tag').should.be.true
      spy.provider.callCount.should.equal(1)

      spy.post.calledOnce.should.be.true
      spy.post.calledWith(modelToAssociate).should.be.true
    })

    it('#addTagToChannel when modelToAssociate already exists in database (already have an "id" property) - pluralized', () => {

      var modelToAssociate = {
        id: 456,
        foo : 'bar'
      }

      actions.addTagToChannel('123', modelToAssociate)(d)
      spy.provider.calledWith(hostConfig, undefined, 'host/channels/123/tags/456').should.be.true
      spy.provider.callCount.should.equal(1)

      spy.post.calledOnce.should.be.true
      spy.post.calledWith(modelToAssociate).should.be.true
    })

    it('#addTagToChannel when modelToAssociate already exists in database (already have an "id" property) - singlized', () => {

      var modelToAssociate = {
        id: 456,
        foo : 'bar'
      }

      singlizedActions.addTagToChannel('123', modelToAssociate)(d)
      spy.provider.calledWith(singlizedHostConfig, undefined, 'host/channel/123/tag/456').should.be.true
      spy.provider.callCount.should.equal(1)

      spy.post.calledOnce.should.be.true
      spy.post.calledWith(modelToAssociate).should.be.true
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
      spy.provider.calledWith(hostConfig, undefined, 'host/channels/123/tags/456').should.be.true
      spy.provider.callCount.should.equal(1)

      spy.delete.calledOnce.should.be.true
    })

    it('#removeTagFromChannel - single', () => {

      var modelToDissociate = {
        id: 456,
        foo : 'bar'
      }

      singlizedActions.removeTagFromChannel('123', modelToDissociate)(d)
      spy.provider.calledWith(singlizedHostConfig, undefined, 'host/channel/123/tag/456').should.be.true
      spy.provider.callCount.should.equal(1)

      spy.delete.calledOnce.should.be.true
    })
  })
});
