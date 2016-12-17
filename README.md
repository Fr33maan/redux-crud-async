# redux-crud-async
[![Build Status](https://travis-ci.org/l1br3/redux-crud-async.svg?branch=master)](https://travis-ci.org/l1br3/redux-crud-async)

redux-crud-async will create CRUD async actions and states automatically, just for you.  
The configuration is minimalist.  

It currently uses [axios](https://github.com/mzabriskie/axios) or [sails.io](https://github.com/balderdashy/sails.io.js) websocket (custom socket.io) for XHR.  
It allows you to use a REST API with authentication with a Bearer Token.    
In a near future, I will implement the possibility to create random actions like `sign_in`, `sign_out` or `tranformThisLeadInGold`  
Redux-crud-async is built against 150+ tests. Unfortunately this does not mean that redux-crud-async is bug free, please send issues if you find one !

## Table of Contents
1. [Setup](#setup)  
2. [Conventions](#conventions)  
    a. [Routes](#routes)  
    b. [Authentication](#authentication)  
    c. [Socket](#socket)  
3. [Configuration](#configuration)
4. [Actions](#actions)  
    a. [Names](#names)  
    b. [Additionnal Actions](#additionnal-actions)  
5. [States (Reducers)](#states-reducers)
6. [Todo](#todo)
7. [Change Log](#change-log)

---


## Setup

#### NPM
you can [find it on NPM](https://www.npmjs.com/package/redux-crud-async)
```
npm i -S redux-crud-async
```

#### ActionTypes
```javascript
// redux/actionTypes/index.js
  var reduxCrudAsync = require('redux-crud-async')
  var crud = new reduxCrudAsync()

  module.exports = {
    ...crud.primaryActionTypesFor('channel'),
    ...crud.primaryActionTypesFor('tag'),

    ...crud.associationActionTypesFor('channel', 'tag')
  }

```

#### Actions
```javascript
// redux/actions/index.js
  var reduxCrudAsync = require('redux-crud-async')

  var hostConfig = {
    host            : 'https://my-api.com',
    prefix          : 'v1', // Optional - default to ''
    pluralizeModels : false, // Optional - default to true

  }

  var crud = new reduxCrudAsync(hostConfig) // hostConfig is mandatory for actionsGenerator

  module.exports = {
    ...crud.primaryActionsFor('channel'),
    ...crud.primaryActionsFor('tag'),

    ...crud.associationActionsFor('channel', 'tag')
  }

```

#### Reducers
```javascript
// redux/reducers/index.js
  var reduxCrudAsync = require('redux-crud-async')
  var crud = new reduxCrudAsync()

  module.exports = {
    ...crud.primaryReducerFor('user'),
    ...crud.primaryReducerFor('pet'),

    ...crud.associationReducerFor('user', 'pet')
  }

```
**EXEMPLE USAGE**
[Click here to see how much it is easy to use this module](https://github.com/l1br3/redux-crud-async/blob/master/exemples/Container.jsx)

---


## Conventions

#### General
It might be obvious but all models returned by your database need to have an unique id.  


#### Routes
This module is built to work with sails.js blueprints routes using [sails-rest-api conventions](https://github.com/ghaiklor/generator-sails-rest-api/wiki/Sub-Generators#blueprints).  
It differentiate singular and plural model name : findUser !== findUsers  
**IMPORTANT !**
As sails.js, this module uses [pluralize module](https://www.npmjs.com/package/pluralize) which pluralize words grammaticaly.  

some exemples :   
channel -> channels  
person  -> people  
coach   -> coaches  

By default, all your routes will be pluralized, `Person` model will have the following :

**state :**  
person - a single person  
people - all your "persons"  

**actions :**
findPerson -> will hit `GET /people/:id`  
findPeople -> will hit `GET /people`  

**You can unpluralize your urls by setting it in the config**



#### Authentication
`redux-crud-async` uses a Bearer Token to authenticate requests. It is store in `window.localStorage`.  
Every request which need authentication is sent with the token in the header following this convention :  

**Token is set in Authorization header as :**
```javascript
// Config sent to axios or socket.io
{
    headers : {
      Authorization : 'Bearer '+ JWT_Token_from_localStorage
    }
}
```


#### Socket  
We use the [`io.socket.request`](http://sailsjs.org/documentation/reference/web-sockets/socket-client/io-socket-request) to communicate to the server.  
Make sure that your server can use it if you don't use sails.js on server side.  

---




##Configuration

#### Config file

| Name  | Type  | Default | Description |
|:---         |:---      |:---      |:---         |
| host | `String` | null | Your API host - must be defined |
| prefix | `String` | null | A prefix for all your routes. Don't add the slash `/` on the prefix it will be automatically added.|
| pluralizeModels | `Boolean` | true |  Use pluralized model names in **url**. This has no affect on action names. |
| socket | `Boolean` | false | Use socket.io for actions |
| localStorageName | `String` | "JWT" | The key for retrieving your JWT Token from `window.localStorage` |
| headerContent | `String` | "Bearer {{JWT}}" | The format of your header content **The format is affected by `localStorageName`** |
| headerFormat | `String` | "Authorization" | The format of your header authorization key |
| apiSpecs | `Object` | null | Routes where you want to use the JWT_Token |
| responseSchemas | `Object` | `{http: {success : 'data.data', error : 'data'}, socket : {success : null, error : null}}` | schemas of your API's responses. Where the data can be found in your response object

**The format of headerContent is affected by `localStorageName` if you change the default value**
```javascript
{
  localStorageName : 'myJWT',
  headerContent : 'MyContent {{myJWT}}'
}
```

**For apiSpecs** you just have to set the **unpluralized** modelName or `primarymodelAssociatedmodels` with an `auth` property inside which contains an array of actions to authenticate.  
Just follow conventions given above.


```javascript
{
  host            : 'http://your-api-host',
  prefix          : 'my-prefix',
  pluralizeModels : false,
  socket          : true,
  localStorageName: 'MyJWT',
  headerContent   : 'AuthBearer {{MyJWT}}',
  headerFormat    : 'AuthBearerHeaderKey'
  apiSpecs : {

    coach : {
      // All the following actions will be beared with a JWT
      auth : ['findCoaches', 'createCoach', 'updateCoach']
    },

    coachComments : {
      auth : ['addCommentToCoach', 'removeCommentFromCoach']
    }
  }
}
```

#### Results
findPerson -> will hit `GET http://your-api-host/my-prefix/people/:id`  
findPeople -> will hit `GET http://your-api-host/my-prefix/people`


**With** `pluralizeModels : false`
findPerson -> will hit `GET http://your-api-host/my-prefix/person/:id`  
findPeople -> will hit `GET http://your-api-host/my-prefix/person`







---

## Actions

#### Names
There is a maximum of **11** actions for a given model which will be automatically understood by reducers.  
3 status actions are dispatched for every redux-crud-async action : **START**,  **SUCCESS** and **ERROR**. They are automatically understood by reducers.  
eg. primary model = `channel`, associated model = `tag`  

**3 primary**

| actionName      | url                     | param | state     | state Type  |  
|:---             |:---                     |:---      |:---       |:---         |  
| `findChannel`   | `GET channels/:id`      | `String` | channel   | `Object`    |  
| `findChannels`  | `GET channels?request`  | `String` | channels  | `[Object]`  |  
| `createChannel` | ` POST channels`        | `Object OR FormData `| channel   | `Object`    |  

*updateChannel and deleteChannel come soon*

**You can submit a FormData to `create` but the FormData is transmitted as is and model will not be appended to the state.
If you need the model to be appended to the state, use a javascript object instead of a FormData.
FormData can be used to send specific CRUD actions like uploading an image**

**3 association**

| actionName | url | parameters | state   | state Type | Comment |
|:---        |:---      |:---   |:---    |:---        |:---  |
| `findChannelTags` | `GET channels/:channelId/tags/:tagId?` | `String, String` | channelTags | `[Object]` | |
| `addTagToChannel` | `POST channels/:channelId/tags/:tagId?` |`String, String OR Object` | channelTag | `Object` | if no tag id is set you must give an object to this function |
| `createChannel` | ` POST channels` | `String, String` | channelTag | `Object` |  |


#### Additionnal actions

An additionnal action exists which empties reducers. Dispatch manually this action to empty your reducers.  
```javascript
{
  type : 'EMPTY_CHANNEL'
}
{
  type : 'EMPTY_CHANNELS'
}
{
  type : 'EMPTY_PRIMARY_ASSOCIATED_MODELS'
}
```
Have a look in [primaryActionGenerator](https://github.com/l1br3/redux-crud-async/blob/master/src/primaryActionGenerator.js) and [associationActionGenerator](https://github.com/l1br3/redux-crud-async/blob/master/src/associationActionGenerator.js) and [Actions Details](https://github.com/l1br3/redux-crud-async/blob/socket/wiki/actionsDetails.md) for more precision about dispatched actions.







## States (Reducers)
Reducers return the following states usable in your components

| state | type |
|:--- |:--- |
| channel | `Object` |
| isFindingChannel | `Boolean` |
| channels | `[Object]` |
| isFindingChannels | `Boolean` |
| channelTags | `[Object]` |
| isFindingChannelTags | `Boolean` |


See reducers :
- [primaryReducerGenerator](https://github.com/l1br3/redux-crud-async/blob/socket/src/primaryReducerGenerator.js)
- [associationReducerGenerator](https://github.com/l1br3/redux-crud-async/blob/socket/src/associationReducerGenerator.js)



---

## TODO
- remove arrow functions in tests
- comment code
- find a way to test FormData in createModel
- add single actions (signup, signin)
- add coverage
- move associated record uuid generation from actions dispatch to reducer
- state immutability
- make API endpoints editables
- add tests for caching
- cache timeout by route
- add cache for get requests
- add some headers tests

## Change Log
##### 0.6.3
- update and delete primary actions
- fix bug when building with webpack - io was undefined
- fix silly bugs and add tests for them

##### 0.5.0
- API expectation editables

##### 0.4.0
- add socket.io support through the window.io variable
- more tests
- rewrite of the utils/xhr/* module
- doc changes
- added EMPTY_CHANNELS action in reducers
