var axios = require('axios')
const io = typeof io !== 'undefined' ? io : null


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
          return resolve({
            data : {
              data : jwres.body
            }
          })

        }else{
          return reject({
            data : jwres.body
          })
        }

      })

    })

  }else{

    if(method === 'get' || method === 'delete'){
      return axios[method](url, headers)

    }else if(method === 'post'){

      if(!postData) throw new Error('postData must be defined')
      return axios.post(url, postData, headers)
    }

  }

}
