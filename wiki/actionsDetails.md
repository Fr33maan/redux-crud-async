#### Actions Details

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
      error : error // error returned by server or thrown during the actions flow
    }

  }
```

findUsers(?request) -> request is an additional parameter which will be appened to the url following sails conventions  

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
      error : error // error returned by server or thrown during the actions flow
    }

  }
```

createUser(userToCreate)  
You can submit a FormData to `create` but the FormData is transmitted as is and model will not be appended to the state.
If you need the model to be appended to the state, use a javascript object instead of a FormData.   

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
