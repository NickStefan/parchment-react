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
  }
});

/////////////////////////////
// from dispatcher to store methods
AppStore.dispatchToken = AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.type) {

    case ActionTypes.typing:
      docData = docDataMethods._typing(docData, payload.action.args);
      break;

    case ActionTypes.setSelection:
      docData = docDataMethods._setSelection(docData, payload.action.args);
      break;
    
    default:
      // do nothing
  }

  AppStore.emitChange();
  return true;
});

module.exports = AppStore;