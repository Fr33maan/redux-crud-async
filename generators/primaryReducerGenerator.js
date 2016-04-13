import actionTypes from '../../redux/actions/actionTypes'
import capitalize from '../utils/capitalize'
import pluralize from '../utils/pluralize'

// console.log(actionTypes)

export default (modelName) => {

  const singleModelName    = modelName
  const singleModelNameUp  = modelName.toUpperCase()
  const singleModelNameCap = capitalize(singleModelName)

  const pluralModelName    = pluralize(modelName)
  const pluralModelNameUp  = pluralModelName.toUpperCase()
  const pluralModelNameCap = capitalize(pluralModelName)

  // --------------
  // --- CREATE ---
  // --------------
  // -- SINGLE
  const SINGLE_CREATE_START   = actionTypes[singleModelNameUp + '_CREATE_START']
  const SINGLE_CREATE_SUCCESS = actionTypes[singleModelNameUp + '_CREATE_SUCCESS']
  const SINGLE_CREATE_ERROR   = actionTypes[singleModelNameUp + '_CREATE_ERROR']

  // -- PLURAL
  const PLURAL_CREATE_START   = actionTypes[pluralModelNameUp + '_CREATE_START']
  const PLURAL_CREATE_SUCCESS = actionTypes[pluralModelNameUp + '_CREATE_SUCCESS']
  const PLURAL_CREATE_ERROR   = actionTypes[pluralModelNameUp + '_CREATE_ERROR']

  // --------------
  // --- FECTH ----
  // --------------
  // -- SINGLE
  const SINGLE_FIND_START   = actionTypes[singleModelNameUp + '_FIND_START']
  const SINGLE_FIND_SUCCESS = actionTypes[singleModelNameUp + '_FIND_SUCCESS']
  const SINGLE_FIND_ERROR   = actionTypes[singleModelNameUp + '_FIND_ERROR']

  // -- PLURAL
  const PLURAL_FIND_START   = actionTypes[pluralModelNameUp + '_FIND_START']
  const PLURAL_FIND_SUCCESS = actionTypes[pluralModelNameUp + '_FIND_SUCCESS']
  const PLURAL_FIND_ERROR   = actionTypes[pluralModelNameUp + '_FIND_ERROR']

  return {

    // ----------------
    // ---- SINGLE ----
    // ----------------
    [`isFinding${singleModelNameCap}`] : (state, action) => {

      if(state === undefined) state = false

      switch (action.type) {

        case SINGLE_FIND_START:
        return true

        case SINGLE_FIND_SUCCESS:
        return false

        default:
        return state
      }
    },

    [singleModelName] : (state, action) => {

      if(state === undefined) state = {}

      switch (action.type) {

        case SINGLE_FIND_SUCCESS:
        return action[singleModelName] || state

        default:
        return state
      }

    },


    // ---------------
    // --- PLURAL ----
    // ---------------
    [`isFinding${pluralModelNameCap}`] : (state, action) => {

      if(state === undefined) state = false

      switch (action.type) {

        case PLURAL_FIND_START:
        return true

        case PLURAL_FIND_ERROR :
        case PLURAL_FIND_SUCCESS:
        return false

        default:
        return state
      }
    },

    [pluralModelName] : (state, action) => {

      if(state === undefined) state = []

      switch (action.type) {

        case PLURAL_FIND_SUCCESS:
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

        case SINGLE_CREATE_START:
          return [
            ...state,
            {
              ...action[singleModelName],
              created : false,
              creating : true,
            }
          ]

        case SINGLE_CREATE_SUCCESS:
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

        case SINGLE_CREATE_ERROR:
          return state.filter(model => {
            return model.tmpId !== action[singleModelName].tmpId
          })

        default:
        return state
      }

    },



    // ----------------
    // -- CREATE SINGLE
    // ----------------


  }
}
