var path            = require('object-path')
var axios           = require('axios')
var checkModelName  = require('./utils/checkModelName')
var capitalize      = require('./utils/capitalize')
var pluralize       = require('pluralize')
var modelsWithTmpId = require('./utils/arrayItemsWithTmpId')
var windowAccess    = typeof window !== 'undefined' ? window : {} // Make it available in tests
var now = Date.now

var headersUtil  = require('./utils/xhr/headers')
var XHR = require('./utils/xhr/xhr').XHR

module.exports = function(modelName, hostConfig){

  if(!hostConfig || !hostConfig.host) throw new Error('You must instantiate redux-crud-async.primaryActionFor with a host => {host: "http://exemple.com"}')

  checkModelName(modelName)

  const singleModelName    = modelName
  const singleModelNameUp  = modelName.toUpperCase()
  const singleModelNameCap = capitalize(singleModelName)

  const pluralModelName    = pluralize(modelName)
  const pluralModelNameUp  = pluralModelName.toUpperCase()
  const pluralModelNameCap = capitalize(pluralModelName)


  // ---------------
  // --HOST CONFIG--
  // ---------------
  var host           = hostConfig.host
  var prefix         = hostConfig.prefix
  const baseUrl      = host + (prefix ? '/' + prefix : '')
  const pluralizeUrl = typeof hostConfig.pluralizeModels === 'undefined' ? true : hostConfig.pluralizeModels
  const urlModel     = pluralizeUrl ? pluralModelName : singleModelName

  const findModel    = 'find' + singleModelNameCap
  const findModels   = 'find' + pluralModelNameCap
  const createModel  = 'create' + singleModelNameCap
  const updateModel  = 'update' + singleModelNameCap
  const destroyModel = 'destroy' + singleModelNameCap

  // --------------
  // --- CREATE ---
  // --------------
  // -- SINGLE
  const SINGLE_CREATE_START   = singleModelNameUp + '_CREATE_START'
  const SINGLE_CREATE_SUCCESS = singleModelNameUp + '_CREATE_SUCCESS'
  const SINGLE_CREATE_ERROR   = singleModelNameUp + '_CREATE_ERROR'

  // -- PLURAL
  const PLURAL_CREATE_START   = pluralModelNameUp + '_CREATE_START'
  const PLURAL_CREATE_SUCCESS = pluralModelNameUp + '_CREATE_SUCCESS'
  const PLURAL_CREATE_ERROR   = pluralModelNameUp + '_CREATE_ERROR'


  // --------------
  // ---- FIND ----
  // --------------
  // -- SINGLE
  const SINGLE_FIND_START   = singleModelNameUp + '_FIND_START'
  const SINGLE_FIND_SUCCESS = singleModelNameUp + '_FIND_SUCCESS'
  const SINGLE_FIND_ERROR   = singleModelNameUp + '_FIND_ERROR'

  // -- PLURAL
  const PLURAL_FIND_START   = pluralModelNameUp + '_FIND_START'
  const PLURAL_FIND_SUCCESS = pluralModelNameUp + '_FIND_SUCCESS'
  const PLURAL_FIND_ERROR   = pluralModelNameUp + '_FIND_ERROR'


  // --------------
  // --- UPDATE ---
  // --------------
  // -- SINGLE
  const SINGLE_UPDATE_START   = singleModelNameUp + '_UPDATE_START'
  const SINGLE_UPDATE_SUCCESS = singleModelNameUp + '_UPDATE_SUCCESS'
  const SINGLE_UPDATE_ERROR   = singleModelNameUp + '_UPDATE_ERROR'


  // --------------
  // --- DESTROY --
  // --------------
  // -- SINGLE
  const SINGLE_DESTROY_START   = singleModelNameUp + '_DESTROY_START'
  const SINGLE_DESTROY_SUCCESS = singleModelNameUp + '_DESTROY_SUCCESS'
  const SINGLE_DESTROY_ERROR   = singleModelNameUp + '_DESTROY_ERROR'



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

    // -------------------
    // FIND SINGLE MODEL
    // -------------------
    [findModel] : (modelId) => {
      function start() {
        return {type: SINGLE_FIND_START}
      }
      function success(model) {
        return {
          type              : SINGLE_FIND_SUCCESS,
          [singleModelName] : model,
          receivedAt        : now()
        }
      }
      function error(error, modelId) {
        return {
          type              : SINGLE_FIND_ERROR,
          data              : modelId,
          error             : error
        }
      }

      return dispatch => {
        if(!modelId){
          return new Promise((resolve, reject) => {
            resolve(dispatch(error({message : 'no modelId given for action '+'find' + singleModelNameCap}, undefined)))
          })
        }

        dispatch(start())

        // Create headers for each action - depends on hostConfig
        // See utils/headers
        const headers = headersUtil(hostConfig, singleModelName)

        return new XHR(hostConfig, headers[findModel], `${baseUrl}/${urlModel}/${modelId}`)
        .get()
        .then(res => dispatch(success(res)))
        .catch(err => dispatch(error(err, modelId)))
      }

    },


    // -------------------
    // FIND PLURAL MODEL
    // -------------------
    [findModels] : (request = 'limit=10000') => {

      request = request.length > 0 ? '?' + request : ''

      function start() {
        return {type: PLURAL_FIND_START}
      }
      function success(models) {
        return {
          type              : PLURAL_FIND_SUCCESS,
          [pluralModelName] : modelsWithTmpId(models),
          receivedAt        : now()
        }
      }
      function error(error) {
        return {
          type             : PLURAL_FIND_ERROR,
          error            : error,
        }
      }
      return dispatch => {
        dispatch(start())

        // Create headers for each action - depends on hostConfig
        // See utils/headers
        const headers = headersUtil(hostConfig, singleModelName)

        return new XHR(hostConfig, headers[findModels], `${baseUrl}/${urlModel}${request}`)
        .get()
        .then(res => dispatch(success(res)))
        .catch(err => dispatch(error(err)))
      }

    },

    //  http://www.kammerl.de/ascii/AsciiSignature.php
    //  nancyj-underlined

  //   a88888b.  888888ba   88888888b  .d888888  d888888P  88888888b
  //  d8'   `88  88    `8b  88        d8'    88     88     88
  //  88        a88aaaa8P' a88aaaa    88aaaaa88a    88    a88aaaa
  //  88         88   `8b.  88        88     88     88     88
  //  Y8.   .88  88     88  88        88     88     88     88
  //   Y88888P'  dP     dP  88888888P 88     88     dP     88888888P
  //  ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo


    // -------------------
    // CREATE SINGLE MODEL
    // -------------------
    [createModel] : (model) => {
      function start(model) {
        return {
          type: SINGLE_CREATE_START,
          [singleModelName] : {...model}
        }
      }
      function success(model) {
        return {
          type              : SINGLE_CREATE_SUCCESS,
          [singleModelName] : model,
          message           : singleModelName + ' has been created'
        }
      }
      function error(error, model) {
        return {
          type              : SINGLE_CREATE_ERROR,
          data              : model,
          error             : error
        }
      }

      return dispatch => {
        // Check if the object passed to create has properties or is a FormData Object
        if((!model || Object.keys(model).length === 0) && (typeof FormData === 'undefined' || (typeof FormData !== 'undefined' && !(model instanceof FormData)))){
          return new Promise((resolve, reject) => {
            resolve(dispatch(error({message : 'no model given for action create' + singleModelNameCap}, undefined)))
          })
        }

        // Add ability to upload FormData
        if(typeof FormData !== 'undefined' && model instanceof FormData){
          var modelToCreate = model

        // If FormData is used, tmpId will not be set and model will not be added to models in reducer
        }else{
          var modelWithTmpId = dispatch(start(model))[singleModelName];
          var modelToCreate = {};
          for (var attribute in modelWithTmpId) {
            if (attribute !== 'tmpId') modelToCreate[attribute] = modelWithTmpId[attribute];
          }
        }

        // Create headers for each action - depends on hostConfig
        // See utils/headers
        const headers = headersUtil(hostConfig, singleModelName)

        return new XHR(hostConfig, headers[createModel], `${baseUrl}/${urlModel}`)
        .post(modelToCreate)
        .then(res => dispatch(success(modelWithTmpId)))
        .catch(err => dispatch(error(err, modelWithTmpId)))
      }

    },



    //  http://www.kammerl.de/ascii/AsciiSignature.php
    //  nancyj-underlined

    // dP     dP  888888ba  888888ba   .d888888  d888888P  88888888b
    // 88     88  88    `8b 88    `8b d8'    88     88     88
    // 88     88 a88aaaa8P' 88     88 88aaaaa88a    88    a88aaaa
    // 88     88  88        88     88 88     88     88     88
    // Y8.   .8P  88        88    .8P 88     88     88     88
    // `Y88888P'  dP        8888888P  88     88     dP     88888888P
    // oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo

    // -------------------
    // UPDATE SINGLE MODEL
    // -------------------
    [updateModel] : (newModel) => {
      function start() {
        return {
          type              : SINGLE_UPDATE_START,
          [singleModelName] : newModel
        }
      }
      function success(validatedModel) {
        return {
          type              : SINGLE_UPDATE_SUCCESS,
          [singleModelName] : validatedModel,
          message           : singleModelName + ' has been updated'
        }
      }
      function error(error) {
        return {
          type              : SINGLE_UPDATE_ERROR,
          error             : error
        }
      }

      return dispatch => {
        if(!newModel){
          return new Promise((resolve, reject) => {
            resolve(dispatch(error({message : 'no model given for action update' + singleModelNameCap}, undefined)))
          })
        }

        // Create headers for each action - depends on hostConfig
        // See utils/headers
        const headers = headersUtil(hostConfig, singleModelName)

        dispatch(start())
        return new XHR(hostConfig, headers[updateModel], `${baseUrl}/${urlModel}/${newModel.id}`)
        .put(newModel)
        .then(res => dispatch(success(res)))
        .catch(err => dispatch(error(err)))
      }
    },
    // -------------------
    // UPDATE PLURAL MODELS
    // -------------------
    // Sails blueprint does not support multi update
    // If it is neeeded I will implement it



    //  http://www.kammerl.de/ascii/AsciiSignature.php
    //  nancyj-underlined

    // 888888ba   88888888b .d88888b  d888888P  888888ba   .88888.  dP    dP
    // 88    `8b  88        88.    "'    88     88    `8b d8'   `8b Y8.  .8P
    // 88     88 a88aaaa    `Y88888b.    88    a88aaaa8P' 88     88  Y8aa8P
    // 88     88  88              `8b    88     88   `8b. 88     88    88
    // 88    .8P  88        d8'   .8P    88     88     88 Y8.   .8P    88
    // 8888888P   88888888P  Y88888P     dP     dP     dP  `8888P'     dP
    // oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo

    // -------------------
    // DESTROY SINGLE MODEL
    // -------------------
    [destroyModel] : modelId => {
      function start() {
        return {
          type              : SINGLE_DESTROY_START,
          modelId
        }
      }
      function success() {
        return {
          type              : SINGLE_DESTROY_SUCCESS,
          message           : singleModelName + ' has been destroyed',
          modelId
        }
      }
      function error(error) {
        return {
          type              : SINGLE_DESTROY_ERROR,
          data              : modelId,
          error             : error
        }
      }

      return dispatch => {

        dispatch(start())

        // Create headers for each action - depends on hostConfig
        // See utils/headers
        const headers = headersUtil(hostConfig, singleModelName)

        return new XHR(hostConfig, headers[destroyModel], `${baseUrl}/${urlModel}/${modelId}`)
        .delete()
        .then(res => dispatch(success(res)))
        .catch(err => dispatch(error(err)))
      }
    },
    // -------------------
    // DESTROY PLURAL MODELS
    // -------------------
    // Sails blueprint does not support multi destroy
    // If it is neeeded I will implement it
  }
}
