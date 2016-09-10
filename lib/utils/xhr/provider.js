'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var axios = require('axios');
var io = typeof io !== 'undefined' ? io : null;

module.exports = function providerUtil(hostConfig, method, url, headers, postData) {
  var shouldUseSocket = hostConfig.socket;

  if (shouldUseSocket) {
    var _ret = function () {

      var config = {
        method: method,
        url: url
      };

      if (method === 'post') {
        if (!postData) throw new Error('postData must be defined');
        config.data = postData;
      }

      if (headers) config.headers = headers;

      return {
        v: new Promise(function (resolve, reject) {

          io.socket.request(config, function (resData, jwres) {

            if (jwres.statusCode.match(/^2/)) {
              return resolve({
                data: {
                  data: jwres.body
                }
              });
            } else {
              return reject({
                data: jwres.body
              });
            }
          });
        })
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } else {

    if (method === 'get' || method === 'delete') {
      return axios[method](url, headers);
    } else if (method === 'post') {

      if (!postData) throw new Error('postData must be defined');
      return axios.post(url, postData, headers);
    }
  }
};