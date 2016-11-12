'use strict';

var uuid = require('uuid');

module.exports = function modelsWithTmpId(models) {
  return models.map(function (model) {

    var newModel = {};

    for (var attributeName in model) {
      newModel[attributeName] = model[attributeName];
    }

    newModel.tmpId = uuid.v4();

    return newModel;
  });
};