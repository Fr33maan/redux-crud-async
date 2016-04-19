var path              = require('object-path')
var uuid              = require('uuid')
var axios             = require('axios')
var checkModelName    = require('../utils/checkModelName')
var capitalize        = require('../utils/capitalize')
var pluralize         = require('pluralize')
var modelsWithTmpId   = require('../utils/arrayItemsWithTmpId')
var getSessionStorage = require('../utils/getSessionStorage')
var now = Date.now


var chalk             = require('chalk')
var redError = msg => console.log(msg)


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

  var bearers = {}
  var authConfig = path.get(hostConfig, `apiSpecs.${singleModelName}.auth`)
  var sessionStorageName = path.get(hostConfig, 'sessionStorageName') || 'JWT'

  if(authConfig && getSessionStorage){

    let JWT_Token = getSessionStorage(sessionStorageName)

    authConfig.forEach(action => {
        bearers[action] = {
          headers : {'Authorization': `Bearer ${JWT_Token}`}
        }
    })
  }

  const findModel   = 'find' + singleModelNameCap
  const findModels  = 'find' + pluralModelNameCap
  const createModel = 'create' + singleModelNameCap

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

  // -- PLURAL
  const PLURAL_UPDATE_START   = pluralModelNameUp + '_UPDATE_START'
  const PLURAL_UPDATE_SUCCESS = pluralModelNameUp + '_UPDATE_SUCCESS'
  const PLURAL_UPDATE_ERROR   = pluralModelNameUp + '_UPDATE_ERROR'



  // --------------
  // --- DESTROY --
  // --------------
  // -- SINGLE
  const SINGLE_DESTROY_START   = singleModelNameUp + '_DESTROY_START'
  const SINGLE_DESTROY_SUCCESS = singleModelNameUp + '_DESTROY_SUCCESS'
  const SINGLE_DESTROY_ERROR   = singleModelNameUp + '_DESTROY_ERROR'

  // -- PLURAL
  const PLURAL_DESTROY_START   = pluralModelNameUp + '_DESTROY_START'
  const PLURAL_DESTROY_SUCCESS = pluralModelNameUp + '_DESTROY_SUCCESS'
  const PLURAL_DESTROY_ERROR   = pluralModelNameUp + '_DESTROY_ERROR'

  return {

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
        return axios.get(`${baseUrl}/${urlModel}/${modelId}`, bearers[findModel])
          .then(res => dispatch(success(res.data.data)))
          .catch(res => dispatch(error(res.data, modelId)))
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
        return axios.get(`${baseUrl}/${urlModel}${request}`, bearers[findModels])
          .then(res => dispatch(success(res.data.data)))
          .catch(res =>dispatch(error(res.data)))
      }

    },


    // -------------------
    // CREATE SINGLE MODEL
    // -------------------
    [createModel] : (model) => {
      function start(model) {
        return {
          type: SINGLE_CREATE_START,
          [singleModelName] : {
            ...model,
            tmpId : uuid.v4()
          }
        }
      }
      function success(model) {
        return {
          type              : SINGLE_CREATE_SUCCESS,
          [singleModelName] : model
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
        if(!model || Object.keys(model).length === 0){
          return new Promise((resolve, reject) => {
            resolve(dispatch(error({message : 'no model given for action create' + singleModelNameCap}, undefined)))
          })
        }

        var modelWithTmpId = dispatch(start(model))[singleModelName]
        var modelToCreate = {}
        for(let attribute in modelWithTmpId){
          if(attribute !== 'tmpId') modelToCreate[attribute] = modelWithTmpId[attribute]
        }
        try{
          return axios.post(`${baseUrl}/${urlModel}`,modelToCreate, bearers[createModel])
            .then(res => dispatch(success(modelWithTmpId)))
            .catch(res => dispatch(error(res.data, modelWithTmpId)))
        }catch(e){redError}

      }

    },

    // TODO might be useless as multiple create could be handle by multiple single create
    // -------------------
    // CREATE PLURAL MODEL
    // -------------------




    // -------------------
    // UPDATE SINGLE MODEL
    // -------------------
    // -------------------
    // DESTROY SINGLE MODEL
    // -------------------

    // -------------------
    // UPDATE PLURAL MODEL
    // -------------------
    // -------------------
    // DESTROY PLURAL MODEL
    // -------------------
  }
}
