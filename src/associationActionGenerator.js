// import axios from 'axios'
var uuid            = require('uuid')
var axios           = require('axios')
var capitalize      = require('../utils/capitalize')
var pluralize       = require('../utils/pluralize')
var checkModelName  = require('../utils/checkModelName')
var modelsWithTmpId = require('../utils/arrayItemsWithTmpId')
var now = Date.now


module.exports= function(primaryModel, associatedModel, hostConfig) {

  if(!hostConfig || !hostConfig.host) throw new Error('You must instantiate redux-crud-async.associationActionFor with a host => {host: "http://exemple.com"}')

  checkModelName(primaryModel)
  checkModelName(associatedModel)

  const host   = hostConfig.host
  const prefix = hostConfig.prefix
  const baseUrl = host + (prefix ? '/' + prefix : '')

  const primaryModelName             = primaryModel
  const primaryModelNameCap          = capitalize(primaryModel)
  const primaryModelNameUp           = primaryModel.toUpperCase()
  const pluralPrimaryModelName       = pluralize(primaryModel)

  const singleAssociatedModelName    = associatedModel
  const singleAssociatedModelNameCap = capitalize(associatedModel)
  const singleAssociatedModelNameUp  = associatedModel.toUpperCase()

  const pluralAssociatedModelName    = pluralize(associatedModel)
  const pluralAssociatedModelNameUp  = pluralize(associatedModel).toUpperCase()
  const pluralAssociatedModelNameCap = capitalize(pluralize(associatedModel))

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
    ['find' + primaryModelNameCap + pluralAssociatedModelNameCap] : (primaryModelId, associatedModelId) => {

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
        return axios.get(`${baseUrl}/${pluralPrimaryModelName}/${primaryModelId}/${pluralAssociatedModelName}${associatedModelId}`)
          .then(res => dispatch(success(res.data.data)))
          .catch(res => dispatch(error(res.data, primaryModelId)))
      }

    },


    // --------------------
    // Add associated model
    // --------------------
    ['add' + singleAssociatedModelNameCap + 'To' + primaryModelNameCap] : (primaryModelId, modelToAssociate, alreadyAssociatedModels) => {
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


      // Means that model has already been created in database
      if('id' in modelToAssociate){
        return dispatch => {
          var associatedModelWithTmpId = dispatch(start(modelToAssociate))[primaryModelName + singleAssociatedModelNameCap]

          return axios.post(`${baseUrl}/${pluralPrimaryModelName}/${primaryModelId}/${pluralAssociatedModelName}/${modelToAssociate.id}`)
            .then(res => dispatch(success(associatedModelWithTmpId)))
            .catch(res => dispatch(error(res.data, associatedModelWithTmpId)))
        }

      // Means that model does not exists in database
      }else{
        return dispatch => {
          var associatedModelWithTmpId = dispatch(start(modelToAssociate))[primaryModelName + singleAssociatedModelNameCap]

          return axios.post(`${baseUrl}/${pluralPrimaryModelName}/${primaryModelId}/${pluralAssociatedModelName}`, modelToAssociate)
            .then(res => dispatch(success(associatedModelWithTmpId)))
            .catch(res => dispatch(error(res.data, associatedModelWithTmpId)))
        }
      }
    },


    // -----------------------
    // Remove associated model
    // -----------------------
    ['remove' + singleAssociatedModelNameCap + 'From' + primaryModelNameCap] : (primaryModelId, modelToDissociate) => {
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

        return axios.delete(`${baseUrl}/${pluralPrimaryModelName}/${primaryModelId}/${pluralAssociatedModelName}/${modelToDissociate.id}`)
          .then(res => dispatch(success(modelToDissociate)))
          .catch(res => dispatch(error(res.data, modelToDissociate)))
      }

    },
  }
}
