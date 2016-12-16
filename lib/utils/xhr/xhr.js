'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('object-path');
var axios = require('axios');
var io = typeof window !== 'undefined' && typeof window.io !== 'undefined' ? window.io : null;

var defaultSocketSuccess = null;
var defaultSocketError = null;
var defaultHttpSuccess = 'data.data';
var defaultHttpError = 'data';

var XHR = exports.XHR = function () {
  function XHR(config, headers, url) {
    _classCallCheck(this, XHR);

    this.config = config;
    this.headers = headers;
    this.url = url;
    this.service = this.config.socket ? new Socket() : new Http();
  }

  //----------------------
  //--- PUBLIC METHODS ---
  //----------------------


  _createClass(XHR, [{
    key: 'get',
    value: function get() {
      var _this = this;

      // Add caching here by checking url and last request date

      // If no cache is available, make the request
      return new Promise(function (resolve, reject) {
        return _this.service.get(_this.headers, _this.url).then(function (res) {
          return resolve(_this.extractData(res));
        }) // We must explicitely pass the method otherwise "this" won't be available in extract method
        .catch(function (res) {
          return reject(_this.extractError(res));
        });
      });
    }
  }, {
    key: 'post',
    value: function post(data) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        return _this2.service.post(_this2.headers, _this2.url, data).then(function (res) {
          return resolve(_this2.extractData(res));
        }) // We must explicitely pass the method otherwise "this" won't be available in extract method
        .catch(function (res) {
          return reject(_this2.extractError(res));
        });
      });
    }
  }, {
    key: 'put',
    value: function put(data) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        return _this3.service.put(_this3.headers, _this3.url, data).then(function (res) {
          return resolve(_this3.extractData(res));
        }) // We must explicitely pass the method otherwise "this" won't be available in extract method
        .catch(function (res) {
          return reject(_this3.extractError(res));
        });
      });
    }
  }, {
    key: 'delete',
    value: function _delete() {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        return _this4.service.delete(_this4.headers, _this4.url).then(function (res) {
          return resolve(_this4.extractData(res));
        }) // We must explicitely pass the method otherwise "this" won't be available in extract method
        .catch(function (res) {
          return reject(_this4.extractError(res));
        });
      });
    }

    //-----------------------
    //--- PRIVATE METHODS ---
    //-----------------------

  }, {
    key: 'extractData',
    value: function extractData(data) {
      var schema = void 0;
      // Define schemas depending of socket/http
      switch (this.service.constructor.name) {
        case 'Socket':
          schema = path.get(this.config, 'responseSchemas.socket.success') || defaultSocketSuccess;

        case 'Http':
          schema = path.get(this.config, 'responseSchemas.http.success') || defaultHttpSuccess;
      }

      // Returning response
      return schema ? path.get(data, schema) : data;
    }
  }, {
    key: 'extractError',
    value: function extractError(data) {
      var schema = void 0;

      // Define schemas depending of socket/http
      switch (this.service.constructor.name) {
        case 'Socket':
          schema = path.get(this.config, 'responseSchemas.socket.error') || defaultSocketError;

        case 'Http':
          schema = path.get(this.config, 'responseSchemas.http.error') || defaultHttpError;
      }
      // Returning response
      return schema ? path.get(data, schema) : data;
    }
  }]);

  return XHR;
}();

// Socket classes used by provider class


var Socket = function () {
  function Socket() {
    _classCallCheck(this, Socket);
  }

  _createClass(Socket, [{
    key: 'get',
    value: function get(headers, url) {

      var options = {
        method: 'get',
        headers: headers,
        url: url
      };

      return this.request(options);
    }
  }, {
    key: 'post',
    value: function post(headers, url, data) {
      var options = {
        method: 'post',
        headers: headers,
        url: url,
        data: data
      };

      return this.request(options);
    }
  }, {
    key: 'put',
    value: function put(headers, url, data) {
      var options = {
        method: 'put',
        headers: headers,
        url: url,
        data: data
      };

      return this.request(options);
    }
  }, {
    key: 'delete',
    value: function _delete(headers, url) {
      var options = {
        method: 'delete',
        headers: headers,
        url: url
      };

      return this.request(options);
    }
  }, {
    key: 'request',
    value: function request(config) {
      return new Promise(function (resolve, reject) {

        io.socket.request(config, function (res, JWR) {

          // Check if statusCode is 2xx
          if (String(JWR.statusCode).match(/^2/)) {
            return resolve(res);
          } else {
            return reject(res);
          }
        });
      });
    }
  }]);

  return Socket;
}();

// Http (axios wrapper) classes used by provider class


var Http = function () {
  function Http() {
    _classCallCheck(this, Http);
  }

  _createClass(Http, [{
    key: 'get',
    value: function get(headers, url) {
      return axios.get(url, headers);
    }
  }, {
    key: 'post',
    value: function post(headers, url, data) {
      return axios.post(url, data, headers);
    }
  }, {
    key: 'put',
    value: function put(headers, url, data) {
      return axios.put(url, data, headers);
    }
  }, {
    key: 'delete',
    value: function _delete(headers, url) {
      return axios.delete(url, headers);
    }
  }]);

  return Http;
}();

// module.exports = function providerUtil(hostConfig, method, url, headers, postData){
//
//
// }