# Redux CRUD Async
Redux CRUD Async will help you to avoid writing boilerplate code for redundant actions.

It currently uses [axios](https://github.com/mzabriskie/axios) for xhr but I plan to also
implement [sails.io](https://github.com/balderdashy/sails.io.js) websocket (custom socket.io).  

# Conventions
This module is built to work with sails.js blueprints using [sails-rest-api conventions](https://github.com/ghaiklor/generator-sails-rest-api).

It differentiate singular and plural model name : findUser !== findUsers


## Actions available
#### Primary
- findUser(userId)
- findUsers
- createUser(userToCreate)

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
    host   : 'https://my-api.com',
    prefix : 'v1' // Facultative
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
    ...crud.primaryReducerFor('channel'),
    ...crud.primaryReducerFor('tag'),

    ...crud.associationReducerFor('channel', 'tag')
  }

```


# TODO
- test utils
- check how to get babel in tests
- comment code
- normalize ES5 vs ES6 imports
- update & delete for model & models
- overwrite urls for integration with other APIs
- websocket support for sails
