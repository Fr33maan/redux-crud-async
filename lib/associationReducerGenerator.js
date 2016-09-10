'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var capitalize = require('./utils/capitalize');
var pluralize = require('pluralize');

module.exports = function (primaryModel, associatedModel) {
  var _ref;

  var singlePrimaryModelName = primaryModel;
  var singlePrimaryModelNameCap = capitalize(primaryModel);
  var singlePrimaryModelNameUp = primaryModel.toUpperCase();
  var pluralPrimaryModelName = pluralize(primaryModel);

  var singleAssociatedModelName = associatedModel;
  var singleAssociatedModelNameCap = capitalize(associatedModel);
  var singleAssociatedModelNameUp = associatedModel.toUpperCase();

  var pluralAssociatedModelName = pluralize(associatedModel);
  var pluralAssociatedModelNameUp = pluralize(associatedModel).toUpperCase();
  var pluralAssociatedModelNameCap = capitalize(pluralize(associatedModel));

  var FIND_PRIMARY_ASSOCIATED_MODELS = 'FIND_' + singlePrimaryModelNameUp + '_' + pluralAssociatedModelNameUp;
  var ADD_ASSOCIATED_MODEL_TO_PRIMARY = 'ADD_' + singleAssociatedModelNameUp + '_TO_' + singlePrimaryModelNameUp;
  var REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY = 'REMOVE_' + singleAssociatedModelNameUp + '_FROM_' + singlePrimaryModelNameUp;
  var EMPTY_PRIMARY_ASSOCIATED_MODELS = 'EMPTY_' + singlePrimaryModelNameUp + '_' + pluralAssociatedModelNameUp;

  var stateTypes = ['START', 'SUCCESS', 'ERROR'];

  var A = {};

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = stateTypes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var stateType = _step.value;

      A['FIND_PRIMARY_ASSOCIATED_MODELS' + '_' + stateType] = FIND_PRIMARY_ASSOCIATED_MODELS + '_' + stateType;
      A['ADD_ASSOCIATED_MODEL_TO_PRIMARY' + '_' + stateType] = ADD_ASSOCIATED_MODEL_TO_PRIMARY + '_' + stateType;
      A['REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY' + '_' + stateType] = REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY + '_' + stateType;
      A['EMPTY_PRIMARY_ASSOCIATED_MODELS'] = EMPTY_PRIMARY_ASSOCIATED_MODELS;
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

  return _ref = {}, _defineProperty(_ref, 'isFinding' + singlePrimaryModelNameCap + pluralAssociatedModelNameCap, function (_undefined) {
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

      case A.FIND_PRIMARY_ASSOCIATED_MODELS_START:
        return true;

      case A.FIND_PRIMARY_ASSOCIATED_MODELS_SUCCESS:
      case A.FIND_PRIMARY_ASSOCIATED_MODELS_ERROR:
        return false;

      default:
        return state;
    }
  })), _defineProperty(_ref, singlePrimaryModelName + pluralAssociatedModelNameCap, function (state, action) {

    if (state === undefined) state = [];

    switch (action.type) {

      // ----
      // FIND
      // ----
      case A.FIND_PRIMARY_ASSOCIATED_MODELS_SUCCESS:
        if (action[singlePrimaryModelName + pluralAssociatedModelNameCap].length > 0) {
          return action[singlePrimaryModelName + pluralAssociatedModelNameCap].map(function (model) {
            return _extends({}, model, {
              created: true,
              creating: false
            });
          });
        }

        return [];

      case A.FIND_PRIMARY_ASSOCIATED_MODELS_ERROR:
        return [];

      // -----------
      // --- ADD ---
      // -----------
      case A.ADD_ASSOCIATED_MODEL_TO_PRIMARY_START:

        return [].concat(_toConsumableArray(state), [_extends({}, action[singlePrimaryModelName + singleAssociatedModelNameCap], {
          created: false,
          creating: true
        })]);

      case A.ADD_ASSOCIATED_MODEL_TO_PRIMARY_SUCCESS:

        var actionModel = action[singlePrimaryModelName + singleAssociatedModelNameCap];

        return state.map(function (model) {
          return _extends({}, model, {
            created: actionModel.tmpId === model.tmpId ? true : model.created,
            creating: actionModel.tmpId === model.tmpId ? false : model.creating
          });
        });

      case A.ADD_ASSOCIATED_MODEL_TO_PRIMARY_ERROR:

        return state.filter(function (model) {
          return model.tmpId !== action.data.tmpId;
        });

      // --------------
      // --- REMOVE ---
      // --------------
      case A.REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY_START:

        var actionModelTmpId = action[singlePrimaryModelName + singleAssociatedModelNameCap].tmpId;

        return state.map(function (model) {
          return model.tmpId === actionModelTmpId ? _extends({}, model, { removing: true }) : model;
        });

      case A.REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY_SUCCESS:
        return state.filter(function (model) {
          return model.tmpId !== action[singlePrimaryModelName + singleAssociatedModelNameCap].tmpId;
        });

      case A.REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY_ERROR:
        return state.map(function (model) {
          return model.tmpId === action.data.tmpId ? _extends({}, model, { removing: false }) : model;
        });

      case A.EMPTY_PRIMARY_ASSOCIATED_MODELS:
        return [];

      default:
        return state;
    }
  }), _ref;
};