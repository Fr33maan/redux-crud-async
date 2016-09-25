
// This file is used to run a unique test

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

var rewire        = require('rewire')
var nock          = require('nock')
var should        = require('chai').should()

var primaryActionGenerator  = rewire('../../src/primaryActionGenerator')
var actionTypes   = require('../../src/primaryActionTypeGenerator')('channel')

var actions       = primaryActionGenerator
const middlewares = [ thunk ]
const mockStore   = configureMockStore(middlewares)





describe('findChannels', () => {
  it('this is a test', (done) => {

    var a = true

    function test(){

      return new Promise((resolve, reject) => {
        return new Promise((resolve, reject) => {
          if(a){
            resolve('world is beautiful')
          }else{
            reject('this sucks')
          }
        })
        .then(() => {resolve(new Error('im an error'))})
        .catch(() => {reject(new Error('im an error bis'))})
      })
    }

    test().then(res => {
      console.log(res)
      console.log('then')
      done()
    })

    .catch(res => {
      console.log('catch')
      console.log(res)
      done()
    })

  })
})
