var rewire = require('rewire')
var associationActionGenerator = rewire('../../../src/associationActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()

var spy = {}
var d = (action) => action
var actions, singlizedActions

describe('associationActionGenerator', function() {

  before('Rewire and spy axios module and host config', () => {
    var axios = {
      get : arg => {
        return new Promise(resolve => {resolve({data:{data:[]}}); })
      },
      post : model => {
        return new Promise(resolve => {resolve({data:{data:[]}}); })
      },
      delete : model => {
        return new Promise(resolve => {resolve({data:{data:[]}}); })
      }
    }

    spy.get  = sinon.spy(axios, 'get')
    spy.post = sinon.spy(axios, 'post')
    spy.delete = sinon.spy(axios, 'delete')

    const hostConfig = {
      host : 'host'
    }

    associationActionGenerator.__set__({axios})
    actions = associationActionGenerator('channel', 'tag', hostConfig)
    singlizedActions = associationActionGenerator('channel', 'tag', {...hostConfig, pluralizeModels: false})
  })

  beforeEach('reset spy states', () => {
    spy.get.reset()
    spy.post.reset()
    spy.delete.reset()
  })

  describe('find requests', () => {

    it('#findChannelTags without associatedModelId - pluralized', () => {
      actions.findChannelTags('123')(d)
      spy.get.calledWith('host/channels/123/tags').should.be.true
    })

    it('#findChannelTags without associatedModelId - singlized', () => {
      singlizedActions.findChannelTags('123')(d)
      spy.get.calledWith('host/channel/123/tag').should.be.true
    })

    it('#findChannelTags with an associatedModelId - pluralized', () => {
      actions.findChannelTags('123', '456')(d)
      spy.get.calledWith('host/channels/123/tags/456').should.be.true
    })

    it('#findChannelTags with an associatedModelId - singlized', () => {
      singlizedActions.findChannelTags('123', '456')(d)
      spy.get.calledWith('host/channel/123/tag/456').should.be.true
    })
  })

  describe('add requests', () => {

    it('#addTagToChannel when modelToAssociate does not exists in database (do not have an "id" property) - pluralized', () => {

      var modelToAssociate = {
        foo : 'bar'
      }

      actions.addTagToChannel('123', modelToAssociate)(d)
      spy.post.args.should.eql([['host/channels/123/tags', modelToAssociate]])
      spy.post.callCount.should.equal(1)
    })

    it('#addTagToChannel when modelToAssociate does not exists in database (do not have an "id" property) - singlized', () => {

      var modelToAssociate = {
        foo : 'bar'
      }

      singlizedActions.addTagToChannel('123', modelToAssociate)(d)
      spy.post.args.should.eql([['host/channel/123/tag', modelToAssociate]])
      spy.post.callCount.should.equal(1)
    })

    it('#addTagToChannel when modelToAssociate already exists in database (already have an "id" property) - pluralized', () => {

      var modelToAssociate = {
        id: 456,
        foo : 'bar'
      }

      actions.addTagToChannel('123', modelToAssociate)(d)
      spy.post.calledWith('host/channels/123/tags/456').should.be.true
      spy.post.callCount.should.equal(1)
    })

    it('#addTagToChannel when modelToAssociate already exists in database (already have an "id" property) - singlized', () => {

      var modelToAssociate = {
        id: 456,
        foo : 'bar'
      }

      singlizedActions.addTagToChannel('123', modelToAssociate)(d)
      spy.post.calledWith('host/channel/123/tag/456').should.be.true
      spy.post.callCount.should.equal(1)
    })

    it('#addTagToChannel when modelToAssociate already exists alreadyAssociatedModels', () => {

      var modelToAssociate = {
        id: 456,
        foo : 'bar'
      }

      actions.addTagToChannel('123', modelToAssociate, [modelToAssociate])
      .should.eql({type: 'NO_ACTION'})
      spy.post.callCount.should.equal(0)
    })

  })

  describe('remove requests', () => {

    it('#removeTagFromChannel - pluralized', () => {

      var modelToDissociate = {
        id: 456,
        foo : 'bar'
      }

      actions.removeTagFromChannel('123', modelToDissociate)(d)
      spy.delete.calledWith('host/channels/123/tags/456').should.be.true
      spy.delete.callCount.should.equal(1)
    })

    it('#removeTagFromChannel - single', () => {

      var modelToDissociate = {
        id: 456,
        foo : 'bar'
      }

      singlizedActions.removeTagFromChannel('123', modelToDissociate)(d)
      spy.delete.calledWith('host/channel/123/tag/456').should.be.true
      spy.delete.callCount.should.equal(1)
    })
  })
});
