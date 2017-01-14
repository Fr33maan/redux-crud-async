'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var path = require('object-path');
var axios = require('axios');
var checkModelName = require('./utils/checkModelName');
var capitalize = require('./utils/capitalize');
var pluralize = require('pluralize');
var modelsWithTmpId = require('./utils/arrayItemsWithTmpId');
var windowAccess = typeof window !== 'undefined' ? window : {}; // Make it available in tests
var now = Date.now;

var headersUtil = require('./utils/xhr/headers');
var XHR = require('./utils/xhr/xhr').XHR;

module.exports = function (modelName, hostConfig) {
  var _ref7;

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

  var findModel = 'find' + singleModelNameCap;
  var findModels = 'find' + pluralModelNameCap;
  var createModel = 'create' + singleModelNameCap;
  var updateModel = 'update' + singleModelNameCap;
  var destroyModel = 'destroy' + singleModelNameCap;

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

  // --------------
  // --- DESTROY --
  // --------------
  // -- SINGLE
  var SINGLE_DESTROY_START = singleModelNameUp + '_DESTROY_START';
  var SINGLE_DESTROY_SUCCESS = singleModelNameUp + '_DESTROY_SUCCESS';
  var SINGLE_DESTROY_ERROR = singleModelNameUp + '_DESTROY_ERROR';

  return _ref7 = {}, _defineProperty(_ref7, findModel, function (modelId) {
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

      // Create headers for each action - depends on hostConfig
      // See utils/headers
      var headers = headersUtil(hostConfig, singleModelName);

      return new XHR(hostConfig, headers[findModel], baseUrl + '/' + urlModel + '/' + modelId).get().then(function (res) {
        return dispatch(success(res));
      }).catch(function (err) {
        return dispatch(error(err, modelId));
      });
    };
  }), _defineProperty(_ref7, findModels, function () {
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

      return new XHR(hostConfig, headers[findModels], baseUrl + '/' + urlModel + request).get().then(function (res) {
        return dispatch(success(res));
      }).catch(function (err) {
        return dispatch(error(err));
      });
    };
  }), _defineProperty(_ref7, createModel, function (model) {
    function start(model) {
      return _defineProperty({
        type: SINGLE_CREATE_START
      }, singleModelName, _extends({}, model));
    }
    function success(model) {
      var _ref4;

      return _ref4 = {
        type: SINGLE_CREATE_SUCCESS
      }, _defineProperty(_ref4, singleModelName, model), _defineProperty(_ref4, 'message', singleModelName + ' has been created'), _ref4;
    }
    function error(error, model) {
      return {
        type: SINGLE_CREATE_ERROR,
        data: model,
        error: error
      };
    }

    return function (dispatch) {
      // Check if the object passed to create has properties or is a FormData Object
      if ((!model || Object.keys(model).length === 0) && (typeof FormData === 'undefined' || typeof FormData !== 'undefined' && !(model instanceof FormData))) {
        return new Promise(function (resolve, reject) {
          resolve(dispatch(error({ message: 'no model given for action create' + singleModelNameCap }, undefined)));
        });
      }

      // Add ability to upload FormData
      if (typeof FormData !== 'undefined' && model instanceof FormData) {
        var modelToCreate = model;

        // If FormData is used, tmpId will not be set and model will not be added to models in reducer
      } else {
          var modelWithTmpId = dispatch(start(model))[singleModelName];
          var modelToCreate = {};
          for (var attribute in modelWithTmpId) {
            if (attribute !== 'tmpId') modelToCreate[attribute] = modelWithTmpId[attribute];
          }
        }

      // Create headers for each action - depends on hostConfig
      // See utils/headers
      var headers = headersUtil(hostConfig, singleModelName);

      return new XHR(hostConfig, headers[createModel], baseUrl + '/' + urlModel).post(modelToCreate).then(function (res) {
        return dispatch(success(modelWithTmpId));
      }).catch(function (err) {
        return dispatch(error(err, modelWithTmpId));
      });
    };
  }), _defineProperty(_ref7, updateModel, function (newModel) {
    function start() {
      return _defineProperty({
        type: SINGLE_UPDATE_START
      }, singleModelName, newModel);
    }
    function success(validatedModel) {
      var _ref6;

      return _ref6 = {
        type: SINGLE_UPDATE_SUCCESS
      }, _defineProperty(_ref6, singleModelName, validatedModel), _defineProperty(_ref6, 'message', singleModelName + ' has been updated'), _ref6;
    }
    function error(error) {
      return {
        type: SINGLE_UPDATE_ERROR,
        error: error
      };
    }

    return function (dispatch) {
      if (!newModel) {
        return new Promise(function (resolve, reject) {
          resolve(dispatch(error({ message: 'no model given for action update' + singleModelNameCap }, undefined)));
        });
      }

      // Create headers for each action - depends on hostConfig
      // See utils/headers
      var headers = headersUtil(hostConfig, singleModelName);

      dispatch(start());
      return new XHR(hostConfig, headers[updateModel], baseUrl + '/' + urlModel + '/' + newModel.id).put(newModel).then(function (res) {
        return dispatch(success(res));
      }).catch(function (err) {
        return dispatch(error(err));
      });
    };
  }), _defineProperty(_ref7, destroyModel, function (modelId) {
    function start() {
      return {
        type: SINGLE_DESTROY_START,
        modelId: modelId
      };
    }
    function success() {
      return {
        type: SINGLE_DESTROY_SUCCESS,
        message: singleModelName + ' has been destroyed',
        modelId: modelId
      };
    }
    function error(error) {
      return {
        type: SINGLE_DESTROY_ERROR,
        data: modelId,
        error: error
      };
    }

    return function (dispatch) {

      dispatch(start());

      // Create headers for each action - depends on hostConfig
      // See utils/headers
      var headers = headersUtil(hostConfig, singleModelName);

      return new XHR(hostConfig, headers[destroyModel], baseUrl + '/' + urlModel + '/' + modelId).delete().then(function (res) {
        return dispatch(success(res));
      }).catch(function (err) {
        return dispatch(error(err));
      });
    };
  }), _ref7;
};