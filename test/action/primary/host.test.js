var rewire = require('rewire')
var primaryActionGenerator = rewire('../../../generators/primaryActionGenerator')
var sinon = require('sinon')
var should = require('chai').should()

var actions = primaryActionGenerator
var get

describe('primaryActionGenerator', function() {

  before('Rewire primaryActionGenerator axios module and host config', () => {
    var axios = {
      get : modelId => {
        return new Promise(resolve => {resolve({data:{data:[]}})})
      }
    }

    get  = sinon.spy(axios, 'get')

    const hostConfig = {
      host : 'host'
    }

    primaryActionGenerator.__set__({axios, hostConfig})

  })

  it('should call the prefixed url', () => {
    actions('channel')
    .findChannel('123')(() => {})

    get.calledWith('host/channels/123').should.be.true
  })


  it('should call the UNprefixed url', () => {

    primaryActionGenerator.__with__({hostConfig : {host: 'host', prefix : 'prefix'}})(() => {
      actions('channel')
      .findChannel('123')(() => {})

      get.calledWith('host/prefix/channels/123').should.be.true
    })

  })
});
