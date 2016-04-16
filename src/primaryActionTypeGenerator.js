var pluralize  = require('pluralize')

module.exports = function(modelName) {

  if(modelName.substr(modelName.length - 1) === 's'){
    console.log(
      chalk.red('The model "'+modelName+'" given to primaryActionTypeGenerator has a "s" at its end, redux-crud-async already pluralize models for you and WILL pluralize this name again as "'+modelName+'s"')
    )
  }

  const singleModelNameUp = modelName.toUpperCase()
  const pluralModelNameUp = pluralize(modelName).toUpperCase()

  const actions = ['CREATE', 'FIND', 'UPDATE', 'DESTROY']
  let actionTypesToExport = {}


  for(let action of actions){

    const SINGLE_ACTION_START   = singleModelNameUp + '_' + action + '_START'
    const SINGLE_ACTION_SUCCESS = singleModelNameUp + '_' + action + '_SUCCESS'
    const SINGLE_ACTION_ERROR   = singleModelNameUp + '_' + action + '_ERROR'

    const PLURAL_ACTION_START   = pluralModelNameUp + '_' + action + '_START'
    const PLURAL_ACTION_SUCCESS = pluralModelNameUp + '_' + action + '_SUCCESS'
    const PLURAL_ACTION_ERROR   = pluralModelNameUp + '_' + action + '_ERROR'

    actionTypesToExport[SINGLE_ACTION_START]   = SINGLE_ACTION_START
    actionTypesToExport[SINGLE_ACTION_SUCCESS] = SINGLE_ACTION_SUCCESS
    actionTypesToExport[SINGLE_ACTION_ERROR]   = SINGLE_ACTION_ERROR

    actionTypesToExport[PLURAL_ACTION_START]   = PLURAL_ACTION_START
    actionTypesToExport[PLURAL_ACTION_SUCCESS] = PLURAL_ACTION_SUCCESS
    actionTypesToExport[PLURAL_ACTION_ERROR]   = PLURAL_ACTION_ERROR

  }

  return actionTypesToExport
}
