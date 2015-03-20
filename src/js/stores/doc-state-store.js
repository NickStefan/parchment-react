var Immutable = require('immutable');
var _ = {
  mapValues: require('lodash/object/mapValues'),
  random: require('lodash/number/random')
};

/////////////////////////////
// State Model

var defaultSpan = function(){
  return Immutable.Map({});
}

var defaultBlock = function(){
  return Immutable.Map({
    type: 'paragraph',
    spans: Immutable.List([ defaultSpan() ])
  });
}

var defaultState = function() {
  return Immutable.Map({
    'docId': _.random(0,1000000000),
    'blocks': Immutable.List([ defaultBlock() ]),
    'startBlock': null,
    'endBlock': null,
    'startSpan': null,
    'endSpan': null,
    'startIndex': null,
    'endIndex': null
  });
};

var state = defaultState();

/////////////////////////////
// Private State Methods
var stateMethods = {
  _setSelection: function(state, startBlock, endBlock, startSpan, endSpan, startIndex, endIndex, chr){
    return state = state
    .set('startBlock', startBlock)
    .set('endBlock', endBlock)
    .set('startSpan', startSpan)
    .set('endSpan', endSpan)
    .set('startIndex', startIndex)
    .set('endIndex', endIndex);
  }
}

// map the invoked arguments to the expected arguments defined above.
// this is a convenience to keep actions, dispatchers, etc generic
// up until actually invoking the store methods above
// example: 
// invoked in the dispatcher as:
//   store.Method(store1, args); 
// invokes the methods defined above as
//   store.Method(store1, args[0], args[1] ... etc )
stateMethods = _.mapValues(stateMethods, function(fn,fnName,classObj) {
  return function(){
    var store = arguments[0];
    arguments[1] = arguments[1] || [];
    var dispatchedArgs = arguments[1].length ? arguments[1] : undefined;
    var args = [ store ].concat(dispatchedArgs);
    return fn.apply(classObj, args);
  }
});

module.exports = {
  stateMethods: stateMethods,
  state: state
}