"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Socket = exports.Socket = function () {
  function Socket(config) {
    _classCallCheck(this, Socket);

    this.config = config;
  }

  _createClass(Socket, [{
    key: "getData",
    value: function getData() {
      var _this = this;

      return new Promise(function (resolve, reject) {

        io.socket.request(_this.config, function (resData, res) {

          // Check if statusCode is 2xx
          if (res.statusCode.match(/^2/)) {
            return resolve(res);
          } else {
            return reject(res);
          }
        });
      });
    }
  }, {
    key: "extractData",
    value: function extractData(res) {
      return res.body;
    }
  }, {
    key: "extractError",
    value: function extractError(res) {
      return res.error.error;
    }
  }]);

  return Socket;
}();

var Http = exports.Http = function () {
  function Http() {
    _classCallCheck(this, Http);
  }

  _createClass(Http, [{
    key: "getData",
    value: function getData() {}
  }, {
    key: "extractData",
    value: function extractData() {}
  }, {
    key: "extractError",
    value: function extractError() {}
  }]);

  return Http;
}();