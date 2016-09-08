import path from 'object-path'

module.exports = function bearerUtil(windowAccess, hostConfig, singleModelName){

  var headers = {}
  var authConfig = path.get(hostConfig, `apiSpecs.${singleModelName}.auth`)
  var localStorageName = path.get(hostConfig, 'localStorageName') || 'JWT'
  var hasLocalStorage = path.get(windowAccess, 'localStorage.getItem');

  if(authConfig && hasLocalStorage){

    authConfig.forEach(action => {

      // Return a function to get the token each time the action is dispatched
      headers[action] = function() {
        let JWT_Token = windowAccess.localStorage.getItem(localStorageName)

        return {
          headers : {'Authorization': `Bearer ${JWT_Token}`}
        }
      }
    })
  }

  return headers
}
