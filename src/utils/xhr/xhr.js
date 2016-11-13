var path = require('object-path')
var axios = require('axios')
const io = typeof io !== 'undefined' ? io : null

const defaultSocketSuccess = null
const defaultSocketError   = null
const defaultHttpSuccess   = 'data.data'
const defaultHttpError     = 'data'

export class XHR {

  constructor(config, headers, url){

    this.config = config
    this.headers = headers
    this.url = url
    this.service = this.config.socket ? new Socket() : new Http()
  }


  //----------------------
  //--- PUBLIC METHODS ---
  //----------------------
  get(){
    return new Promise((resolve, reject) => {
      return this.service.get(this.headers, this.url)
      .then(res => resolve(this.extractData(res))) // We must explicitely pass the method otherwise "this" won't be available in extract method
      .catch(res => reject(this.extractError(res)))
    })
  }

  post(data){
    return new Promise((resolve, reject) => {
      return this.service.post(this.headers, this.url, data)
      .then(res => resolve(this.extractData(res))) // We must explicitely pass the method otherwise "this" won't be available in extract method
      .catch(res => reject(this.extractError(res)))
    })
  }

  put(data){
    return new Promise((resolve, reject) => {
      return this.service.put(this.headers, this.url, data)
      .then(res => resolve(this.extractData(res))) // We must explicitely pass the method otherwise "this" won't be available in extract method
      .catch(res => reject(this.extractError(res)))
    })
  }

  delete(){
    return new Promise((resolve, reject) => {
      return this.service.delete(this.headers, this.url)
      .then(res => resolve(this.extractData(res))) // We must explicitely pass the method otherwise "this" won't be available in extract method
      .catch(res => reject(this.extractError(res)))
    })
  }


  //-----------------------
  //--- PRIVATE METHODS ---
  //-----------------------
  extractData(data){
    let schema
    // Define schemas depending of socket/http
    switch(this.service.constructor.name){
      case 'Socket':
        schema = path.get(this.config, 'responseSchemas.socket.success') || defaultSocketSuccess

      case 'Http':
        schema = path.get(this.config, 'responseSchemas.http.success') || defaultHttpSuccess
    }

    // Returning response
    return schema ? path.get(data, schema) : data

  }

  extractError(data){
    let schema

    // Define schemas depending of socket/http
    switch(this.service.constructor.name){
      case 'Socket':
        schema = path.get(this.config, 'responseSchemas.socket.error') || defaultSocketError

      case 'Http':
        schema = path.get(this.config, 'responseSchemas.http.error') || defaultHttpError
    }
    // Returning response
    return schema ? path.get(data, schema) : data
  }

}


// Socket classes used by provider class
class Socket {

  get(headers, url){

    const options = {
      method: 'get',
      headers,
      url
    }

    return this.request(options)
  }

  post(headers, url, data){
    const options = {
      method: 'post',
      headers,
      url,
      data
    }

    return this.request(options)
  }

  put(headers, url, data){
    const options = {
      method: 'put',
      headers,
      url,
      data
    }

    return this.request(options)
  }

  delete(headers, url){
    const options = {
      method: 'delete',
      headers,
      url
    }

    return this.request(options)
  }

  request(config){
    return new Promise((resolve, reject) => {

      io.socket.request(config, (res, JWR) => {

        // Check if statusCode is 2xx
        if(JWR.statusCode.match(/^2/)){
          return resolve(res)

        }else{
          return reject(res)
        }

      })
    })
  }
}


// Http (axios wrapper) classes used by provider class
class Http {

  get(headers, url){
    return axios.get(url, headers)
  }

  post(headers, url, data){
    return axios.post(url, data, headers)
  }

  put(headers, url, data){
    return axios.put(url, data, headers)
  }

  delete(headers, url){
    return axios.delete(url, headers)
  }
}


// module.exports = function providerUtil(hostConfig, method, url, headers, postData){
//
//
// }
