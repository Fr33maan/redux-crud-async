
var expect               = require('chai').expect
var should               = require('chai').should()
var reduxCrudAsyncModule = require('../../index')

var crud                 = new reduxCrudAsyncModule({host : 'http://test.com', prefix : 'v1'})

describe('index.js', () => {

  it('should have a host properties', () => {
    crud.should.have.property('hostConfig')
    crud.hostConfig.host.should.equal('http://test.com')
  })

  it('should have a prefix properties', () => {
    crud.hostConfig.prefix.should.equal('v1')
  })

  it('should have a all generators as methods', () => {
    crud.should.have.property('primaryActionTypesFor')
    crud.should.have.property('primaryActionsFor')
    crud.should.have.property('primaryReducerFor')
    crud.should.have.property('associationActionTypesFor')
    crud.should.have.property('associationActionsFor')
    crud.should.have.property('associationReducerFor')
  })

})
