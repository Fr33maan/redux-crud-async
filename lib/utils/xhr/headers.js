'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var path = require('object-path');
var windowAccess = typeof window !== 'undefined' ? window : {}; // Make it available in tests

module.exports = function headersUtil(hostConfig, singleModelName) {
  var defaultLocalStorageName = 'JWT';
  var headers = {};
  var hasLocalStorage = path.get(windowAccess, 'localStorage.getItem');
  var authConfig = path.get(hostConfig, 'apiSpecs.' + singleModelName + '.auth');

  // Return empty headers if there is no localStorage to store the JWT or no config for the action
  if (!hasLocalStorage || !authConfig) return headers; // empty headers

  var localStorageName = path.get(hostConfig, 'localStorageName') || defaultLocalStorageName;
  var headerContent = path.get(hostConfig, 'headerContent') || 'Bearer {{' + localStorageName + '}}';
  var headerFormat = path.get(hostConfig, 'headerFormat') || 'Authorization';
  var JWT = windowAccess.localStorage.getItem(localStorageName);

  if (!JWT) console.error('WARNING - can not find ' + localStorageName + ' in local storage');
  authConfig.forEach(function (action) {
    var authBearer = headerContent.replace('{{' + localStorageName + '}}', JWT);

    // Return a function to get the token each time the action is dispatched
    headers[action] = _defineProperty({}, headerFormat, authBearer);
  });

  return headers;
};