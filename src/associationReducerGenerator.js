var capitalize = require('../utils/capitalize')
var pluralize  = require('pluralize')


module.exports = function(primaryModel, associatedModel) {

  const singlePrimaryModelName       = primaryModel
  const singlePrimaryModelNameCap    = capitalize(primaryModel)
  const singlePrimaryModelNameUp     = primaryModel.toUpperCase()
  const pluralPrimaryModelName       = pluralize(primaryModel)

  const singleAssociatedModelName    = associatedModel
  const singleAssociatedModelNameCap = capitalize(associatedModel)
  const singleAssociatedModelNameUp  = associatedModel.toUpperCase()

  const pluralAssociatedModelName    = pluralize(associatedModel)
  const pluralAssociatedModelNameUp  = pluralize(associatedModel).toUpperCase()
  const pluralAssociatedModelNameCap = capitalize(pluralize(associatedModel))

  const FIND_PRIMARY_ASSOCIATED_MODELS = 'FIND_' + singlePrimaryModelNameUp + '_' + pluralAssociatedModelNameUp
  const ADD_ASSOCIATED_MODEL_TO_PRIMARY = 'ADD_' + singleAssociatedModelNameUp + '_TO_' + singlePrimaryModelNameUp
  const REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY = 'REMOVE_' + singleAssociatedModelNameUp + '_FROM_' + singlePrimaryModelNameUp

  var stateTypes = ['START', 'SUCCESS', 'ERROR']

  var A = {}

  for (const stateType of stateTypes) {
    A['FIND_PRIMARY_ASSOCIATED_MODELS' + '_' + stateType] = FIND_PRIMARY_ASSOCIATED_MODELS + '_' + stateType
    A['ADD_ASSOCIATED_MODEL_TO_PRIMARY' + '_' + stateType] = ADD_ASSOCIATED_MODEL_TO_PRIMARY + '_' + stateType
    A['REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY' + '_' + stateType] = REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY + '_' + stateType
  }


  return {

    // ----------------
    // ---- SINGLE ----
    // ----------------
    [`isFinding${singlePrimaryModelNameCap}${pluralAssociatedModelNameCap}`]: (state, action) => {

      if (state === undefined) state = false

      switch (action.type) {

        case A.FIND_PRIMARY_ASSOCIATED_MODELS_START:
          return true

        case A.FIND_PRIMARY_ASSOCIATED_MODELS_SUCCESS:
        case A.FIND_PRIMARY_ASSOCIATED_MODELS_ERROR:
          return false

        default:
          return state
      }
    },


    [singlePrimaryModelName + pluralAssociatedModelNameCap]: (state, action) => {

      if (state === undefined) state = []

      switch (action.type) {

        // ----
        // FIND
        // ----
        case A.FIND_PRIMARY_ASSOCIATED_MODELS_SUCCESS:
          if (action[singlePrimaryModelName + pluralAssociatedModelNameCap].length > 0) {
            return action[singlePrimaryModelName + pluralAssociatedModelNameCap].map(model => {
              return {
                ...model,
                created: true,
                creating: false
              }
            })
          }

          return []

        case A.FIND_PRIMARY_ASSOCIATED_MODELS_ERROR:
          return []


        // -----------
        // --- ADD ---
        // -----------
        case A.ADD_ASSOCIATED_MODEL_TO_PRIMARY_START:

          return [
            ...state,
            {
              ...action[singlePrimaryModelName + singleAssociatedModelNameCap],
              created: false,
              creating: true
            }
          ]

        case A.ADD_ASSOCIATED_MODEL_TO_PRIMARY_SUCCESS:

          var actionModel = action[singlePrimaryModelName + singleAssociatedModelNameCap]

          return state.map(model => {
            return {
              ...model,
              created  : actionModel.tmpId === model.tmpId ? true  : model.created,
              creating : actionModel.tmpId === model.tmpId ? false : model.creating,
            }
          })

        case A.ADD_ASSOCIATED_MODEL_TO_PRIMARY_ERROR:

          return state.filter(model => {
            return model.tmpId !== action.data.tmpId
          })


        // -----------
        // --- ADD ---
        // -----------
        case A.REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY_START:

          var actionModelTmpId = action[singlePrimaryModelName + singleAssociatedModelNameCap].tmpId

          return state.map(model => {
            return model.tmpId === actionModelTmpId ? {...model, removing: true} : model
          })

        case A.REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY_SUCCESS:
          return state.filter(model => {
            return model.tmpId !== action[singlePrimaryModelName + singleAssociatedModelNameCap].tmpId
          })

        case A.REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY_ERROR:
          return state.map(model => {
            return model.tmpId === action.data.tmpId ? {...model, removing: false} : model
          })

        default:
          return state
      }

    },
  }
}
