# Redux CRUD Async
[![Build Status](https://travis-ci.org/prisonier/redux-crud-async.svg?branch=master)](https://travis-ci.org/prisonier/redux-crud-async)

Redux CRUD Async will help you to avoid writing boilerplate code for redundant actions.

It currently uses [axios](https://github.com/mzabriskie/axios) for xhr but I plan to also
implement [sails.io](https://github.com/balderdashy/sails.io.js) websocket (custom socket.io).  

Currently it allow you to interact with a REST API with or without a JWT Token to authenticate requests.
In a near future, I will implement the possibility to create random actions like `sign_in`, `sign_out` or `tranformThisLeadInGold`

# Conventions
This module is built to work with sails.js blueprints using [sails-rest-api conventions](https://github.com/ghaiklor/generator-sails-rest-api).

It differentiate singular and plural model name : findUser !== findUsers

**IMPORTANT !**
As sails.js, this module uses [pluralize module](https://www.npmjs.com/package/pluralize) which pluralize words for real.

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



##Configuration

####host
Your API host - must be defined

####prefix (optional)
A prefix for all your routes. Default to null.
Don't add the slash `/` on the prefix it will be automatically added.

####pluralizeModels (optional)
Default to true, use pluralized model names in **url**.
This has no affect on action names.


findPerson -> will hit `GET /people/:id`  
findPeople -> will hit `GET /people`


**With** `pluralizeModels : false`

findPerson -> will hit `GET /person/:id`  
findPeople -> will hit `GET /person`


####sessionStorageName (optional)
The key for retrieving your JWT Token from `window.sessionStorage`
Default to 'JWT'

####apiSpecs (optional)
Routes where you want to use the JWT_Token.
Defaults to none.

**Token is set in Authorization header as :**

```javascript
// Config sent to axios
{
    headers : {
      Authorization : 'Bearer '+ JWT_Token_from_sessionStorage
    }
}
```

You just have to set the **unpluralized** modelName or `primarymodelAssociatedmodels` with an `auth` property inside which contains an array of actions to authenticate.  
Just follow conventions given above.

```javascript
{
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


## Action types
#### Async flow

There is a maximum of **9** actions for a given model.  
eg. primary model = `channel`, associated model = `tag`  

4 primary     ->
> FIND_CHANNEL   -> GET channels/:id  
> CREATE_CHANNEL -> POST channels  
> UPDATE_CHANNEL -> PUT channels/:id  
> DELETE_CHANNEL -> DELET channels/:id  
> EMPTY_CHANNEL  -> will set state.channel = {}

3 association ->
> FIND_CHANNEL_TAGS       -> GET channels/:channelId/tags/:tagId?  
> ADD_TAG_TO_CHANNEL      -> POST channels/:channelId/tags/:tagId? (if not tag id is set you must give an object to this function)  
> REMOVE_TAG_FROM_CHANNEL -> DELETE channels/:channelId/tags/:tagId  
> EMPTY_CHANNEL_TAGS      -> Sync action that will return an empty array

3 status actions are dispatched for every async action : **START**,  **SUCCESS** and **ERROR**    


## Actions available
#### Primary
findUser(userId) will dispatch following actions :

```javascript

  var actionTypes = {

    FIND_CHANNEL_START : {
      type : 'FIND_CHANNEL_START',
    },

    FIND_CHANNEL_SUCCESS : {
      type       : 'FIND_CHANNEL_SUCCESS',
      channel    : {foo: 'bar'},
      receivedAt : Date.now()
    },

    FIND_CHANNEL_ERROR : {
      type  : 'FIND_CHANNEL_ERROR',
      data  : channelId,
      error : error // error return by server
    }

  }
```

findUsers(?request) -> request is an additional parameter which will be appened to the url

```javascript

  var actionTypes = {

    FIND_CHANNELS_START : {
      type : 'FIND_CHANNELS_START',
    },

    FIND_CHANNELS_SUCCESS : {
      type       : 'FIND_CHANNELS_SUCCESS',
      channels    : {foo: 'bar', tmpId: 'each model will contain a v4 uuid'},
      receivedAt : Date.now()
    },

    FIND_CHANNELS_ERROR : {
      type  : 'FIND_CHANNELS_ERROR',
      error : error // error return by server
    }

  }
```

createUser(userToCreate)

```javascript

  var actionTypes = {

    CREATE_CHANNEL_START : {
      type    : 'CREATE_CHANNEL_START',
      channel : {foo: 'bar', tmpId: 'a v4 uuid'}
    },

    CREATE_CHANNEL_SUCCESS : {
      type       : 'CREATE_CHANNEL_SUCCESS',
      channel    : {foo: 'bar', tmpId: 'a v4 uuid'},
      receivedAt : Date.now()
    },

    CREATE_CHANNEL_ERROR : {
      type  : 'CREATE_CHANNEL_ERROR',
      data  : {foo: 'bar', tmpId: 'a v4 uuid'}
      error : error // error return by server
    }

  }
```


**Soon available**
- createUsers
- updateUser
- deleteUser
- deleteUsers

#### Associations
redux-crud-async comes with built in association support

- findUserPets(userId, petId?)
- addPetToUser(userId, petToCreate, userPets?)
- removePetFromUser(userId, petToRemove)

**Use it like this**

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

```javascript
// redux/actions/index.js
  var reduxCrudAsync = require('redux-crud-async')

  var hostConfig = {
    host            : 'https://my-api.com',
    prefix          : 'v1', // Optional - default to ''
    pluralizeModels : false, // Optional - default to true

  }

  var crud = new reduxCrudAsync(hostConfig)

  module.exports = {
    ...crud.primaryActionsFor('channel'),
    ...crud.primaryActionsFor('tag'),

    ...crud.associationActionsFor('channel', 'tag')
  }

```


## States (Reducers)
Reducers return the following states usable in your components

- user
- isFindingUser
- users
- isFindingUsers
- userPets
- isFindingUserPets

**Use it like this**

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

# Using it in a container

[Click here to see how much it is easy to use this module in a container](https://github.com/prisonier/redux-crud-async/blob/master/exemples/Container.jsx)


# TODO
- make this module more database style with holding of previous records
- better doc "how to use actions"
- make api expectations editables
- comment code
- add single actions (signup, signin)
- update & delete for model & models
- websocket support for sails
- normalize ES5 vs ES6 imports
- find a way to test FormData in createModel
