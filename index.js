
var primaryActionTypeGenerator    = require('./src/primaryActionTypeGenerator')
var primaryActionGenerator        = require('./src/primaryActionGenerator')
var primaryReducerGenerator       = require('./src/primaryReducerGenerator')

var associatedActionGenerator     = require('./src/associationActionGenerator')
var associatedActionTypeGenerator = require('./src/associationActionTypeGenerator')
var associatedReducerGenerator    = require('./src/associationReducerGenerator')


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
