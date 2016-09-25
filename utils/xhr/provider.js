var axios = require('axios')
var getResponseFromPath = require('./getResponseFromPath')

const io = typeof io !== 'undefined' ? io : null
const response_path = {
  http: {
    success : 'data',
    error : null
  },

  socket : {
    success : null,
    error : null
  }
}


module.exports = function providerUtil(hostConfig, method, url, headers, postData){
  const shouldUseSocket = hostConfig.socket

  if(shouldUseSocket){

    const config = {
      method,
      url
    }

    if(method === 'post'){
      if(!postData) throw new Error('postData must be defined')
      config.data = postData
    }

    if(headers) config.headers = headers


    return new Promise((resolve, reject) => {

      io.socket.request(config, (resData, jwres) => {

        if(jwres.statusCode.match(/^2/)){
          return resolve(jwres.body)

        }else{
          return reject(jwres.body)
        }
      })
    })

  }else{

    let req

    if(method === 'get' || method === 'delete'){
      req = axios[method](url, headers)

    }else if(method === 'post'){
      if(!postData) throw new Error('postData must be defined')
      req = axios.post(url, postData, headers)
    }

    return new Promise((resolve, reject) => {
      return req
      .then(res => {
        resolve(res.data.data)
      })

      .catch(res => {
        reject(res.data)
      })
    })

  }
}
