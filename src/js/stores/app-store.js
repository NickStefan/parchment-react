var EventEmitter = require('events').EventEmitter;
var _ = {
  extend: require('lodash/object/extend')
};

var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var ActionTypes = AppConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var docDataStore = require('../stores/doc-data-store');
var docDataMethods = docDataStore.storeMethods;
var docData = docDataStore.data;

var docStateStore = require('../stores/doc-state-store');
var docStateMethods = docStateStore.stateMethods;
var docState = docStateStore.state;

/////////////////////////////
// Store Public Methods
var AppStore = _.extend(EventEmitter.prototype, {
  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);
  },
  removeEventListener: function(callback){
    this.removeEventListener(CHANGE_EVENT, callback);
  },
  getDoc: function(){
    return docData;
  },
  getDocState: function(){
    return docState;
  }
});

/////////////////////////////
// from dispatcher to store methods
AppStore.dispatchToken = AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.type) {

    // state and data changes
    case ActionTypes.addToThing:
      docData = docDataMethods._someMethod(docData, payload.action.args);
      break;

    case ActionTypes.removeFromThing:
      docData = docDataMethods._someOtherMethod(docData, payload.action.args);
      break;

    case ActionTypes.otherAction:
      docState = docStateMethods._otherMethod(docState, payload.action.args);
      break;
    
    default:
      // do nothing
  }
  AppStore.emitChange();
  return true;
});

module.exports = AppStore;