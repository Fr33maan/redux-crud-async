var should  = require('chai').should()
var actions = require('../../../src/associationActionGenerator')('channel', 'tag', {host: '123'})


describe('All actions methods', () => {

  describe('find methods', () => {
    it('actions should have a single find action', () => {
      actions.should.have.property('findChannelTags')
    })
  })

  describe('add methods', () => {
    it('actions should have a add action', () => {
      actions.should.have.property('addTagToChannel')
    })
  })

  describe('remove methods', () => {
    it('actions should have a remove action', () => {
      actions.should.have.property('removeTagFromChannel')
    })
  })
})
