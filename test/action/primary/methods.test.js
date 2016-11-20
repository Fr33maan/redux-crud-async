var should  = require('chai').should()
var actions = require('../../../src/primaryActionGenerator')('channel', {host: '123'})

describe('All actions methods', () => {

  describe('find methods', () => {
    it('actions should have a single find action', () => {
      actions.should.have.property('findChannel')
    })

    it('actions should have a plural find action', () => {
      actions.should.have.property('findChannels')
    })
  })

  describe('create methods', () => {
    it('actions should have a single create action', () => {
      actions.should.have.property('createChannel')
    })
  })

  describe('update methods', () => {
    it('actions should have a single update action', () => {
      actions.should.have.property('updateChannel')
    })
  })

  describe('destroy methods', () => {
    it('actions should have a single destroy action', () => {
      actions.should.have.property('destroyChannel')
    })
  })

})
