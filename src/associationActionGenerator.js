var path            = require('object-path')
var uuid            = require('uuid')
var axios           = require('axios')
var checkModelName  = require('../utils/checkModelName')
var capitalize      = require('../utils/capitalize')
var pluralize       = require('pluralize')
var modelsWithTmpId = require('../utils/arrayItemsWithTmpId')
var windowAccess    = typeof window !== 'undefined' ? window : {}
var now = Date.now


module.exports= function(primaryModel, associatedModel, hostConfig) {

  if(!hostConfig || !hostConfig.host) throw new Error('You must instantiate redux-crud-async.associationActionFor with a host => {host: "http://exemple.com"}')

  checkModelName(primaryModel)
  checkModelName(associatedModel)


  const primaryModelName             = primaryModel
  const primaryModelNameCap          = capitalize(primaryModel)
  const primaryModelNameUp           = primaryModel.toUpperCase()
  const pluralPrimaryModelName       = pluralize(primaryModel)

  const singleAssociatedModelName    = associatedModel
  const singleAssociatedModelNameCap = capitalize(associatedModel)
  const singleAssociatedModelNameUp  = associatedModel.toUpperCase()

  const pluralAssociatedModelName    = pluralize(associatedModel)
  const pluralAssociatedModelNameCap = capitalize(pluralize(associatedModel))
  const pluralAssociatedModelNameUp  = pluralize(associatedModel).toUpperCase()

  const host    = hostConfig.host
  const prefix  = hostConfig.prefix
  const baseUrl = host + (prefix ? '/' + prefix : '')
  const pluralizeUrl       = typeof hostConfig.pluralizeModels === 'undefined' ? true : hostConfig.pluralizeModels
  const urlPrimaryModel    = pluralizeUrl ? pluralPrimaryModelName    : primaryModelName
  const urlAssociatedModel = pluralizeUrl ? pluralAssociatedModelName : singleAssociatedModelName


  var bearers = {}
  var authConfig = path.get(hostConfig, `apiSpecs.${primaryModelName}${pluralAssociatedModelNameCap}.auth`)
  var localStorageName = path.get(hostConfig, 'localStorageName') || 'JWT'
  var hasLocalStorage = path.get(windowAccess, 'localStorage.getItem');

  if(authConfig && hasLocalStorage){

    authConfig.forEach(action => {
      // Return a function to get the token each time the action is dispatched
      bearers[action] = function() {
        let JWT_Token = windowAccess.localStorage.getItem(localStorageName)

        return {
          headers : {'Authorization': `Bearer ${JWT_Token}`}
        }
      }
    })
  }

  const findPrimaryAssociatedModels      = 'find' + primaryModelNameCap + pluralAssociatedModelNameCap
  const addAssociatedModelToPrimary      = 'add' + singleAssociatedModelNameCap + 'To' + primaryModelNameCap
  const removeAssociatedModelFromPrimary = 'remove' + singleAssociatedModelNameCap + 'From' + primaryModelNameCap


  const FIND_PRIMARY_ASSOCIATED_MODELS       = 'FIND_'    + primaryModelNameUp + '_' + pluralAssociatedModelNameUp
  const ADD_ASSOCIATED_MODEL_TO_PRIMARY      = 'ADD_'     + singleAssociatedModelNameUp + '_TO_' + primaryModelNameUp
  const REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY = 'REMOVE_'  + singleAssociatedModelNameUp + '_FROM_' + primaryModelNameUp

  var ationsTypes = ['START', 'SUCCESS', 'ERROR']

  var A = {}

  for(const actionType of ationsTypes){
    A['FIND_PRIMARY_ASSOCIATED_MODELS'        + '_' + actionType] = FIND_PRIMARY_ASSOCIATED_MODELS        + '_' +actionType
    A['ADD_ASSOCIATED_MODEL_TO_PRIMARY'       + '_' + actionType] = ADD_ASSOCIATED_MODEL_TO_PRIMARY       + '_' +actionType
    A['REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY'  + '_' + actionType] = REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY  + '_' +actionType
  }

  return {

    // ----------------------
    // Find associated models
    // ----------------------
    [findPrimaryAssociatedModels] : (primaryModelId, associatedModelId) => {

      function start() {
        return {type: A.FIND_PRIMARY_ASSOCIATED_MODELS_START}
      }
      function success(models) {
        return {
          type                                             : A.FIND_PRIMARY_ASSOCIATED_MODELS_SUCCESS,
          [primaryModelName + pluralAssociatedModelNameCap]: modelsWithTmpId(models),
          receivedAt                                       : now()
        }
      }
      function error(error, primaryModelId) {
        return {
          type  : A.FIND_PRIMARY_ASSOCIATED_MODELS_ERROR,
          data  : primaryModelId,
          error : error
        }
      }
      return dispatch => {
        dispatch(start())
        associatedModelId = associatedModelId ? '/'+associatedModelId : ''

        // If a rule exists we execute the function to get the token dynamically
        let bearer = typeof bearers[findPrimaryAssociatedModels] !== 'undefined' ? bearers[findPrimaryAssociatedModels]() : undefined

        return axios.get(`${baseUrl}/${urlPrimaryModel}/${primaryModelId}/${urlAssociatedModel}${associatedModelId}`, bearer)
          .then(res => dispatch(success(res.data.data)))
          .catch(res => dispatch(error(res.data, primaryModelId)))
      }

    },


    // --------------------
    // Add associated model
    // --------------------
    [addAssociatedModelToPrimary] : (primaryModelId, modelToAssociate, alreadyAssociatedModels) => {
      function start(modelToAssociate) {
        return {
          type: A.ADD_ASSOCIATED_MODEL_TO_PRIMARY_START,
          [primaryModelName + singleAssociatedModelNameCap] : {
            ...modelToAssociate,
            tmpId : uuid.v4()
          }
        }
      }
      function success(modelToAssociate) {
        return {
          type                                              : A.ADD_ASSOCIATED_MODEL_TO_PRIMARY_SUCCESS,
          [primaryModelName + singleAssociatedModelNameCap] : modelToAssociate
        }
      }
      function error(error, modelToAssociate) {
        return {
          type  : A.ADD_ASSOCIATED_MODEL_TO_PRIMARY_ERROR,
          data  : modelToAssociate,
          error : error
        }
      }

      if(typeof alreadyAssociatedModels !== 'undefined'){
        for(let associated of alreadyAssociatedModels){
          // If we try to add an already associated model -> nothing happen
          // This check consider that associating === associated so nothing happen if you start associating twice
          if(associated.id === modelToAssociate.id) return {type: 'NO_ACTION'}
        }
      }


      // If a rule exists we execute the function to get the token dynamically
      let bearer = typeof bearers[addAssociatedModelToPrimary] !== 'undefined' ? bearers[addAssociatedModelToPrimary]() : undefined

      // Means that model has already been created in database
      if('id' in modelToAssociate){
        return dispatch => {
          var associatedModelWithTmpId = dispatch(start(modelToAssociate))[primaryModelName + singleAssociatedModelNameCap]

          return axios.post(`${baseUrl}/${urlPrimaryModel}/${primaryModelId}/${urlAssociatedModel}/${modelToAssociate.id}`, bearer)
            .then(res => dispatch(success(associatedModelWithTmpId)))
            .catch(res => dispatch(error(res.data, associatedModelWithTmpId)))
        }

      // Means that model does not exists in database
      }else{
        return dispatch => {
          var associatedModelWithTmpId = dispatch(start(modelToAssociate))[primaryModelName + singleAssociatedModelNameCap]

          return axios.post(`${baseUrl}/${urlPrimaryModel}/${primaryModelId}/${urlAssociatedModel}`, modelToAssociate , bearer)
            .then(res => dispatch(success(associatedModelWithTmpId)))
            .catch(res => dispatch(error(res.data, associatedModelWithTmpId)))
        }
      }
    },


    // -----------------------
    // Remove associated model
    // -----------------------
    [removeAssociatedModelFromPrimary] : (primaryModelId, modelToDissociate) => {
      function start(modelToDissociate) {
        return {
          type                        : A.REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY_START,
          [primaryModelName + singleAssociatedModelNameCap] : modelToDissociate
        }
      }
      function success(modelToDissociate) {
        return {
          type                        : A.REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY_SUCCESS,
          [primaryModelName + singleAssociatedModelNameCap] : modelToDissociate
        }
      }
      function error(error, modelToDissociate) {
        return {
          type  : A.REMOVE_ASSOCIATED_MODEL_FROM_PRIMARY_ERROR,
          data  : modelToDissociate,
          error : error
        }
      }

      return dispatch => {
        dispatch(start(modelToDissociate))
        // If a rule exists we execute the function to get the token dynamically
        let bearer = typeof bearers[removeAssociatedModelFromPrimary] !== 'undefined' ? bearers[removeAssociatedModelFromPrimary]() : undefined

        return axios.delete(`${baseUrl}/${urlPrimaryModel}/${primaryModelId}/${urlAssociatedModel}/${modelToDissociate.id}`, bearer)
          .then(res => dispatch(success(modelToDissociate)))
          .catch(res => dispatch(error(res.data, modelToDissociate)))
      }

    },
  }
}
