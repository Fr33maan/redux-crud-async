var rewire       = require('rewire')
var providerUtil = rewire('../../utils/xhr/provider.js')
var sinon        = require('sinon')
var should       = require('chai').should()
var expect       = require('chai').expect

var spy = {}
var socket = true


describe('XHR Service Provider', function() {

  before('Rewire and spy axios module && host config && getLocalStorage', () => {

    /* --- START REWIRE --- */

    // Spy Axios
    var axios = {
      get : arg => {
        return new Promise(resolve => {resolve({data:{data:[]}}); })
      },
      post : model => {
        return new Promise(resolve => {resolve({data:{data:[]}}); })
      }
    }
    spy.get  = sinon.spy(axios, 'get')
    spy.post = sinon.spy(axios, 'post')

    // Spy socket.io
    var socket = {
      request : config => {return config}
    }
    spy.request = sinon.spy(socket, 'request')

    // Rewire axios and io
    providerUtil.__set__({axios, io : {socket}})

    /* --- END REWIRE --- */

  })

  beforeEach('reset spy states', () => {
    spy.get.reset()
    spy.post.reset()
    spy.request.reset()
  })

  describe('- HTTP', () => {

    describe('- GET request', function(){

      it('#axios - should not have a headers in request', () => {
        providerUtil({}, 'get', 'testUrl')
        expect(spy.get.args[0][0]).to.equal('testUrl')
        expect(spy.get.args[0][1]).to.be.undefined
      })

      it('#axios - should have a headers in request', () => {
        const headers = {Authorization : 'JWT Token'}
        providerUtil({}, 'get', 'testUrl', headers)
        expect(spy.get.args[0][0]).to.equal('testUrl')
        expect(spy.get.args[0][1]).to.equal(headers)
      })
    })

    //////////////////////////////////////////////////////

    describe('- POST request', function(){

      it('#axios - should throw an Error when not called with postData', () => {
        expect((function(){
          providerUtil({}, 'post', 'testUrl')
        })).to.throw(Error)
      })

      it('#axios - should NOT have a headers in request', () => {
        const headers = {Authorization : 'JWT Token'}
        const postData = {test : 123}

        providerUtil({}, 'post', 'testUrl', null, postData)
        expect(spy.post.args[0][0]).to.equal('testUrl')
        expect(spy.post.args[0][1]).to.equal(postData)
      })

      it('#axios - should have a headers in request', () => {
        const headers = {Authorization : 'JWT Token'}
        const postData = {test : 123}

        providerUtil({}, 'post', 'testUrl', headers, postData)
        expect(spy.post.args[0][0]).to.equal('testUrl')
        expect(spy.post.args[0][1]).to.equal(postData)
        expect(spy.post.args[0][2]).to.equal(headers)
      })

    })

  })


  describe('- Socket.io', () => {

    describe('- GET request', function(){

      it('#socket.io - should NOT have a headers in request', () => {
        providerUtil({socket}, 'get', 'testUrl')
        const params = spy.request.args[0][0]

        expect(params.method).to.equal('get')
        expect(params.url).to.equal('testUrl')
      })

      it('#socket.io - should have a headers in request', () => {
        const headers = {Authorization : 'JWT Token'}
        providerUtil({socket}, 'get', 'testUrl', headers)
        const params = spy.request.args[0][0]

        expect(params.method).to.equal('get')
        expect(params.url).to.equal('testUrl')
        expect(params.headers).to.equal(headers)
      })
    })

    //////////////////////////////////////////////////////

    describe('- POST request', function(){

      it('#axios - should throw an Error when not called with postData', () => {
        expect((function(){
          providerUtil({socket}, 'post', 'testUrl')
        })).to.throw(Error)
      })

      it('#axios - should NOT have a headers in request', () => {

        const postData = {test : 123}

        providerUtil({socket}, 'post', 'testUrl', null, postData)
        const params = spy.request.args[0][0]

        expect(params.method).to.equal('post')
        expect(params.url).to.equal('testUrl')
        expect(params.data).to.equal(postData)
      })

      it('#axios - should have a headers in request', () => {
        const headers = {Authorization : 'JWT Token'}
        const postData = {test : 123}

        providerUtil({socket}, 'post', 'testUrl', headers, postData)
        const params = spy.request.args[0][0]

        expect(params.method).to.equal('post')
        expect(params.url).to.equal('testUrl')
        expect(params.data).to.equal(postData)
        expect(params.headers).to.equal(headers)
      })
    })
  })
})
