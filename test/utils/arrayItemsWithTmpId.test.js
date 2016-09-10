var should = require('chai').should()
var arrayItemsWithTmpId = require('../../src/utils/arrayItemsWithTmpId')

describe('utils/arrayItemsWithTmpId', () => {

  it('should return an array with models populated with a tmpId', () => {

    var models = [
      {
        foo: 'bar'
      },{
        bar : 'foo'
      }
    ]

    arrayItemsWithTmpId(models).map(model => {
      model.should.have.property('tmpId')
      model.tmpId.length.should.not.equal(0)
    })
  })
})
