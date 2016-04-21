'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var capitalize = require('../utils/capitalize');
var pluralize = require('pluralize');

// console.log(actionTypes)

module.exports = function (modelName) {
  var _ref;

  var singleModelName = modelName;
  var singleModelNameUp = modelName.toUpperCase();
  var singleModelNameCap = capitalize(singleModelName);

  var pluralModelName = pluralize(modelName);
  var pluralModelNameUp = pluralModelName.toUpperCase();
  var pluralModelNameCap = capitalize(pluralModelName);

  var stateTypes = ['START', 'SUCCESS', 'ERROR'];
  var actionTypes = ['FIND', 'CREATE', 'UPDATE', 'DELETE'];
  var A = {};

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = actionTypes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var actionType = _step.value;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = stateTypes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var stateType = _step2.value;

          A['SINGLE_' + actionType + '_' + stateType] = singleModelNameUp + '_' + actionType + '_' + stateType;
          A['PLURAL_' + actionType + '_' + stateType] = pluralModelNameUp + '_' + actionType + '_' + stateType;
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

  A.EMPTY_MODEL = 'EMPTY_' + singleModelNameUp;

  return _ref = {}, _defineProperty(_ref, 'isFinding' + singleModelNameCap, function (_undefined) {
    function undefined(_x, _x2) {
      return _undefined.apply(this, arguments);
    }

    undefined.toString = function () {
      return _undefined.toString();
    };

    return undefined;
  }(function (state, action) {

    if (state === undefined) state = false;

    switch (action.type) {

      case A.SINGLE_FIND_START:
        return true;

      case A.SINGLE_FIND_SUCCESS:
        return false;

      default:
        return state;
    }
  })), _defineProperty(_ref, singleModelName, function (state, action) {

    if (state === undefined) state = {};

    switch (action.type) {

      case A.SINGLE_FIND_SUCCESS:
        return action[singleModelName] || state;

      case A.EMPTY_MODEL:
        return {};

      default:
        return state;
    }
  }), _defineProperty(_ref, 'isFinding' + pluralModelNameCap, function (_undefined2) {
    function undefined(_x3, _x4) {
      return _undefined2.apply(this, arguments);
    }

    undefined.toString = function () {
      return _undefined2.toString();
    };

    return undefined;
  }(function (state, action) {

    if (state === undefined) state = false;

    switch (action.type) {

      case A.PLURAL_FIND_START:
        return true;

      case A.PLURAL_FIND_ERROR:
      case A.PLURAL_FIND_SUCCESS:
        return false;

      default:
        return state;
    }
  })), _defineProperty(_ref, pluralModelName, function (state, action) {

    if (state === undefined) state = [];

    switch (action.type) {

      case A.PLURAL_FIND_SUCCESS:
        if (action[pluralModelName].length > 0) {
          return action[pluralModelName].map(function (model) {
            return _extends({}, model, {
              created: true,
              creating: false
            });
          });
        }

        return [];

      case A.SINGLE_CREATE_START:
        return [].concat(_toConsumableArray(state), [_extends({}, action[singleModelName], {
          created: false,
          creating: true
        })]);

      case A.SINGLE_CREATE_SUCCESS:
        return state.map(function (model) {

          if (model.tmpId === action[singleModelName].tmpId) {
            return _extends({}, model, {
              created: true,
              creating: false
            });
          }
          return model;
        });

      case A.SINGLE_CREATE_ERROR:
        return state.filter(function (model) {
          return model.tmpId !== action.data.tmpId;
        });

      default:
        return state;
    }
  }), _ref;
};