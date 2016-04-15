
var primaryActionTypeGenerator    = require('./lib/primaryActionTypeGenerator')
var primaryActionGenerator        = require('./lib/primaryActionGenerator')
var primaryReducerGenerator       = require('./lib/primaryReducerGenerator')

var associatedActionGenerator     = require('./lib/associationActionGenerator')
var associatedActionTypeGenerator = require('./lib/associationActionTypeGenerator')
var associatedReducerGenerator    = require('./lib/associationReducerGenerator')


var initModule = function(hostConfig) {

  this.host = hostConfig.host || ''
  this.prefix = hostConfig.prefix || ''

  this.primaryActionTypesFor = function(primaryModel){
    return primaryActionGenerator(primaryModel, hostConfig)
  }

  this.primaryActionsFor = function(primaryModel){
    return primaryActionGenerator(primaryModel, hostConfig)
  }

  this.primaryReducerFor = function(primaryModel){
    return primaryReducerGenerator(primaryModel, hostConfig)
  }



  this.associationActionTypesFor = function(primaryModel, associatedModel){
    return primaryActionGenerator(primaryModel, associatedModel, hostConfig)
  }

  this.associationActionsFor = function(primaryModel, associatedModel){
    return primaryActionGenerator(primaryModel, associatedModel, hostConfig)
  }

  this.associationReducerFor = function(primaryModel, associatedModel){
    return primaryReducerGenerator(primaryModel, associatedModel, hostConfig)
  }

}

module.exports = initModule
