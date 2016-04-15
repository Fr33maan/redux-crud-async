
var primaryActionTypeGenerator     = require('./lib/primaryActionTypeGenerator')
var primaryActionGenerator         = require('./lib/primaryActionGenerator')
var primaryReducerGenerator        = require('./lib/primaryReducerGenerator')

var associationActionGenerator     = require('./lib/associationActionGenerator')
var associationActionTypeGenerator = require('./lib/associationActionTypeGenerator')
var associationReducerGenerator    = require('./lib/associationReducerGenerator')


var initModule = function(hostConfig) {

  this.hostConfig = hostConfig || {}

  this.primaryActionTypesFor = function(primaryModel){
    return primaryActionTypeGenerator(primaryModel)
  }

  this.primaryActionsFor = function(primaryModel){
    return primaryActionGenerator(primaryModel, hostConfig)
  }

  this.primaryReducerFor = function(primaryModel){
    return primaryReducerGenerator(primaryModel)
  }



  this.associationActionTypesFor = function(primaryModel, associatedModel){
    return associationActionGenerator(primaryModel, associatedModel)
  }

  this.associationActionsFor = function(primaryModel, associatedModel){
    return associationActionTypeGenerator(primaryModel, associatedModel, hostConfig)
  }

  this.associationReducerFor = function(primaryModel, associatedModel){
    return associationReducerGenerator(primaryModel, associatedModel)
  }

}

module.exports = initModule
