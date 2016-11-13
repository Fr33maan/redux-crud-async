var capitalize = require('./utils/capitalize')
var pluralize  = require('pluralize')
var uuid            = require('uuid')


// console.log(actionTypes)

module.exports = function(modelName) {

  const singleModelName    = modelName
  const singleModelNameUp  = modelName.toUpperCase()
  const singleModelNameCap = capitalize(singleModelName)

  const pluralModelName    = pluralize(modelName)
  const pluralModelNameUp  = pluralModelName.toUpperCase()
  const pluralModelNameCap = capitalize(pluralModelName)


  var stateTypes  = ['START', 'SUCCESS', 'ERROR']
  var actionTypes = ['FIND', 'CREATE', 'UPDATE', 'DELETE']
  var A = {}

  for(const actionType of actionTypes){
    for(const stateType of stateTypes){
      A['SINGLE_' + actionType + '_' + stateType] = singleModelNameUp + '_' + actionType + '_' + stateType
      A['PLURAL_' + actionType + '_' + stateType] = pluralModelNameUp + '_' + actionType + '_' + stateType
    }
  }

  A.EMPTY_MODEL  = 'EMPTY_' + singleModelNameUp
  A.EMPTY_MODELS = 'EMPTY_' + pluralModelNameUp

  return {

    // ---------------
    // ---- MODEL ----
    // ---------------
    [`isFinding${singleModelNameCap}`] : (state, action) => {

      if(state === undefined) state = false

      switch (action.type) {

        case A.SINGLE_FIND_START:
        return true

        case A.SINGLE_FIND_SUCCESS:
        return false

        default:
        return state
      }
    },

    [singleModelName] : (state, action) => {

      if(state === undefined) state = {}

      switch (action.type) {

        case A.SINGLE_FIND_SUCCESS:
        return action[singleModelName] || state

        case A.SINGLE_UPDATE_START:
        case A.SINGLE_UPDATE_SUCCESS:
          return {
            ...state,
            ...action[singleModelName],
            updating: action.type === A.SINGLE_UPDATE_START // Else action.type === A.SINGLE_UPDATE_SUCCESS and we can set updating to false
          }

        case A.SINGLE_UPDATE_ERROR:
          return {
            ...state,
            ...action.data,
            updating: false
          }

        case A.EMPTY_MODEL:
        return {}

        default:
        return state
      }

    },


    // ---------------
    // --- MODELS ----
    // ---------------
    [`isFinding${pluralModelNameCap}`] : (state, action) => {

      if(state === undefined) state = false

      switch (action.type) {

        case A.PLURAL_FIND_START:
        return true

        case A.PLURAL_FIND_ERROR :
        case A.PLURAL_FIND_SUCCESS:
        return false

        default:
        return state
      }
    },

    [pluralModelName] : (state, action) => {

      if(state === undefined) state = []

      switch (action.type) {

        case A.PLURAL_FIND_SUCCESS:
          if(action[pluralModelName].length > 0){
            return action[pluralModelName].map(model => {
              return {
                ...model,
                created: true,
                creating : false
              }
            })
          }

          return []

        case A.SINGLE_CREATE_START:
          return [
            ...state,
            {
              ...action[singleModelName],
              created : false,
              creating : true,
              tmpId : uuid.v4()
            }
          ]

        case A.SINGLE_CREATE_SUCCESS:
          return state.map(model => {

            if(model.tmpId === action[singleModelName].tmpId){
              return {
                ...model,
                created : true,
                creating: false
              }
            }
            return model
          })

        case A.SINGLE_CREATE_ERROR:
          return state.filter(model => {
            return model.tmpId !== action.data.tmpId
          })


        case A.SINGLE_UPDATE_START:
        case A.SINGLE_UPDATE_SUCCESS:
          return state.map(model => {
            if(model.id === action[singleModelName].id){
                return {
                  ...model,
                  ...action[singleModelName],
                  updating: action.type === A.SINGLE_UPDATE_START // Else action.type === A.SINGLE_UPDATE_SUCCESS and we can set updating to false
                }
            }
            return {...model}
          })


        case A.SINGLE_UPDATE_ERROR:
          return state.map(model => {
            if(model.id === action.data.id){
                return {
                  ...model,
                  ...action.data,
                  updating: false
                }
            }
            return {...model}
          })


        case A.EMPTY_MODELS:
          return []

        default:
        return state
      }

    },
  }
}
