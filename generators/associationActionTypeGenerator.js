import pluralize from '../utils/pluralize'

module.exports = function(primaryModel, associatedModel) {

  const primaryModelNameUp    = primaryModel.toUpperCase()
  const singleAssociatedModelNameUp = associatedModel.toUpperCase()
  const pluralAssociatedModelNameUp = pluralize(associatedModel).toUpperCase()

  const FIND_PRIMARY_ASSOCIATED_MODELS       = 'FIND_' + primaryModelNameUp + '_' + pluralAssociatedModelNameUp
  const ADD_ASSOCIATED_MODEL_TO_PRIMARY      = 'ADD_' + singleAssociatedModelNameUp + '_TO_' + primaryModelNameUp
  const REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY = 'REMOVE_' + singleAssociatedModelNameUp + '_FROM_' + primaryModelNameUp

  const actions = [
    FIND_PRIMARY_ASSOCIATED_MODELS,
    ADD_ASSOCIATED_MODEL_TO_PRIMARY,
    REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY
  ]

  let actionTypesToExport = {}

  for(const ACTION of actions){
    actionTypesToExport[ACTION + '_START']   = ACTION + '_START'
    actionTypesToExport[ACTION + '_SUCCESS'] = ACTION + '_SUCCESS'
    actionTypesToExport[ACTION + '_ERROR']   = ACTION + '_ERROR'
  }

  return actionTypesToExport
}
