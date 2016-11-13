'use strict';

var pluralize = require('pluralize');

module.exports = function (modelName) {

  if (modelName.substr(modelName.length - 1) === 's') {
    console.log(chalk.red('The model "' + modelName + '" given to primaryActionTypeGenerator has a "s" at its end, redux-crud-async already pluralize models for you and WILL pluralize this name again as "' + modelName + 's"'));
  }

  var singleModelNameUp = modelName.toUpperCase();
  var pluralModelNameUp = pluralize(modelName).toUpperCase();

  var actions = ['CREATE', 'FIND', 'UPDATE', 'DESTROY'];
  var actionTypesToExport = {};

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var action = _step.value;


      var SINGLE_ACTION_START = singleModelNameUp + '_' + action + '_START';
      var SINGLE_ACTION_SUCCESS = singleModelNameUp + '_' + action + '_SUCCESS';
      var SINGLE_ACTION_ERROR = singleModelNameUp + '_' + action + '_ERROR';

      var PLURAL_ACTION_START = pluralModelNameUp + '_' + action + '_START';
      var PLURAL_ACTION_SUCCESS = pluralModelNameUp + '_' + action + '_SUCCESS';
      var PLURAL_ACTION_ERROR = pluralModelNameUp + '_' + action + '_ERROR';

      actionTypesToExport[SINGLE_ACTION_START] = SINGLE_ACTION_START;
      actionTypesToExport[SINGLE_ACTION_SUCCESS] = SINGLE_ACTION_SUCCESS;
      actionTypesToExport[SINGLE_ACTION_ERROR] = SINGLE_ACTION_ERROR;

      actionTypesToExport[PLURAL_ACTION_START] = PLURAL_ACTION_START;
      actionTypesToExport[PLURAL_ACTION_SUCCESS] = PLURAL_ACTION_SUCCESS;
      actionTypesToExport[PLURAL_ACTION_ERROR] = PLURAL_ACTION_ERROR;
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