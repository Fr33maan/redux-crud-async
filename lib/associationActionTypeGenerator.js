'use strict';

var pluralize = require('pluralize');

module.exports = function (primaryModel, associatedModel) {

  var primaryModelNameUp = primaryModel.toUpperCase();
  var singleAssociatedModelNameUp = associatedModel.toUpperCase();
  var pluralAssociatedModelNameUp = pluralize(associatedModel).toUpperCase();

  var FIND_PRIMARY_ASSOCIATED_MODELS = 'FIND_' + primaryModelNameUp + '_' + pluralAssociatedModelNameUp;
  var ADD_ASSOCIATED_MODEL_TO_PRIMARY = 'ADD_' + singleAssociatedModelNameUp + '_TO_' + primaryModelNameUp;
  var REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY = 'REMOVE_' + singleAssociatedModelNameUp + '_FROM_' + primaryModelNameUp;

  var actions = [FIND_PRIMARY_ASSOCIATED_MODELS, ADD_ASSOCIATED_MODEL_TO_PRIMARY, REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY];

  var actionTypesToExport = {};

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var ACTION = _step.value;

      actionTypesToExport[ACTION + '_START'] = ACTION + '_START';
      actionTypesToExport[ACTION + '_SUCCESS'] = ACTION + '_SUCCESS';
      actionTypesToExport[ACTION + '_ERROR'] = ACTION + '_ERROR';
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

  return actionTypesToExport;
};