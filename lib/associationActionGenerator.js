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
var windowAccess = typeof window !== 'undefined' ? window : {};
var now = Date.now;

module.exports = function (primaryModel, associatedModel, hostConfig) {
  var _ref6;

  if (!hostConfig || !hostConfig.host) throw new Error('You must instantiate redux-crud-async.associationActionFor with a host => {host: "http://exemple.com"}');

  checkModelName(primaryModel);
  checkModelName(associatedModel);

  var primaryModelName = primaryModel;
  var primaryModelNameCap = capitalize(primaryModel);
  var primaryModelNameUp = primaryModel.toUpperCase();
  var pluralPrimaryModelName = pluralize(primaryModel);

  var singleAssociatedModelName = associatedModel;
  var singleAssociatedModelNameCap = capitalize(associatedModel);
  var singleAssociatedModelNameUp = associatedModel.toUpperCase();

  var pluralAssociatedModelName = pluralize(associatedModel);
  var pluralAssociatedModelNameCap = capitalize(pluralize(associatedModel));
  var pluralAssociatedModelNameUp = pluralize(associatedModel).toUpperCase();

  var host = hostConfig.host;
  var prefix = hostConfig.prefix;
  var baseUrl = host + (prefix ? '/' + prefix : '');
  var pluralizeUrl = typeof hostConfig.pluralizeModels === 'undefined' ? true : hostConfig.pluralizeModels;
  var urlPrimaryModel = pluralizeUrl ? pluralPrimaryModelName : primaryModelName;
  var urlAssociatedModel = pluralizeUrl ? pluralAssociatedModelName : singleAssociatedModelName;

  var bearers = {};
  var authConfig = path.get(hostConfig, 'apiSpecs.' + primaryModelName + pluralAssociatedModelNameCap + '.auth');
  var localStorageName = path.get(hostConfig, 'localStorageName') || 'JWT';
  var hasLocalStorage = path.get(windowAccess, 'localStorage.getItem');

  if (authConfig && hasLocalStorage) {

    authConfig.forEach(function (action) {
      // Return a function to get the token each time the action is dispatched
      bearers[action] = function () {
        var JWT_Token = windowAccess.localStorage.getItem(localStorageName);

        return {
          headers: { 'Authorization': 'Bearer ' + JWT_Token }
        };
      };
    });
  }

  var findPrimaryAssociatedModels = 'find' + primaryModelNameCap + pluralAssociatedModelNameCap;
  var addAssociatedModelToPrimary = 'add' + singleAssociatedModelNameCap + 'To' + primaryModelNameCap;
  var removeAssociatedModelFromPrimary = 'remove' + singleAssociatedModelNameCap + 'From' + primaryModelNameCap;

  var FIND_PRIMARY_ASSOCIATED_MODELS = 'FIND_' + primaryModelNameUp + '_' + pluralAssociatedModelNameUp;
  var ADD_ASSOCIATED_MODEL_TO_PRIMARY = 'ADD_' + singleAssociatedModelNameUp + '_TO_' + primaryModelNameUp;
  var REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY = 'REMOVE_' + singleAssociatedModelNameUp + '_FROM_' + primaryModelNameUp;

  var ationsTypes = ['START', 'SUCCESS', 'ERROR'];

  var A = {};

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = ationsTypes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var actionType = _step.value;

      A['FIND_PRIMARY_ASSOCIATED_MODELS' + '_' + actionType] = FIND_PRIMARY_ASSOCIATED_MODELS + '_' + actionType;
      A['ADD_ASSOCIATED_MODEL_TO_PRIMARY' + '_' + actionType] = ADD_ASSOCIATED_MODEL_TO_PRIMARY + '_' + actionType;
      A['REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY' + '_' + actionType] = REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY + '_' + actionType;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return _ref6 = {}, _defineProperty(_ref6, findPrimaryAssociatedModels, function (primaryModelId, associatedModelId) {

    function start() {
      return { type: A.FIND_PRIMARY_ASSOCIATED_MODELS_START };
    }
    function success(models) {
      var _ref;

      return _ref = {
        type: A.FIND_PRIMARY_ASSOCIATED_MODELS_SUCCESS
      }, _defineProperty(_ref, primaryModelName + pluralAssociatedModelNameCap, modelsWithTmpId(models)), _defineProperty(_ref, 'receivedAt', now()), _ref;
    }
    function error(error, primaryModelId) {
      return {
        type: A.FIND_PRIMARY_ASSOCIATED_MODELS_ERROR,
        data: primaryModelId,
        error: error
      };
    }
    return function (dispatch) {
      dispatch(start());
      associatedModelId = associatedModelId ? '/' + associatedModelId : '';

      // If a rule exists we execute the function to get the token dynamically
      var bearer = typeof bearers[findPrimaryAssociatedModels] !== 'undefined' ? bearers[findPrimaryAssociatedModels]() : undefined;

      return axios.get(baseUrl + '/' + urlPrimaryModel + '/' + primaryModelId + '/' + urlAssociatedModel + associatedModelId, bearer).then(function (res) {
        return dispatch(success(res.data.data));
      }).catch(function (res) {
        return dispatch(error(res.data, primaryModelId));
      });
    };
  }), _defineProperty(_ref6, addAssociatedModelToPrimary, function (primaryModelId, modelToAssociate, alreadyAssociatedModels) {
    function start(modelToAssociate) {
      return _defineProperty({
        type: A.ADD_ASSOCIATED_MODEL_TO_PRIMARY_START
      }, primaryModelName + singleAssociatedModelNameCap, _extends({}, modelToAssociate, {
        tmpId: uuid.v4()
      }));
    }
    function success(modelToAssociate) {
      return _defineProperty({
        type: A.ADD_ASSOCIATED_MODEL_TO_PRIMARY_SUCCESS
      }, primaryModelName + singleAssociatedModelNameCap, modelToAssociate);
    }
    function error(error, modelToAssociate) {
      return {
        type: A.ADD_ASSOCIATED_MODEL_TO_PRIMARY_ERROR,
        data: modelToAssociate,
        error: error
      };
    }

    if (typeof alreadyAssociatedModels !== 'undefined') {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = alreadyAssociatedModels[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var associated = _step2.value;

          // If we try to add an already associated model -> nothing happen
          // This check consider that associating === associated so nothing happen if you start associating twice
          if (associated.id === modelToAssociate.id) return { type: 'NO_ACTION' };
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    // If a rule exists we execute the function to get the token dynamically
    var bearer = typeof bearers[addAssociatedModelToPrimary] !== 'undefined' ? bearers[addAssociatedModelToPrimary]() : undefined;

    // Means that model has already been created in database
    if ('id' in modelToAssociate) {
      return function (dispatch) {
        var associatedModelWithTmpId = dispatch(start(modelToAssociate))[primaryModelName + singleAssociatedModelNameCap];

        return axios.post(baseUrl + '/' + urlPrimaryModel + '/' + primaryModelId + '/' + urlAssociatedModel + '/' + modelToAssociate.id, bearer).then(function (res) {
          return dispatch(success(associatedModelWithTmpId));
        }).catch(function (res) {
          return dispatch(error(res.data, associatedModelWithTmpId));
        });
      };

      // Means that model does not exists in database
    } else {
        return function (dispatch) {
          var associatedModelWithTmpId = dispatch(start(modelToAssociate))[primaryModelName + singleAssociatedModelNameCap];

          return axios.post(baseUrl + '/' + urlPrimaryModel + '/' + primaryModelId + '/' + urlAssociatedModel, modelToAssociate, bearer).then(function (res) {
            return dispatch(success(associatedModelWithTmpId));
          }).catch(function (res) {
            return dispatch(error(res.data, associatedModelWithTmpId));
          });
        };
      }
  }), _defineProperty(_ref6, removeAssociatedModelFromPrimary, function (primaryModelId, modelToDissociate) {
    function start(modelToDissociate) {
      return _defineProperty({
        type: A.REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY_START
      }, primaryModelName + singleAssociatedModelNameCap, modelToDissociate);
    }
    function success(modelToDissociate) {
      return _defineProperty({
        type: A.REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY_SUCCESS
      }, primaryModelName + singleAssociatedModelNameCap, modelToDissociate);
    }
    function error(error, modelToDissociate) {
      return {
        type: A.REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY_ERROR,
        data: modelToDissociate,
        error: error
      };
    }

    return function (dispatch) {
      dispatch(start(modelToDissociate));
      // If a rule exists we execute the function to get the token dynamically
      var bearer = typeof bearers[removeAssociatedModelFromPrimary] !== 'undefined' ? bearers[removeAssociatedModelFromPrimary]() : undefined;

      return axios.delete(baseUrl + '/' + urlPrimaryModel + '/' + primaryModelId + '/' + urlAssociatedModel + '/' + modelToDissociate.id, bearer).then(function (res) {
        return dispatch(success(modelToDissociate));
      }).catch(function (res) {
        return dispatch(error(res.data, modelToDissociate));
      });
    };
  }), _ref6;
};