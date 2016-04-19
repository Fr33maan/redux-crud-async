'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var path = require('object-path');
var uuid = require('uuid');
var axios = require('axios');
var checkModelName = require('../utils/checkModelName');
var capitalize = require('../utils/capitalize');
var pluralize = require('pluralize');
var modelsWithTmpId = require('../utils/arrayItemsWithTmpId');
var now = Date.now;

var chalk = require('chalk');
var redError = function redError(msg) {
  return console.log(msg);
};

module.exports = function (modelName, hostConfig) {
  var _ref5;

  if (!hostConfig || !hostConfig.host) throw new Error('You must instantiate redux-crud-async.primaryActionFor with a host => {host: "http://exemple.com"}');

  checkModelName(modelName);

  var singleModelName = modelName;
  var singleModelNameUp = modelName.toUpperCase();
  var singleModelNameCap = capitalize(singleModelName);

  var pluralModelName = pluralize(modelName);
  var pluralModelNameUp = pluralModelName.toUpperCase();
  var pluralModelNameCap = capitalize(pluralModelName);

  // ---------------
  // --HOST CONFIG--
  // ---------------
  var host = hostConfig.host;
  var prefix = hostConfig.prefix;
  var baseUrl = host + (prefix ? '/' + prefix : '');
  var pluralizeUrl = typeof hostConfig.pluralizeModels === 'undefined' ? true : hostConfig.pluralizeModels;
  var urlModel = pluralizeUrl ? pluralModelName : singleModelName;

  var bearers = {};
  var authConfig = path.get(hostConfig, 'apiSpecs.' + singleModelName + '.auth');
  var sessionStorageName = path.get(hostConfig, 'sessionStorageName') || 'JWT';
  var hasSessionStorage = typeof window !== 'undefined' && path.get(window, 'sessionStorage.getItem');

  if (authConfig && hasSessionStorage) {
    (function () {

      var JWT_Token = window.sessionStorage.getItem(sessionStorageName);

      authConfig.forEach(function (action) {
        bearers[action] = {
          headers: { 'Authorization': 'Bearer ' + JWT_Token }
        };
      });
    })();
  }

  var findModel = 'find' + singleModelNameCap;
  var findModels = 'find' + pluralModelNameCap;
  var createModel = 'create' + singleModelNameCap;

  // --------------
  // --- CREATE ---
  // --------------
  // -- SINGLE
  var SINGLE_CREATE_START = singleModelNameUp + '_CREATE_START';
  var SINGLE_CREATE_SUCCESS = singleModelNameUp + '_CREATE_SUCCESS';
  var SINGLE_CREATE_ERROR = singleModelNameUp + '_CREATE_ERROR';

  // -- PLURAL
  var PLURAL_CREATE_START = pluralModelNameUp + '_CREATE_START';
  var PLURAL_CREATE_SUCCESS = pluralModelNameUp + '_CREATE_SUCCESS';
  var PLURAL_CREATE_ERROR = pluralModelNameUp + '_CREATE_ERROR';

  // --------------
  // ---- FIND ----
  // --------------
  // -- SINGLE
  var SINGLE_FIND_START = singleModelNameUp + '_FIND_START';
  var SINGLE_FIND_SUCCESS = singleModelNameUp + '_FIND_SUCCESS';
  var SINGLE_FIND_ERROR = singleModelNameUp + '_FIND_ERROR';

  // -- PLURAL
  var PLURAL_FIND_START = pluralModelNameUp + '_FIND_START';
  var PLURAL_FIND_SUCCESS = pluralModelNameUp + '_FIND_SUCCESS';
  var PLURAL_FIND_ERROR = pluralModelNameUp + '_FIND_ERROR';

  // --------------
  // --- UPDATE ---
  // --------------
  // -- SINGLE
  var SINGLE_UPDATE_START = singleModelNameUp + '_UPDATE_START';
  var SINGLE_UPDATE_SUCCESS = singleModelNameUp + '_UPDATE_SUCCESS';
  var SINGLE_UPDATE_ERROR = singleModelNameUp + '_UPDATE_ERROR';

  // -- PLURAL
  var PLURAL_UPDATE_START = pluralModelNameUp + '_UPDATE_START';
  var PLURAL_UPDATE_SUCCESS = pluralModelNameUp + '_UPDATE_SUCCESS';
  var PLURAL_UPDATE_ERROR = pluralModelNameUp + '_UPDATE_ERROR';

  // --------------
  // --- DESTROY --
  // --------------
  // -- SINGLE
  var SINGLE_DESTROY_START = singleModelNameUp + '_DESTROY_START';
  var SINGLE_DESTROY_SUCCESS = singleModelNameUp + '_DESTROY_SUCCESS';
  var SINGLE_DESTROY_ERROR = singleModelNameUp + '_DESTROY_ERROR';

  // -- PLURAL
  var PLURAL_DESTROY_START = pluralModelNameUp + '_DESTROY_START';
  var PLURAL_DESTROY_SUCCESS = pluralModelNameUp + '_DESTROY_SUCCESS';
  var PLURAL_DESTROY_ERROR = pluralModelNameUp + '_DESTROY_ERROR';

  return _ref5 = {}, _defineProperty(_ref5, findModel, function (modelId) {
    function start() {
      return { type: SINGLE_FIND_START };
    }
    function success(model) {
      var _ref;

      return _ref = {
        type: SINGLE_FIND_SUCCESS
      }, _defineProperty(_ref, singleModelName, model), _defineProperty(_ref, 'receivedAt', now()), _ref;
    }
    function error(error, modelId) {
      return {
        type: SINGLE_FIND_ERROR,
        data: modelId,
        error: error
      };
    }

    return function (dispatch) {

      if (!modelId) {
        return new Promise(function (resolve, reject) {
          resolve(dispatch(error({ message: 'no modelId given for action ' + 'find' + singleModelNameCap }, undefined)));
        });
      }

      dispatch(start());
      return axios.get(baseUrl + '/' + urlModel + '/' + modelId, bearers[findModel]).then(function (res) {
        return dispatch(success(res.data.data));
      }).catch(function (res) {
        return dispatch(error(res.data, modelId));
      });
    };
  }), _defineProperty(_ref5, findModels, function () {
    var request = arguments.length <= 0 || arguments[0] === undefined ? 'limit=10000' : arguments[0];


    request = request.length > 0 ? '?' + request : '';

    function start() {
      return { type: PLURAL_FIND_START };
    }
    function success(models) {
      var _ref2;

      return _ref2 = {
        type: PLURAL_FIND_SUCCESS
      }, _defineProperty(_ref2, pluralModelName, modelsWithTmpId(models)), _defineProperty(_ref2, 'receivedAt', now()), _ref2;
    }
    function error(error) {
      return {
        type: PLURAL_FIND_ERROR,
        error: error
      };
    }
    return function (dispatch) {
      dispatch(start());
      return axios.get(baseUrl + '/' + urlModel + request, bearers[findModels]).then(function (res) {
        return dispatch(success(res.data.data));
      }).catch(function (res) {
        return dispatch(error(res.data));
      });
    };
  }), _defineProperty(_ref5, createModel, function (model) {
    function start(model) {
      return _defineProperty({
        type: SINGLE_CREATE_START
      }, singleModelName, _extends({}, model, {
        tmpId: uuid.v4()
      }));
    }
    function success(model) {
      return _defineProperty({
        type: SINGLE_CREATE_SUCCESS
      }, singleModelName, model);
    }
    function error(error, model) {
      return {
        type: SINGLE_CREATE_ERROR,
        data: model,
        error: error
      };
    }

    return function (dispatch) {
      if (!model || Object.keys(model).length === 0) {
        return new Promise(function (resolve, reject) {
          resolve(dispatch(error({ message: 'no model given for action create' + singleModelNameCap }, undefined)));
        });
      }

      var modelWithTmpId = dispatch(start(model))[singleModelName];
      var modelToCreate = {};
      for (var attribute in modelWithTmpId) {
        if (attribute !== 'tmpId') modelToCreate[attribute] = modelWithTmpId[attribute];
      }
      try {
        return axios.post(baseUrl + '/' + urlModel, modelToCreate, bearers[createModel]).then(function (res) {
          return dispatch(success(modelWithTmpId));
        }).catch(function (res) {
          return dispatch(error(res.data, modelWithTmpId));
        });
      } catch (e) {
        redError;
      }
    };
  }), _ref5;
};