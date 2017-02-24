var path            = require('object-path')
var uuid            = require('uuid')
var axios           = require('axios')
var checkModelName  = require('./utils/checkModelName')
var capitalize      = require('./utils/capitalize')
var pluralize       = require('pluralize')
var modelsWithTmpId = require('./utils/arrayItemsWithTmpId')
var windowAccess    = typeof window !== 'undefined' ? window : {}
var now = Date.now

var headersUtil  = require('./utils/xhr/headers')
var XHR = require('./utils/xhr/xhr').XHR

module.exports = function(primaryModel, associatedModel, hostConfig) {

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

    //  http://www.kammerl.de/ascii/AsciiSignature.php
    //  nancyj-underlined

    //   88888888b dP 888888ba  888888ba
    //   88        88 88    `8b 88    `8b
    //  a88aaaa    88 88     88 88     88
    //   88        88 88     88 88     88
    //   88        88 88     88 88    .8P
    //   dP        dP dP     dP 8888888P
    //  oooooooooooooooooooooooooooooooooo

    // ----------------------
    // Find associated models
    // ----------------------
    [findPrimaryAssociatedModels] : (primaryModelId, associatedModelId, parameters) => {

      function start() {
        return {type: A.FIND_PRIMARY_ASSOCIATED_MODELS_START}
      }
      function success(models) {
        return {
          type                                             : A.FIND_PRIMARY_ASSOCIATED_MODELS_SUCCESS,
          parentId                                         : primaryModelId,
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
        parameters = parameters || ''

        let url = `${baseUrl}/${urlPrimaryModel}/${primaryModelId}/${urlAssociatedModel}${associatedModelId}${parameters}`

        // Create headers for each action - depends on hostConfig
        // See utils/headers
        const headers = headersUtil(hostConfig, `${primaryModelName}${pluralAssociatedModelNameCap}`)

        return new XHR(hostConfig, headers[findPrimaryAssociatedModels], url)
        .get()
        .then(res => dispatch(success(res)))
        .catch(err => dispatch(error(err, primaryModelId)))

      }

    },

    //  http://www.kammerl.de/ascii/AsciiSignature.php
    //  nancyj-underlined

    //   .d888888  888888ba  888888ba
    //  d8'    88  88    `8b 88    `8b
    //  88aaaaa88a 88     88 88     88
    //  88     88  88     88 88     88
    //  88     88  88    .8P 88    .8P
    //  88     88  8888888P  8888888P
    //  ooooooooooooooooooooooooooooooo

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

      // Create headers for each action - depends on hostConfig
      // See utils/headers
      const headers = headersUtil(hostConfig, `${primaryModelName}${pluralAssociatedModelNameCap}`)

      // Means that model has already been created in database
      if('id' in modelToAssociate){
        return dispatch => {
          var associatedModelWithTmpId = dispatch(start(modelToAssociate))[primaryModelName + singleAssociatedModelNameCap]

          let url = `${baseUrl}/${urlPrimaryModel}/${primaryModelId}/${urlAssociatedModel}/${modelToAssociate.id}`
          return new XHR(hostConfig, headers[addAssociatedModelToPrimary], url)
          .post(modelToAssociate)
          .then(res => dispatch(success(associatedModelWithTmpId)))
          .catch(err => dispatch(error(err, associatedModelWithTmpId)))

        }

      // Means that model does not exists in database
      }else{
        return dispatch => {
          var associatedModelWithTmpId = dispatch(start(modelToAssociate))[primaryModelName + singleAssociatedModelNameCap]

          let url = `${baseUrl}/${urlPrimaryModel}/${primaryModelId}/${urlAssociatedModel}`
          return new XHR(hostConfig, headers[addAssociatedModelToPrimary], url)
          .post(modelToAssociate)
          .then(res => dispatch(success(associatedModelWithTmpId)))
          .catch(err => dispatch(error(err, associatedModelWithTmpId)))
        }
      }
    },

    //  http://www.kammerl.de/ascii/AsciiSignature.php
    //  nancyj-underlined

    //   888888ba   88888888b 8888ba.88ba   .88888.  dP     dP  88888888b
    //   88    `8b  88        88  `8b  `8b d8'   `8b 88     88  88
    //  a88aaaa8P' a88aaaa    88   88   88 88     88 88    .8P a88aaaa
    //   88   `8b.  88        88   88   88 88     88 88    d8'  88
    //   88     88  88        88   88   88 Y8.   .8P 88  .d8P   88
    //   dP     dP  88888888P dP   dP   dP  `8888P'  888888'    88888888P
    //  oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo

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

        // Dispatch an error if no id is provider in model
        if(!('id' in modelToDissociate)){
            return new Promise((resolve) => {
              dispatch(error('no id provided in modelToDissociate : ' +urlAssociatedModel, modelToDissociate))
              resolve()
            })
        }

        // Create headers for each action - depends on hostConfig
        // See utils/headers
        const headers = headersUtil(hostConfig, `${primaryModelName}${pluralAssociatedModelNameCap}`)

        let url = `${baseUrl}/${urlPrimaryModel}/${primaryModelId}/${urlAssociatedModel}/${modelToDissociate.id}`
        return new XHR(hostConfig, headers[removeAssociatedModelFromPrimary], url)
        .delete()
        .then(res => dispatch(success(modelToDissociate)))
        .catch(err => dispatch(error(err, modelToDissociate)))
      }
    },
  }
}
