# Parchment React Flux Immutable (and Command Manager)

## Building App For Development:

```
$ npm install
```

Browserify build and watch
```
$ gulp dev && gulp watch
```

Serving Dist Files From A Local Server:
```
$ python -m SimpleHTTPServer
```

Then visit localhost:8000 in your browser.


## Adding Actions To The App:

### constants/app-constants.js
  * define actions in app constants
  * include action binaries in the reverse hash
  (note: to exclude an action from the command manager, list action in notForCommandManager, and dont list a reverse hash)

### stores/exampleDataStore.js
  * define methods to manipulate your Immutable data store
  * must return the Immutable data store in your method

### stores/app-store.js
  * add your actions to app-store switch statement. 
  * invoke store methods, with a store, to receive action payloads

Note: I decided to treat state as another store. Much simpler than using the react state.
