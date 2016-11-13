var sinon = require('sinon')

var fns = {
  constructor : function(a, b, c, d, e){
  },

  get : function(){
    return new Promise(resolve => {resolve({
      data : {
        data : []
      }
    })})
  },

  post : function(data){
    return new Promise(resolve => {resolve({
      data : {
        data : []
      }
    })})
  },

  put : function(data){
    return new Promise(resolve => {resolve({
      data : {
        data : []
      }
    })})
  },

  delete : function(){
    return new Promise(resolve => {resolve({
      data : {
        data : []
      }
    })})
  }
}

export class XHR {
      constructor(a, b, c, d, e){
        fns.constructor(a, b, c, d, e)
      }

      get(){
        return fns.get()
      }

      post(data){
        return fns.post(data)
      }

      put(data){
        return fns.put(data)
      }

      delete(){
        return fns.delete()
      }
    }

export const spy = {
  provider  : sinon.spy(fns, 'constructor'),
  get       : sinon.spy(fns, 'get'),
  post      : sinon.spy(fns, 'post'),
  put       : sinon.spy(fns, 'put'),
  delete    : sinon.spy(fns, 'delete')
}
